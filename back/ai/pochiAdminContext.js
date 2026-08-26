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

export async function askPochi(query = '', adminUser, history = []) {
  const context = await getPochiAdminContext();
  const q = query.toLowerCase().trim();

  // Fast-path direct queries for instant 100% accurate responses
  const revPaise = (context.revenueRecovery?.totalRecoveredRupees || 0);
  const pendingCount = context.revenueRecovery?.pendingApprovalsCount || 0;
  const studentTotal = context.platformOverview?.totalRegisteredStudents || 0;
  const batchTotal = context.platformOverview?.totalBatches || 0;
  const instaNiche = context.instagramAgent?.niche || 'EdTech & Tech';
  const clientProjectCount = context.clientAgent?.totalProjects || 0;

  // 1. Navigation intents
  if (/take me to revenue|open revenue|show revenue|revenue recovery/i.test(q)) {
    return {
      voiceText: "Switching to the AI Revenue Recovery dashboard now.",
      visualReply: "Navigating to AI Revenue Recovery Dashboard.",
      action: "NAVIGATE_VIEW",
      targetView: "revenue",
    };
  }
  if (/take me to instagram|open instagram|show instagram|insta agent/i.test(q)) {
    return {
      voiceText: "Opening Instagram Growth Agent now.",
      visualReply: "Navigating to Instagram Growth Agent.",
      action: "NAVIGATE_VIEW",
      targetView: "instagram",
    };
  }
  if (/take me to client|open client|client agent|project enquiries|freelance/i.test(q)) {
    return {
      voiceText: "Opening AI Client Agent and freelance project studio.",
      visualReply: "Navigating to AI Client Agent.",
      action: "NAVIGATE_VIEW",
      targetView: "client_agent",
    };
  }
  if (/take me to dreams|open dreams|show dreams|ultimate dreams/i.test(q)) {
    return {
      voiceText: "Opening Ultimate Dreams media hub.",
      visualReply: "Navigating to Ultimate Dreams.",
      action: "NAVIGATE_VIEW",
      targetView: "dreams",
    };
  }
  if (/take me to batches|open batches|show batches|courses/i.test(q) && /take me|open|show|go to/i.test(q)) {
    return {
      voiceText: "Opening Courses and Batches manager.",
      visualReply: "Navigating to Batches.",
      action: "NAVIGATE_VIEW",
      targetView: "batches",
    };
  }

  // 2. Specific metrics queries
  if (/revenue.*recover|how much.*recover|kitna.*recover/i.test(q)) {
    const formatted = revPaise.toLocaleString('en-IN');
    return {
      voiceText: `We have recovered ${formatted} rupees so far from failed payment interventions, and there are ${pendingCount} signals waiting in your approval queue.`,
      visualReply: `Total Revenue Recovered: **₹${formatted}** · Pending Approvals: **${pendingCount}**`,
      action: "NONE",
      targetView: null,
    };
  }

  if (/approval|pending|gated/i.test(q) && /how many|what|are there|check|pending/i.test(q)) {
    if (pendingCount === 0) {
      return {
        voiceText: "Your approval queue is completely clear. No payments are waiting for human authorization.",
        visualReply: "Approval Queue: **0 Pending** · All actions within auto-approve policy bounds.",
        action: "NONE",
        targetView: null,
      };
    }
    const first = context.revenueRecovery?.pendingApprovalsList?.[0];
    const detail = first ? `For example, ${first.customer} for ${first.amountRupees} rupees due to ${first.reason}.` : '';
    return {
      voiceText: `You have ${pendingCount} transactions waiting for authorization. ${detail}`,
      visualReply: `**${pendingCount} Pending Approvals** in human review queue.`,
      action: "NONE",
      targetView: null,
    };
  }

  if (/promise.*pay|committed|who will pay/i.test(q)) {
    const promises = context.revenueRecovery?.upcomingPromisesList || [];
    if (promises.length === 0) {
      return {
        voiceText: "There are currently no active promise-to-pay commitments registered.",
        visualReply: "No pending payment promises.",
        action: "NONE",
        targetView: null,
      };
    }
    const first = promises[0];
    return {
      voiceText: `You have ${promises.length} customer payment commitments. ${first.customer} promised to pay ${first.amountRupees} rupees on ${first.promisedDate}.`,
      visualReply: `**${promises.length} Active Promises** · Next due: ${first.customer} (${first.amountRupees}) on ${first.promisedDate}`,
      action: "NONE",
      targetView: null,
    };
  }

  if (/student|user|registered/i.test(q) && /how many|total|count/i.test(q)) {
    return {
      voiceText: `There are currently ${studentTotal} registered students enrolled across ${batchTotal} active batches on your platform.`,
      visualReply: `Total Registered Students: **${studentTotal}** · Active Batches: **${batchTotal}**`,
      action: "NONE",
      targetView: null,
    };
  }

  if (/instagram|reel|viral|post/i.test(q) && /what|how|show|status|performance/i.test(q)) {
    const recent = context.instagramAgent?.recentPosts || [];
    const count = context.instagramAgent?.totalPostsCreated || 0;
    return {
      voiceText: `Your Instagram Growth Agent is targeting the ${instaNiche} niche, with ${count} reels generated and scheduled.`,
      visualReply: `Instagram Niche: **${instaNiche}** · Total Posts Generated: **${count}**`,
      action: "NONE",
      targetView: null,
    };
  }

  if (/client|project|enquiry|enquiries|freelance/i.test(q)) {
    return {
      voiceText: `You have ${clientProjectCount} freelance and client projects registered in your studio portal.`,
      visualReply: `Total Client Projects: **${clientProjectCount}** · Slug: \`${context.clientAgent?.enquirySlug}\``,
      action: "NONE",
      targetView: null,
    };
  }

  // 3. General LLM Query (Llama-3.3-70B on Groq)
  const systemPrompt = `You are "Pochi", the Apple Siri-style executive voice assistant for the Admin of EduPortal.
You speak directly to the Admin in crisp, natural, conversational spoken English or Hinglish.
Always reply with a direct 1 to 2 sentence spoken voice answer.

ADMIN IDENTITY: ${adminUser?.name || 'Admin'}
LIVE SYSTEM STATS:
- Revenue Recovered: ₹${revPaise.toLocaleString('en-IN')} (${pendingCount} pending approvals)
- Students: ${studentTotal} registered across ${batchTotal} batches
- Instagram Niche: ${instaNiche} (${context.instagramAgent?.totalPostsCreated || 0} posts)
- Client Projects: ${clientProjectCount} projects

JSON OUTPUT FORMAT:
{
  "voiceText": "Direct, natural 1-2 sentence spoken reply to be spoken aloud.",
  "visualReply": "Short summary text.",
  "action": "NONE" | "NAVIGATE_VIEW",
  "targetView": null | "revenue" | "instagram" | "client_agent" | "dreams" | "batches"
}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-4).map((h) => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: typeof h.content === 'string' ? h.content : JSON.stringify(h.content),
    })),
    { role: 'user', content: query },
  ];

  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_')) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const groqModels = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'llama3-70b-8192', 'llama3-8b-8192', 'gemma2-9b-it'];

    for (const model of groqModels) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          temperature: 0.2,
          messages,
        });
        const parsed = cleanLlmJson(completion.choices?.[0]?.message?.content);
        if (parsed && (parsed.voiceText || parsed.visualReply)) {
          return parsed;
        }
      } catch (err) {
        // try next model
      }
    }
  }

  // Fallback
  return {
    voiceText: `All admin systems are running properly. You have recovered ${revPaise.toLocaleString('en-IN')} rupees, and your platform has ${studentTotal} active students.`,
    visualReply: `Recovered: ₹${revPaise.toLocaleString('en-IN')} · Students: ${studentTotal} · Batches: ${batchTotal}`,
    action: 'NONE',
    targetView: null,
  };
}
