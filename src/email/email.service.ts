import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly sender;
  private readonly transporter;
  private readonly url;
  private readonly frontendPath;

  constructor(private configService: ConfigService) {
    this.sender = this.configService.get('emailDatabase.sender');
    this.url = this.configService.get('emailDatabase.url');
    this.frontendPath = this.configService.get('emailDatabase.frontendPath');
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('emailDatabase.service'),
      auth: {
        user: this.sender,
        pass: this.configService.get('emailDatabase.password'),
      },
    });
  }

  async verify(email: string, token: string) {
    const srcPath = path.resolve(
      __dirname,
      'assets/template/email.template.hbs'
    );
    const readHTMLFile = fs.readFileSync(srcPath, 'utf-8');

    const template = await handlebars.compile(readHTMLFile);
    const url = `${this.url}/api/user/email/confirm-email/${token}`;
    const replacement = {
      url,
    };
    const htmltoSend = await template(replacement);
    const options = {
      from: this.sender,
      to: email,
      subject: 'Sending email with nodejs',
      html: htmltoSend,
    };
    try {
      this.transporter.sendMail(options);
    } catch (err) {
      console.error(err);
    }
    return;
  }

  async banNotify(email: string, id: string) {
    const srcPath = path.resolve(
      __dirname,
      './assets/template/email.ban.template.hbs'
    );
    const readHTMLFile = fs.readFileSync(srcPath, 'utf-8');
    const template = handlebars.compile(readHTMLFile);
    const replacement = {
      id,
    };
    const htmltoSend = await template(replacement);
    const options = {
      from: this.sender,
      to: email,
      subject: 'Sending email with nodejs',
      html: htmltoSend,
    };
    try {
      this.transporter.sendMail(options);
    } catch (err) {
      console.error(err);
    }
  }

  async offerNotify(
    email: string,
    assetId: string,
    offerPrice: number,
    userId: string,
    expireDate: Date,
    token: string
  ) {
    const srcPath = path.resolve(
      __dirname,
      './assets/template/email.offer.template.hbs'
    );
    const readHTMLFile = fs.readFileSync(srcPath, 'utf-8');

    const template = await handlebars.compile(readHTMLFile);
    const url = `${this.frontendPath}${token}`;
    const replacement = {
      assetId,
      offerPrice,
      url,
      userId,
      expireDate,
    };
    const htmltoSend = await template(replacement);
    const options = {
      from: this.sender,
      to: email,
      subject: 'Sending email with nodejs',
      html: htmltoSend,
    };
    try {
      this.transporter.sendMail(options);
    } catch (err) {
      console.error(err);
    }
    return;
  }

  async sendSummaryView(data: string[], email: string) {
    const srcPath = path.resolve(
      __dirname,
      'assets/template/email.summary.hbs'
    );
    const name = data.map((data) => data);
    const readHTMLFile = fs.readFileSync(srcPath, 'utf-8');

    const template = await handlebars.compile(readHTMLFile);

    const replacement = {
      name,
    };

    const htmltoSend = await template(replacement);
    const options = {
      from: this.sender,
      to: email,
      subject: 'Sending email with nodejs',
      html: htmltoSend,
    };
    try {
      return this.transporter.sendMail(options);
    } catch (err) {
      throw new err();
    }
  }
}
