const transporter = require("../config/mailer");
const SiteContent = require("../models/SiteContent");

const SUBJECT = "Your registration is confirmed! Welcome to the 14th CEBC Annual Summit";

// Sends the attendee confirmation email once a registration is marked paid.
// Never throws — a failure here must not break the payment webhook that
// calls it; errors are logged instead.
async function sendConfirmationEmail(registration) {
  try {
    const content = await SiteContent.findById(SiteContent.SINGLETON_ID);
    const eventInfo = content?.eventInfo || {};
    const agendaUrl = `${process.env.FRONTEND_URL}/#agenda`;

    const html = `
      <p>Dear Delegate,</p>
      <p>On behalf of the Clean Energy Business Council, thank you for registering to attend the
      14th CEBC Annual Summit. We are delighted to welcome you to our exclusive annual gathering.
      This platform offers an opportunity to share insights, shape solutions, and influence the
      region's clean energy and cleantech agenda.</p>
      <p><strong>Event Details</strong><br/>
      Date: ${eventInfo.dateLabel || ""}<br/>
      Time: ${eventInfo.timeLabel || ""}<br/>
      Venue: ${eventInfo.venue || ""}</p>
      <p>You may view the full event agenda on our website: <a href="${agendaUrl}">${agendaUrl}</a></p>
    `;

    const text = `Dear Delegate,

On behalf of the Clean Energy Business Council, thank you for registering to attend the 14th CEBC Annual Summit. We are delighted to welcome you to our exclusive annual gathering. This platform offers an opportunity to share insights, shape solutions, and influence the region's clean energy and cleantech agenda.

Event Details
Date: ${eventInfo.dateLabel || ""}
Time: ${eventInfo.timeLabel || ""}
Venue: ${eventInfo.venue || ""}

You may view the full event agenda on our website: ${agendaUrl}`;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
      to: registration.email,
      subject: SUBJECT,
      text,
      html,
    });
  } catch (err) {
    console.error("Confirmation email failed:", err.message);
  }
}

module.exports = sendConfirmationEmail;
