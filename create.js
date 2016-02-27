import fs from 'fs';
import Invoice from 'invoice-ninja';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import XOAuth2 from 'xoauth2';

const today = new Date();
const due = new Date()
due.setDate(today.getDate() + 30);

// check balance from cloud store
// if balance add balance to balance field
const input = {
  currencyFormat: "$",
  invoice_number: 2,
  date_now: today.toDateString(),
  date_due: due.toDateString(),
  from_name: '',
  client_name: '',
  items: [
    {
      description: 'Web Hosting',
      quantity: 1,
      rate: 30,
      amount: 30
    }
  ]
};
var generator = require('xoauth2').createXOAuth2Generator({
  user: '',
  clientId: '',
  clientSecret: '',
  refreshToken: ''
});
var transporter = nodemailer.createTransport(({
  service: 'gmail',
  auth: {
    xoauth2: generator
  }
}));
// create scheduler to run create.js every 30 days
var schedule = require('node-schedule');
// 0 0 */30 0 0 every 30 days
// 20 * * * * * for testing
var j = schedule.scheduleJob('20 * * * * *', function(){
  var invoice = new Invoice();
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
           from: '',
           to: '',
           subject: 'hello world!',
           text: 'Authenticated with OAuth2',
           attachments: [{   // stream as an attachment
             filename: 'invoice.pdf',
             content: fs.createReadStream('invoice.pdf')
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
