const nodemailer = require('nodemailer');
const { measureExecutionTime } = require('../utils/performance');
const emailQueue = require('../queues/email.queue');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendOtpEmail = async (email, otp, type) => {
    let subject;
    let title;

    if (type === 'forgot-password') {
        subject = 'MusicBox - Mã OTP đặt lại mật khẩu';
        title = 'Đặt lại mật khẩu';
    } else if (type === 'verify-email') {
        subject = 'MusicBox - Xác thực email';
        title = 'Xác thực email';
    } else {
        subject = 'MusicBox - Mã OTP';
        title = 'Mã xác thực';
    }

    const result = await measureExecutionTime(async () => {
        await transporter.sendMail({
            from: `"MusicBox" <${process.env.MAIL_FROM}>`,
            to: email,
            subject,

            html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>${title}</h2>

                <p>
                    Mã OTP của bạn là:
                </p>

                <h1 style="letter-spacing: 8px;">
                    ${otp}
                </h1>

                <p>
                    Mã OTP có hiệu lực trong 5 phút.
                </p>

                <p>
                    Nếu bạn không thực hiện yêu cầu này,
                    vui lòng bỏ qua email.
                </p>
            </div>
        `
        });
    });

    console.log(`Email sent in ${result.durationMs} milliseconds`);
    return true;
};



const sendOtpEmailWithQueue = async (email, otp, type) => {
    let subject;
    let title;

    if (type === 'forgot-password') {
        subject = 'MusicBox - Mã OTP đặt lại mật khẩu';
        title = 'Đặt lại mật khẩu';
    } else if (type === 'verify-email') {
        subject = 'MusicBox - Xác thực email';
        title = 'Xác thực email';
    } else {
        subject = 'MusicBox - Mã OTP';
        title = 'Mã xác thực';
    }

    await emailQueue.add(
        'send-otp',
        {
            email,
            otp,
            subject,
            title
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: true,
            removeOnFail: false
        }
    );

    console.log(`Email job added for ${email}`);

    return true;
};

module.exports = {
    sendOtpEmail,
    sendOtpEmailWithQueue
};