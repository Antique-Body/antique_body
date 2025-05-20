import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug logging
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
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
  h1 {
    color: #8b4513;
    margin-top: 0;
    margin-bottom: 25px;
    font-size: 24px;
    text-align: center;
  }
  p {
    margin-bottom: 20px;
    color: #555;
    font-size: 16px;
    line-height: 1.7;
  }
  .button {
    display: inline-block;
    padding: 14px 30px;
    background: linear-gradient(to right, #8b4513, #a0522d);
    color: white !important;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
    margin: 25px 0;
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
    transition: all 0.3s ease;
    text-align: center;
  }
  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(139, 69, 19, 0.4);
  }
  .footer {
    text-align: center;
    margin-top: 0;
    padding: 25px 30px;
    background-color: #f7f5f0;
    color: #8b4513;
    font-size: 14px;
    border-top: 1px solid #f0e6d9;
  }
  .social-icons {
    margin: 15px 0;
  }
  .social-icons a {
    display: inline-block;
    margin: 0 8px;
    color: #8b4513;
    text-decoration: none;
  }
  .disclaimer {
    font-size: 12px;
    color: #999;
    margin-top: 15px;
  }
`;

export async function sendEmailVerificationCode(email, code) {
  const mailOptions = {
    from: `"Antique Body" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Antique Body Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          ${baseStyles}
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
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #d7c8b6, transparent);
            margin: 30px 0;
          }
        </style>
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
            
            <div class="divider"></div>
            
            <p style="font-style: italic; text-align: center;">"The body achieves what the mind believes."</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Antique Body. All rights reserved.</p>
            <div class="social-icons">
              <a href="#">Instagram</a> • 
              <a href="#">Facebook</a> • 
              <a href="#">Twitter</a>
            </div>
            <p class="disclaimer">If you did not request this verification, please disregard this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending verification code email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(email, token) {
  console.log("=== Starting password reset email process ===");
  console.log("Email configuration check:");
  console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
  console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD);
  console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error(
      "Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables."
    );
    return false;
  }

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  console.log("Reset URL generated:", resetUrl);

  const mailOptions = {
    from: `"Antique Body" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Antique Body Password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          ${baseStyles}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ANTIQUE BODY</div>
            <div class="tagline">Strength of the Ancients</div>
          </div>
          <div class="content">
            <h1>Password Reset Request</h1>
            <p>We received a request to reset your password. To create a new password and regain access to your Antique Body account, please click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this URL into your browser:</p>
            <div class="url-box">${resetUrl}</div>
            
            <div class="security-note">
              <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this password reset, please secure your account by changing your password immediately or contact our support team.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Antique Body. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log("Attempting to send email...");
    console.log("Mail options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return false;
  }
}
