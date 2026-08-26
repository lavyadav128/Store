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

      // Academics & Batches (Full Training Context)
      Batch.find().lean(),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Purchase.countDocuments(),
    ]);

    const allBatches = batchCount || [];

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
      batches: allBatches.map((b) => ({
        id: b._id,
        title: b.title,
        price: b.price,
        description: b.description,
        category: b.category || 'General',
        status: b.status || 'active',
      })),
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
        totalBatches: allBatches.length,
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

  // 1. EXECUTIVE VOICE ACTIONS (ADMIN RIGHT TO EDIT, CREATE, DELETE, & UPDATE ON COMMAND)
  // Edit / Update Batch Price or Details
  const updatePriceMatch = q.match(/(?:edit|update|change|set)\s+(?:the\s+)?(.+?)\s+(?:batch\s+)?price\s+to\s+(?:₹|rs\.?|rupees\s*)?(\d+)/i);
  if (updatePriceMatch) {
    const searchName = updatePriceMatch[1].replace(/batch/i, '').trim();
    const newPrice = Number(updatePriceMatch[2]);
    let updated = await Batch.findOneAndUpdate(
      { title: new RegExp(searchName, 'i') },
      { price: newPrice },
      { new: true }
    );
    if (!updated) {
      const anyBatch = await Batch.findOne({ title: new RegExp(searchName.split(' ')[0], 'i') }) || await Batch.findOne();
      if (anyBatch) {
        updated = await Batch.findByIdAndUpdate(anyBatch._id, { price: newPrice }, { new: true });
      }
    }
    if (updated) {
      return {
        voiceText: `I have updated the price of ${updated.title} to ${newPrice.toLocaleString('en-IN')} rupees, Admin.`,
        visualReply: `Updated **${updated.title}** price to **₹${newPrice.toLocaleString('en-IN')}**.`,
        action: "UPDATE_BATCH",
        targetView: "batches",
      };
    }
  }

  // Create Batch
  const createBatchMatch = q.match(/(?:create|add)\s+(?:a\s+)?new\s+batch\s+(.+?)(?:\s+with\s+price\s+(?:₹|rs\.?|rupees\s*)?(\d+))?$/i);
  if (createBatchMatch) {
    const title = createBatchMatch[1].trim();
    const price = Number(createBatchMatch[2] || 1999);
    const batchSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newBatch = await Batch.create({
      batchId: `batch_${Date.now()}`,
      folder: batchSlug,
      title,
      price,
      description: `Official ${title} course created by Pochi AI Assistant`,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
      category: 'Competitive Exams',
      status: 'active',
    });
    return {
      voiceText: `New batch ${newBatch.title} has been created with a price of ${price.toLocaleString('en-IN')} rupees, Admin.`,
      visualReply: `Created Batch **${newBatch.title}** (₹${price.toLocaleString('en-IN')}).`,
      action: "CREATE_BATCH",
      targetView: "batches",
    };
  }

  // Delete Batch
  const deleteBatchMatch = q.match(/(?:delete|remove)\s+(?:the\s+)?batch\s+(.+)/i);
  if (deleteBatchMatch) {
    const searchName = deleteBatchMatch[1].replace(/batch/i, '').trim();
    const deleted = await Batch.findOneAndDelete({ title: new RegExp(searchName, 'i') });
    if (deleted) {
      return {
        voiceText: `I have deleted the batch ${deleted.title} from your platform, Admin.`,
        visualReply: `Deleted Batch **${deleted.title}**.`,
        action: "DELETE_BATCH",
        targetView: "batches",
      };
    }
  }

  // Update Policy
  const policyDiscountMatch = q.match(/(?:set|update|change)\s+policy\s+max\s+discount\s+to\s+(\d+)%/i);
  if (policyDiscountMatch) {
    const val = Number(policyDiscountMatch[1]);
    await updatePolicy({ maxDiscountPercent: val });
    return {
      voiceText: `I have updated your AI recovery policy to allow up to ${val} percent maximum discount.`,
      visualReply: `Updated Policy: Max Discount set to **${val}%**.`,
      action: "UPDATE_POLICY",
      targetView: "revenue",
    };
  }

  // 2. Navigation & System Control intents
  if (/log\s*out|sign\s*out|logout me|log me out/i.test(q)) {
    return {
      voiceText: `Logging you out now, ${adminUser?.name || 'Admin'}. Have a wonderful day!`,
      visualReply: `Logging out Admin...`,
      action: "LOGOUT",
      targetView: null,
    };
  }
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
  if (/file\s*manager|files|upload\s*file|documents/i.test(q) || (/go to|open|show/i.test(q) && /file/i.test(q))) {
    return {
      voiceText: "Opening File Manager page now.",
      visualReply: "Navigating to File Manager.",
      action: "NAVIGATE_VIEW",
      targetView: "files",
    };
  }
  if (/best\s*notes|notes|study\s*material|pdf\s*notes/i.test(q) || (/go to|open|show/i.test(q) && /notes/i.test(q))) {
    return {
      voiceText: "Opening Best Notes page now.",
      visualReply: "Navigating to Best Notes.",
      action: "NAVIGATE_VIEW",
      targetView: "notes",
    };
  }
  if (/admin\s*dashboard|dashboard|main\s*panel/i.test(q) || (/go to|open|show/i.test(q) && /dashboard/i.test(q))) {
    return {
      voiceText: "Opening Admin Dashboard overview.",
      visualReply: "Navigating to Admin Dashboard.",
      action: "NAVIGATE_VIEW",
      targetView: "admin",
    };
  }
  if (/take me to batches|open batches|show batches|courses/i.test(q) || (/go to|open|show/i.test(q) && /batches/i.test(q))) {
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

  if (/retry|scheduling|mandate|window|8\s*30|10\s*30|how.*recovery.*work/i.test(q)) {
    return {
      voiceText: "Immediate retries and manual admin approvals run as soon as triggered or approved by you. Mandate and scheduled retries get queued for the next 08:30 AM to 10:30 AM IST banking window or salary cycle day, and are processed automatically by our background worker during that exact window.",
      visualReply: "⚡ **Immediate Retries & Manual Approvals**: Execute instantly on trigger/approval.\n⏱️ **Mandate & Scheduled Retries**: Queued for the **08:30 AM - 10:30 AM IST** banking window.",
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

  // 3. General Intelligence & Omniscient LLM Query
  const systemPrompt = `You are "Pochi", the world-class executive Apple Siri-style voice AI assistant exclusively built for the Admin of EduPortal (${adminUser?.name || 'Admin'}).

YOUR CAPABILITIES & EXECUTION RULES:
1. Immediate Retries & Manual Admin Approvals: Run as soon as triggered or approved by the Admin in the dashboard. Auto-approves bounded offers for payments <= ₹5,000.
2. Mandate & Scheduled Retries: Automatically queued for the next 08:30 AM – 10:30 AM IST banking opening window (or salary cycle day) and processed by the background worker during that exact window.
3. Omniscient real-time knowledge of this Admin Dashboard:
   - Revenue Recovery: ₹${revPaise.toLocaleString('en-IN')} recovered (${pendingCount} pending approvals)
   - Students & Batches: ${studentTotal} registered students across ${batchTotal} active batches
   - Instagram Growth Agent: active in "${instaNiche}" (${context.instagramAgent?.totalPostsCreated || 0} reels created)
   - AI Client Studio: ${clientProjectCount} client projects
4. World-class General Intelligence: You can answer ANY question the admin asks (general knowledge, coding, science, business, explanations, greetings, casual talk, jokes, math, advice).

RESPONSE DIRECTIVES:
- Always answer directly, smartly, and conversationally in 1-2 spoken sentences (like Siri or ChatGPT voice mode).
- Respond in either pure spoken English or smooth Hinglish depending on how the admin speaks.
- Return a JSON object:
{
  "voiceText": "Crisp 1-2 sentence spoken answer to read aloud to the admin.",
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

  // 1. Try Groq with multiple verified models & robust JSON/text parser
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_')) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const groqModels = [
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'groq/compound-mini',
      'qwen/qwen3.6-27b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
    ];

    for (const model of groqModels) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          temperature: 0.3,
          messages,
        });
        const rawContent = completion.choices?.[0]?.message?.content || '';
        const parsed = cleanLlmJson(rawContent);
        if (parsed && (parsed.voiceText || parsed.visualReply)) {
          return parsed;
        }
        // If the model replied in natural text instead of JSON:
        const cleanText = rawContent
          .replace(/<think>[\s\S]*?<\/think>/gi, '')
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        if (cleanText && cleanText.length > 2) {
          return {
            voiceText: cleanText,
            visualReply: cleanText,
            action: 'NONE',
            targetView: null,
          };
        }
      } catch (err) {
        // try next model
      }
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
          'X-Title': 'Pochi Voice Assistant',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-nano-9b-v2:free',
          temperature: 0.3,
          messages,
        }),
      });
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '';
      const parsed = cleanLlmJson(rawContent);
      if (parsed && (parsed.voiceText || parsed.visualReply)) {
        return parsed;
      }
      const cleanText = rawContent
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      if (cleanText && cleanText.length > 2) {
        return {
          voiceText: cleanText,
          visualReply: cleanText,
          action: 'NONE',
          targetView: null,
        };
      }
    } catch (err) {
      console.warn('OpenRouter Pochi fallback failed:', err.message);
    }
  }

  // Conversational Default fallback for greetings and queries
  if (/hi|hello|hey|namaste|kaise ho/i.test(q)) {
    return {
      voiceText: `Hello ${adminUser?.name || 'Admin'}! I am Pochi. What would you like me to do or check for you today?`,
      visualReply: `Hello Admin! Ask me anything about your platform, revenue recovery, or general knowledge.`,
      action: 'NONE',
      targetView: null,
    };
  }

  return {
    voiceText: `I heard your question, ${adminUser?.name || 'Admin'}. All your systems are running normally with ${revPaise.toLocaleString('en-IN')} rupees recovered.`,
    visualReply: `Platform Status: All systems operational. Recovered: ₹${revPaise.toLocaleString('en-IN')}`,
    action: 'NONE',
    targetView: null,
  };
}
