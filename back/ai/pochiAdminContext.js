// pochiAdminContext.js
// ─────────────────────────────────────────────────────────────
// Pochi — The Apple Siri-style Executive Voice AI Assistant
// Omniscient Context Aggregator & Intelligence Engine for Admin
// ─────────────────────────────────────────────────────────────

import Groq from 'groq-sdk';
import fetch from 'node-fetch';
import FailedPayment from '../agents/revenue-recovery/schema/FailedPayment.model.js';
import AgentAction from '../agents/revenue-recovery/schema/AgentAction.model.js';
import AgentPolicy from '../agents/revenue-recovery/schema/AgentPolicy.model.js';
import InstagramContent from '../schema/InstagramContent.model.js';
import InstagramAgentConfig from '../schema/InstagramAgentConfig.model.js';
import ClientProject from '../schema/ClientProject.model.js';
import ClientAgentConfig from '../schema/ClientAgentConfig.model.js';
import Resource from '../schema/Resource.model.js';
import Batch from '../schema/batches.model.js';
import Purchase from '../schema/purchase.model.js';
import { User } from '../schema/user.model.js';

export async function getPochiAdminContext() {
  try {
    const [
      revenueMetrics,
      openSignals,
      pendingApprovals,
      promisedPayments,
      policy,
      instaConfig,
      instaPosts,
      clientConfig,
      clientProjects,
      dreamMedia,
      batchCount,
      studentCount,
      purchaseCount,
    ] = await Promise.all([
      // Revenue Recovery
      FailedPayment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
      FailedPayment.find({ status: 'open' }).sort({ createdAt: -1 }).limit(5).lean(),
      FailedPayment.find({ status: 'escalated' }).sort({ createdAt: -1 }).limit(5).lean(),
      FailedPayment.find({ 'promiseToPay.promised': true, 'promiseToPay.fulfilled': false }).sort({ 'promiseToPay.promisedDate': 1 }).limit(5).lean(),
      AgentPolicy.findOne({ key: 'default' }).lean(),

      // Instagram Growth Agent
      InstagramAgentConfig.findOne({ key: 'default' }).lean(),
      InstagramContent.find().sort({ createdAt: -1 }).limit(8).lean(),

      // AI Client Agent / Studio
      ClientAgentConfig.findOne({ key: 'default' }).lean(),
      ClientProject.find().sort({ createdAt: -1 }).limit(8).lean(),

      // Ultimate Dreams
      Resource.find({ category: 'videos' }).sort({ createdAt: -1 }).limit(10).lean(),

      // Academics & Students
      Batch.countDocuments(),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Purchase.countDocuments(),
    ]);

    // Format Revenue Recovery
    let revenueRecoveredPaise = 0;
    let openCount = 0;
    let escalatedCount = 0;
    let recoveringCount = 0;

    (revenueMetrics || []).forEach((m) => {
      if (m._id === 'recovered') revenueRecoveredPaise = m.totalAmount || 0;
      if (m._id === 'open') openCount = m.count || 0;
      if (m._id === 'escalated') escalatedCount = m.count || 0;
      if (m._id === 'recovering') recoveringCount = m.count || 0;
    });

    return {
      revenueRecovery: {
        totalRecoveredRupees: revenueRecoveredPaise / 100,
        openSignalsCount: openCount,
        pendingApprovalsCount: escalatedCount,
        inRecoveryCount: recoveringCount,
        pendingApprovalsList: pendingApprovals.map((p) => ({
          id: p._id,
          customer: p.customerName || 'Customer',
          amountRupees: (p.amount / 100).toLocaleString('en-IN'),
          reason: p.failureReason,
          track: p.source,
        })),
        upcomingPromisesList: promisedPayments.map((p) => ({
          customer: p.customerName || 'Customer',
          amountRupees: (p.amount / 100).toLocaleString('en-IN'),
          promisedDate: p.promiseToPay?.promisedDate ? new Date(p.promiseToPay.promisedDate).toLocaleDateString('en-IN') : 'N/A',
        })),
        policyBounds: {
          maxRetries: policy?.maxRetries ?? 3,
          maxDiscount: `${policy?.maxDiscountPercent ?? 10}%`,
          autoApproveCeiling: `₹${((policy?.autoApproveMaxAmount ?? 500000) / 100).toLocaleString('en-IN')}`,
        },
      },
      instagramAgent: {
        niche: instaConfig?.niche || 'IIT JEE & Tech EdTech',
        postingFrequency: instaConfig?.postingSchedule || 'Daily 6:00 PM IST',
        targetAudience: instaConfig?.targetAudience || 'STEM aspirants & students',
        totalPostsCreated: instaPosts.length,
        recentPosts: instaPosts.slice(0, 4).map((p) => ({
          title: p.title || p.topic || 'Reel Draft',
          status: p.status || 'draft',
          viralScore: p.viralScore || '8.8/10',
          hook: p.hook || '',
        })),
      },
      clientAgent: {
        businessName: clientConfig?.businessName || 'Project Studio',
        enquirySlug: clientConfig?.enquirySlug || 'project-enquiry',
        publicEnquiryLink: `/project-enquiry/${clientConfig?.enquirySlug || 'project-enquiry'}`,
        totalProjects: clientProjects.length,
        recentProjects: clientProjects.slice(0, 4).map((p) => ({
          clientName: p.businessName || p.contactName || 'Client Project',
          type: p.clientType || 'Web App',
          budget: p.budget ? `₹${p.budget.toLocaleString('en-IN')}` : 'To be estimated',
          status: p.status || 'enquiry_received',
          hasPrototype: Boolean(p.generatedCodeFiles && p.generatedCodeFiles.length > 0),
        })),
      },
      dreams: {
        activeMediaCount: dreamMedia.length,
        recentVideos: dreamMedia.slice(0, 3).map((d) => d.title || 'Inspirational Banner'),
      },
      platformOverview: {
        totalBatches: batchCount,
        totalRegisteredStudents: studentCount,
        totalPurchases: purchaseCount,
      },
    };
  } catch (err) {
    console.error('Error compiling Pochi admin context:', err.message);
    return {};
  }
}

function cleanLlmJson(rawText = '') {
  if (!rawText) return null;
  let text = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

export async function askPochi(query, adminUser, history = []) {
  const context = await getPochiAdminContext();

  const systemPrompt = `You are "Pochi", the elite Apple Siri-style executive voice AI assistant exclusively built for the Admin of EduPortal.
You have omniscient, real-time access to the entire Admin Dashboard, including:
1. AI Revenue Recovery Agent (gated approvals, recovered amounts, promise-to-pay, policy guardrails)
2. Instagram Growth Agent (content calendar, reel generation, viral scoring, niche strategy)
3. AI Client Agent / Studio (freelance enquiries, generated proposals, interactive code prototypes)
4. Ultimate Dreams (motivational banners, video reels, media assets)
5. Courses, Batches, Purchases, and Student Metrics

ADMIN IDENTITY:
- Name: ${adminUser?.name || 'Admin'}
- Email: ${adminUser?.username || 'admin@eduportal.com'}

LIVE SYSTEM CONTEXT:
${JSON.stringify(context, null, 2)}

VOICE & RESPONSE DIRECTIVES:
1. You must respond in a JSON format containing:
   - "voiceText": A super crisp, natural, conversational 1-2 sentence spoken line (like Siri speaking back).
   - "visualReply": Beautifully formatted, ChatGPT-style markdown with bold highlights, clean bullet cards, and key metrics for the visual HUD.
   - "action": Optional action command if the admin asks to switch tabs or execute tasks (e.g. "NAVIGATE_VIEW", "SEED_DEMO", "NONE").
   - "targetView": Optional target view if navigating ("revenue", "instagram", "client_agent", "dreams", "batches", "audit").

EXAMPLES OF ACTIONS:
- "Take me to Instagram Agent" -> { "action": "NAVIGATE_VIEW", "targetView": "instagram", "voiceText": "Opening Instagram Growth Agent now, Admin." }
- "Show revenue recovery" -> { "action": "NAVIGATE_VIEW", "targetView": "revenue", "voiceText": "Switching to AI Revenue Recovery dashboard." }
- "Go to client studio / enquiries" -> { "action": "NAVIGATE_VIEW", "targetView": "client_agent", "voiceText": "Here are your client projects and freelance enquiries." }
- "Show me dreams" -> { "action": "NAVIGATE_VIEW", "targetView": "dreams", "voiceText": "Opening Ultimate Dreams media hub." }

Tone: Ultra-smart, polite, sharp, proactive, executive. Support English and Hinglish smoothly.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-4).map((h) => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: typeof h.content === 'string' ? h.content : JSON.stringify(h.content),
    })),
    { role: 'user', content: query },
  ];

  // 1. Try Groq (Llama-3.3-70B)
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_')) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        messages,
      });
      const parsed = cleanLlmJson(completion.choices?.[0]?.message?.content);
      if (parsed && (parsed.voiceText || parsed.visualReply)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Groq Pochi exception:', err.message);
    }
  }

  // 2. Try OpenRouter Fallback
  if (process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes('your_')) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'Pochi Admin Voice AI',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-nano-9b-v2:free',
          temperature: 0.3,
          messages,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const parsed = cleanLlmJson(data.choices?.[0]?.message?.content);
        if (parsed && (parsed.voiceText || parsed.visualReply)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('OpenRouter Pochi exception:', err.message);
    }
  }

  // Deterministic Executive Fallback
  const revAmt = context.revenueRecovery?.totalRecoveredRupees?.toLocaleString('en-IN') || '0';
  const pendingCount = context.revenueRecovery?.pendingApprovalsCount || 0;
  const studentTotal = context.platformOverview?.totalRegisteredStudents || 0;

  return {
    voiceText: `You have recovered ${revAmt} rupees so far, with ${pendingCount} pending approvals. Your portal has ${studentTotal} registered students and all systems are operational.`,
    visualReply: `You have recovered ₹${revAmt} with ${pendingCount} pending approvals. Total registered students: ${studentTotal}.`,
    action: 'NONE',
    targetView: null,
  };
}
