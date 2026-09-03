// Sends real emails using Gmail SMTP via nodemailer

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendPasswordResetEmail(toEmail, resetLink) {
  await transporter.sendMail({
    from: `"DevBlog" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your DevBlog password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the link below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:8px;">
          Reset Password
        </a>
        <p style="color:#777;font-size:13px;margin-top:16px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export { sendPasswordResetEmail };