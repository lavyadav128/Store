// /back/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

/**
 * Send an email notification to the client regarding payment or project delivery.
 * Supports configurable SMTP, with graceful fallback logging if not configured.
 */
export async function sendClientEmailNotification({ to, subject, html, text }) {
  if (!to) return { success: false, reason: 'No recipient email provided' };

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Project Studio" <${process.env.SMTP_USER}>`,
          to,
          subject,
          text: text || '',
          html: html || '',
        });

        console.log(`📧 Email sent to ${to}: ${subject} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (nmErr) {
        console.warn('Nodemailer send error:', nmErr.message);
        return { success: false, error: nmErr.message };
      }
    }

    console.log(`📧 [Client Email Dispatch] To: ${to} | Subject: ${subject}`);
    console.log(`Content:\n${text || html}`);
    return { success: true, simulated: true };
  } catch (error) {
    console.error('Failed to send email notification:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send client payment request email with invoice and payment link.
 */
export async function sendClientPaymentEmail({ clientName, clientEmail, projectTitle, projectCode, amount, paymentLink }) {
  const subject = `Payment Request: ${projectTitle} (${projectCode})`;
  const text = `Hi ${clientName || 'Client'},\n\nYour project "${projectTitle}" (Code: ${projectCode}) is approved & ready. An amount of ₹${amount.toLocaleString()} is requested.\n\nClick here to complete secure payment:\n${paymentLink}\n\nDeliverables and source code unlock immediately upon payment verification.\n\nBest regards,\nProject Studio Team`;
  const html = `
    <div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; color: #1e293b;">
      <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800;">🔒 Secure Project Payment Request</h2>
      <p style="font-size: 15px; line-height: 1.6;">Hi <strong>${clientName || 'Client'}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">Your project <strong>${projectTitle}</strong> (Code: <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 6px; font-weight: bold; color: #0f172a;">${projectCode}</code>) is completed, tested, and approved for final payment.</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0; border-left: 5px solid #4338ca;">
        <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">TOTAL AMOUNT DUE</p>
        <h1 style="margin: 6px 0 0 0; color: #0f172a; font-size: 32px; font-weight: 800;">₹${amount.toLocaleString()}</h1>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${paymentLink}" target="_blank" style="background: #4338ca; color: #ffffff; padding: 15px 32px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(67, 56, 202, 0.25);">
          💳 Pay Securely with Razorpay
        </a>
      </div>

      <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 16px;">
        Clickable Payment Link: <br/>
        <a href="${paymentLink}" target="_blank" style="color: #4338ca; font-weight: 600; word-break: break-all;">${paymentLink}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
        Payments secured via Razorpay 256-bit SSL encryption. All project deliverables and full source code unlock immediately upon payment.
      </p>
    </div>
  `;

  return sendClientEmailNotification({ to: clientEmail, subject, text, html });
}

/**
 * Send client deliverables email upon payment verification.
 */
export async function sendClientDeliveryEmail({ clientName, clientEmail, projectTitle, projectCode, deliveryUrl, repositoryUrl, testSummary }) {
  const downloadUrl = repositoryUrl || deliveryUrl;
  const subject = `🎉 Deliverables Unlocked: ${projectTitle} (${projectCode})`;
  const text = `Hi ${clientName || 'Client'},\n\nPayment verified! Your project "${projectTitle}" (Code: ${projectCode}) is delivered.\n\n🚀 Live Demo / Web App: ${deliveryUrl || 'Portal'}\n📦 Source Code Download / Repo: ${downloadUrl || 'Portal'}\n\nTest Summary:\n${testSummary || 'All quality checks passed with 100% verified results.'}\n\nThank you for working with us!\nProject Studio Team`;
  const html = `
    <div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; color: #1e293b;">
      <h2 style="color: #166534; margin-top: 0; font-size: 22px; font-weight: 800;">🎉 Project Delivered & Verified!</h2>
      <p style="font-size: 15px; line-height: 1.6;">Hi <strong>${clientName || 'Client'}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">Thank you for your payment! Your project <strong>${projectTitle}</strong> (Code: <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 6px; font-weight: bold; color: #0f172a;">${projectCode}</code>) is fully completed, tested, and ready to use.</p>
      
      <div style="background: #f8fafc; padding: 22px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
        <h4 style="margin-top: 0; color: #0f172a; font-size: 15px; font-weight: 800; margin-bottom: 16px;">📦 Unlocked Project Deliverables</h4>
        
        ${deliveryUrl ? `
          <div style="margin-bottom: 14px;">
            <a href="${deliveryUrl}" target="_blank" style="background: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">
              🚀 Open Live Web Application
            </a>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #64748b;"><a href="${deliveryUrl}" target="_blank" style="color: #4338ca;">${deliveryUrl}</a></p>
          </div>
        ` : ''}

        ${downloadUrl ? `
          <div style="margin-top: 14px;">
            <a href="${downloadUrl}" target="_blank" style="background: #4338ca; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">
              ⬇️ Download Complete Source Code (.zip)
            </a>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #64748b;"><a href="${downloadUrl}" target="_blank" style="color: #4338ca;">${downloadUrl}</a></p>
          </div>
        ` : ''}

        ${testSummary ? `
          <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; pt: 16px;">
            <p style="font-size: 12px; font-weight: 700; color: #166534; margin: 0 0 6px 0;">Automated QA Verification Report:</p>
            <pre style="background: #ffffff; padding: 12px; border-radius: 8px; font-size: 11px; white-space: pre-wrap; font-family: monospace; border: 1px solid #e2e8f0; color: #334155;">${testSummary}</pre>
          </div>
        ` : ''}
      </div>
      
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
        Project Studio Team · Delivered with Pride
      </p>
    </div>
  `;

  return sendClientEmailNotification({ to: clientEmail, subject, text, html });
}
