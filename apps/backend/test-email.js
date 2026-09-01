require("dotenv").config();

const SUBJECT = "Test Email from CEBC MS Graph API";
const html = "<p>This is a test email to verify MS Graph API integration.</p>";
const email = "info@cebcmena.com";

async function testEmail() {
  try {
    console.log("1. Fetching MS Graph OAuth token...");
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
    console.log("Token received successfully!");

    console.log("2. Sending email via MS Graph...");
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
                  address: email,
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
      throw new Error(`MS Graph email failed: ${errorData.error?.message || JSON.stringify(errorData)}`);
    }

    console.log("Success! Email sent to", email);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

testEmail();
