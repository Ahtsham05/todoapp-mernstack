import crypto from 'crypto';

export function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        otp += digits[randomIndex];
    }
    return otp;
}

export function getOtpExpiry(minutes = 10) {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60 * 1000); // 10 minutes = 600,000 ms
}


export function isOtpValid(otpExpiry) {
    return new Date() < new Date(otpExpiry);
}