import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  async lemon({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
    // mail configurations
    const transporter = createTransport({
      service: 'gmail',
      port: 587,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // main
    await transporter.sendMail({
      to: process.env.MAIL_USER,
      subject: `【LeMoN】 ${subject}`,
      text: `
      お名前： ${name} 様
      メールアドレス： ${email}
      件名：${subject}
      本文：
      ${message}
      `,
    });
    // confirmation
    await transporter.sendMail({
      to: email,
      subject: '【LeMoN】 確認メール',
      text: `
      ${name} 様

      こちらは「LeMoN」からの自動送信です。
      お客様のメールは正常に送られました。

      以下お問い合わせ内容↓

      ---------------------------------------------------------------------------------
      
      お名前： ${name} 様
      メールアドレス： ${email}
      件名：${subject}
      本文：
      ${message}

      ---------------------------------------------------------------------------------
      `,
    });
  }
}
