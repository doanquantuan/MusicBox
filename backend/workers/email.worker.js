const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');

const redisConnection = require('../config/redis');
const { measureExecutionTime } = require('../utils/performance');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

const emailWorker = new Worker(
    'email',
    async (job) => {
        const { email, otp, subject, title } = job.data;

        const result = await measureExecutionTime(() =>
            transporter.sendMail({
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
            })
        );

        console.log(
            `Email sent to ${email} in ${result.durationMs} ms`
        );

        return result;
    },
    {
        connection: redisConnection,
        concurrency: 5
    }
);

emailWorker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(
        `Email job ${job?.id} failed:`,
        err.message
    );
});

console.log('Email worker is running...');