import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  async initialize() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await this.transporter.verify();
      console.log("Email service is ready to send emails");
    } catch (error) {
      console.error("Email service error:", error);
    }
  }

  async sendPasswordResetOTP(to, otp, firstName) {
    const mailOptions = {
      from: {
        name: "ResumeSync",
        address: process.env.EMAIL_USER,
      },
      to: to,
      subject: "Reset Your Password - OTP Code",
      html: this.getPasswordResetOTPTemplate(otp, firstName),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Password reset OTP email sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error sending password reset OTP email:", error);
      return { success: false, error: error.message };
    }
  }

  getPasswordResetOTPTemplate(otp, firstName) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #3b82f6;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e2e8f0;
          }
          .otp-code {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            color: white;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
          }
          .footer {
            background-color: #f1f5f9;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-radius: 0 0 8px 8px;
          }
          .warning {
            background-color: #fef3c7;
            padding: 15px;
            margin: 20px 0;
            border-radius: 6px;
            border-left: 4px solid #f59e0b;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 ResumeSync</h1>
          <h2>Password Reset OTP</h2>
        </div>
        <div class="content">
          <h3>Hello ${firstName}!</h3>
          <p>We received a request to reset your ResumeSync account password. Use the OTP code below to proceed with resetting your password:</p>
          
          <div class="otp-code">${otp}</div>
          
          <div class="warning">
            <strong>Important:</strong> This OTP will expire in 24 hours for security reasons. Do not share this code with anyone.
          </div>
          
          <p><strong>Steps to reset your password:</strong></p>
          <ol>
            <li>Return to the password reset page</li>
            <li>Enter your email address</li>
            <li>Enter the OTP code: <strong>${otp}</strong></li>
            <li>Create and confirm your new password</li>
          </ol>
          
          <p>If you didn't request a password reset, please ignore this email and your account will remain secure. We recommend changing your password if you continue to receive these emails.</p>
          
          <p>Thank you for using ResumeSync to optimize your career journey!</p>
          
          <p><strong>The ResumeSync Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; 2025 ResumeSync - AI-Powered Resume & Job Description Matching. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }
}

const emailService = new EmailService();
export default emailService;
