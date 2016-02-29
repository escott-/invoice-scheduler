import fs from 'fs';
import Invoice from 'invoice-ninja';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import XOAuth2 from 'xoauth2';
import config from './config';

const today = new Date();
const due = new Date()
due.setDate(today.getDate() + 30);

// check balance from cloud store
// if balance add balance to balance field
const input = {
  currencyFormat: config.INVOICE_CURRENCY_FORMAT,
  invoice_number: 2,
  date_now: today.toDateString(),
  date_due: due.toDateString(),
  from_name: config.INVOICE_FROM_NAME,
  client_name: config.INVOICE_CLIENT_NAME,
  items: [
    {
      description: config.INVOICE_DESCRIPTION,
      quantity: config.INVOICE_QUANTITY,
      rate: config.INVOICE_RATE,
      amount: config.INVOICE_AMOUNT
    }
  ]
};
const generator = require('xoauth2').createXOAuth2Generator({
  user: config.USERNAME,
  clientId: config.CLIENT_ID,
  clientSecret: confg.CLIENT_SECRET,
  refreshToken: config.REFRESH_TOKEN
});
const transporter = nodemailer.createTransport(({
  service: 'gmail',
  auth: {
    xoauth2: generator
  }
}));
// create scheduler to run create.js every 30 days
const schedule = require('node-schedule');
// 0 0 */30 0 0 every 30 days
// 20 * * * * * for testing
const j = schedule.scheduleJob('20 * * * * *', function(){
  const invoice = new Invoice();
  const stream = fs.createWriteStream('invoice.pdf');
  invoice.generatePDFStream(input).pipe(stream)
  stream.on('close', function(err){
    if(!err){
      // send mail with defined transport object
      transporter.verify(function(error, success) {
       if (error) {
         console.log(error);
       } else {
         transporter.sendMail({
           from: config.EMAIL_FROM,
           to: config.EMAIL_TO,
           subject: config.EMAIL_SUBJECT,
           text: config.EMAIL_TEXT,
           attachments: [{   // stream as an attachment
             filename: config.EMAIL_ATTACHMENT,
             content: fs.createReadStream(config.EMAIL_ATTACHMENT)
           }]
         }, function(error, response) {
              if (error) {
                console.log(error);
              } else {
                console.log('Message sent');
              }
         });
       }
      });
    } else {
      // log error
    }
  })
});

// after scheduler completes send email
// after email completes
// delete invoice from fs
