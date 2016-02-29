import fs from 'fs';
import Invoice from 'invoice-ninja';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import XOAuth2 from 'xoauth2';
import config from './config';
import gcloud from 'gcloud';

const projectId = config.PROJECT_ID;

if (!projectId) {
  var MISSING_ID = [
    'Cannot find your project ID. Please set an environment variable named ',
    '"DATASET_ID", holding the ID of your project.'
  ].join('');
  throw new Error(MISSING_ID);
}

const ds = gcloud.datastore.dataset({
  projectId: config.PROJECT_ID
});

const today = new Date();
const due = new Date()
due.setDate(today.getDate() + 30);

const input = {
  currencyFormat: config.INVOICE_CURRENCY_FORMAT,
  invoice_number: 2,
  date_now: today.toDateString(),
  date_due: due.toDateString(),
  from_name: config.INVOICE_FROM_NAME,
  client_name: config.INVOICE_CLIENT_NAME,
  subtotal: config.INVOICE_AMOUNT,
  balance: config.INVOICE_AMOUNT,
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
  clientSecret: config.CLIENT_SECRET,
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
// invoice number = query the last invoice number || pick a number to start
// balance = query balance and add amount || if no balance it will be amount

const q = ds.createQuery("Invoice")
  .order('invoice_number', {
    descending: true
  })
  .limit(1);

schedule.scheduleJob('2 * * * * *', function(){
  const invoice = new Invoice();
  const stream = fs.createWriteStream('invoice.pdf');
  ds.runQuery(q, function(err, invoices) {
    if (err) {
      // log error
      return err
    }
    input.balance = invoices.length === 0 ? parseInt(config.INVOICE_AMOUNT) : invoices[0].data.balance + parseInt(config.INVOICE_AMOUNT)
    var entity = {
      key: ds.key("Invoice"),
      data: {
        invoice_number: invoices.length === 0 ? 1 : ++invoices[0].data.invoice_number,
        amount: parseInt(config.INVOICE_AMOUNT),
        email: config.EMAIL_TO,
        paid:"pending",
        balance: invoices.length === 0 ? parseInt(config.INVOICE_AMOUNT) : invoices[0].data.balance + parseInt(config.INVOICE_AMOUNT)
      }
    };
    invoice.generatePDFStream(input).pipe(stream);
    stream.on('close', function(err){
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
                ds.save(entity, function(err, key) {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  console.log(key);
                });
              }
            });
          }
        });
      });
    });
  });

// after scheduler completes send email
// after email completes
// delete invoice from fs
