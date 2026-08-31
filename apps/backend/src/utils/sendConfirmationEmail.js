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

    // 1. Get OAuth token from Azure AD
    const tokenParams = new URLSearchParams({
      client_id: process.env.MS_CLIENT_ID,
      scope: "https://graph.microsoft.com/.default",
      client_secret: process.env.MS_CLIENT_SECRET,
      grant_type: "client_credentials",
    });

    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenParams.toString(),
      }
    );

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new Error(`Failed to get MS Graph token: ${tokenData.error_description || tokenData.error}`);
    }

    // 2. Send email via MS Graph API
    const mailRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${process.env.SMTP_USER}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: SUBJECT,
            body: {
              contentType: "HTML",
              content: html,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: registration.email,
                },
              },
            ],
          },
          saveToSentItems: "true",
        }),
      }
    );

    if (!mailRes.ok) {
      const errorData = await mailRes.json();
      throw new Error(`MS Graph email failed: ${errorData.error?.message || "Unknown error"}`);
    }

    console.log(`Confirmation email sent successfully to ${registration.email}`);
  } catch (err) {
    console.error("Confirmation email failed:", err.message);
  }
}

module.exports = sendConfirmationEmail;
