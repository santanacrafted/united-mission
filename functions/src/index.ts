import { onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as nodemailer from 'nodemailer';
import * as logger from 'firebase-functions/logger';

const gmailUser = defineSecret('EMAIL_USER');
const gmailPass = defineSecret('EMAIL_PASS');

export const sendContactEmail = onCall(
  {
    secrets: [gmailUser, gmailPass],
    region: 'us-central1',
  },
  async (request) => {
    const { name, email, message } = request.data;

    logger.info('Preparing transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser.value(),
        pass: gmailPass.value(),
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: gmailUser.value(),
      subject: 'New Contact Form Submission',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      logger.info('Sending email...');
      await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully.');
      return { success: true };
    } catch (error: any) {
      logger.error('Failed to send email', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  }
);
