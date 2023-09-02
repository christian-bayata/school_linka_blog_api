import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailSenderDto } from './email.dto';
import { EmailData } from './email.interface';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async emailSender(emailSenderDto: EmailSenderDto) {
    const emailTransporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });

    function emailData(): EmailData {
      return {
        from: emailSenderDto.from,
        to: emailSenderDto.to,
        subject: emailSenderDto.subject,
        text: emailSenderDto.text,
      };
    }
    await emailTransporter.sendMail(emailData());
  }
}
