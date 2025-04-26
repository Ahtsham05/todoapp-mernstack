import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtp({ email, otp }) {
    const { data, error } = await resend.emails.send({
        from: 'TodoApp <onboarding@resend.dev>',
        to: [email],
        subject: 'Your TodoApp Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
            <h2 style="color: #333333; text-align: center;">Verify Your Email</h2>
            <p style="font-size: 16px; color: #555555;">
              Hello,</p>
            <p style="font-size: 16px; color: #555555;">
              To complete your sign-up process on <strong>TodoApp</strong>, please use the following One-Time Password (OTP):
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; color: #ffffff; background-color: #4CAF50; border-radius: 8px;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #777777;">
              This code is valid for the next 10 minutes. Please do not share it with anyone.
            </p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eeeeee;">
            <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
              &copy; ${new Date().getFullYear()} TodoApp. All rights reserved.
            </p>
          </div>
        `,
    });
    if (error) {
        return error
    }

    return data
}