import nodemailer, { Transporter } from "nodemailer";
import { MailInterface } from "../types/mailservice";
import { MailResponse } from "../types/mailresponse";
import handlebars from "handlebars";
import path from "path";
import fs from "fs";
require("dotenv").config();


const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    }
});


async function sendEmail(
    type: string,
    options: Partial<MailInterface>,
  ): Promise<MailResponse> {
    const filepath = path.join(`template/${type}.html`);
    const source = fs.readFileSync(filepath, "utf-8").toString();
    const template = handlebars.compile(source);
    const data = template(options);
    return await transporter.sendMail({
        from: process.env.SMTP_USERNAME,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: data,
      })
      .then((info: MailResponse) => {
        return info;
      });
  }

export {
    sendEmail
};