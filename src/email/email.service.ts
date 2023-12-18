import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { EmailOptions } from './email-options';
import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }
  async sendMemberJoinEmail(emailAddress: string, signupVerifyToken: string) {
    const baseUrl = this.config.baseUrl;
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
            가입확인 버튼을 누르시면 가입 인증이 완료됩니다.
            <form action="${url}" method="POST">
                <button>가입확인</button>
            </form>
        `,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}