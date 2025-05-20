import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
});

// Shared styling elements
const baseStyles = `
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f7f5f0;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 40px auto;
    padding: 0;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  .header {
    text-align: center;
    padding: 30px 0;
    background: linear-gradient(135deg, #8b4513, #a0522d);
    border-bottom: none;
  }
  .logo {
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .tagline {
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
    margin-top: 5px;
    font-size: 14px;
  }
  .content {
    padding: 40px 30px;
    background-color: #ffffff;
  }
  .verification-code {
    font-size: 2.5rem;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: #8b4513;
    margin: 30px 0;
    text-align: center;
    padding: 20px;
    background-color: #f7f5f0;
    border-radius: 8px;
    border: 1px dashed #d7c8b6;
  }
`;

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Antique Body" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendVerificationCodeEmail(email, code) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ANTIQUE BODY</div>
          <div class="tagline">Strength of the Ancients</div>
        </div>
        <div class="content">
          <h1>Verify Your Email</h1>
          <p>Thank you for joining Antique Body. To complete your registration and access our premium fitness content, please verify your email address using the code below:</p>
          
          <div class="verification-code">${code}</div>
          
          <p>Enter this code in the app to continue your journey toward ancient strength and wisdom.</p>
          
          <p style="font-style: italic; text-align: center;">"The body achieves what the mind believes."</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Your Antique Body Verification Code",
    html,
  });
}
