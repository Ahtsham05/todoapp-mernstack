import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendForgotPasswordEmail({ email, token }) {
  const resetUrl = `${process.env.ORIGIN}/reset-password/${token}`;

  const { data, error } = await resend.emails.send({
    from: 'TodoApp <onboarding@resend.dev>',
    to: [email],
    subject: 'Reset Your TodoApp Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #555555;">
          Hello,
        </p>
        <p style="font-size: 16px; color: #555555;">
          You requested to reset your password for your <strong>TodoApp</strong> account. Click the button below to reset it:
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #4CAF50; border-radius: 8px; text-decoration: none;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #777777;">
          This link will expire in 15 minutes. If you did not request this, you can safely ignore this email.
        </p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eeeeee;">
        <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
          &copy; ${new Date().getFullYear()} TodoApp. All rights reserved.
        </p>
      </div>
    `,
  });

  if (error) {
    return error;
  }

  return data;
}
