import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Antique Body" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 3px solid #ff7800;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #ff7800;
          letter-spacing: 1px;
        }
        .content {
          padding: 30px 20px;
          text-align: center;
        }
        h1 {
          color: #333;
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 24px;
        }
        p {
          margin-bottom: 20px;
          color: #666;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(to right, #ff7800, #ff5f00);
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin: 20px 0;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ANTIQUE BODY</div>
        </div>
        <div class="content">
          <h1>Welcome to Antique Body!</h1>
          <p>Thank you for joining us. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify My Email</a>
          <p>This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
          <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
          <p style="font-size: 12px; color: #999;">${verificationUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Antique Body. All rights reserved.</p>
          <p>Strength of the Ancients</p>
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
    console.error("Error sending verification email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Antique Body" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 3px solid #ff7800;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #ff7800;
          letter-spacing: 1px;
        }
        .content {
          padding: 30px 20px;
          text-align: center;
        }
        h1 {
          color: #333;
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 24px;
        }
        p {
          margin-bottom: 20px;
          color: #666;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(to right, #ff7800, #ff5f00);
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin: 20px 0;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ANTIQUE BODY</div>
        </div>
        <div class="content">
          <h1>Password Reset Request</h1>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="button">Reset My Password</a>
          <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
          <p style="font-size: 12px; color: #999;">${resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Antique Body. All rights reserved.</p>
          <p>Strength of the Ancients</p>
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
    console.error("Error sending password reset email:", error);
    return false;
  }
} 