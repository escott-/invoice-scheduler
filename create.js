var fs = require('fs');
var Invoice = require('invoice-ninja');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var XOAuth2 = require('xoauth2');

today = new Date();
due = new Date()
due.setDate(today.getDate() + 30);

// check balance from cloud store
// if balance add balance to balance field
input = {
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
  invoice.generatePDFStream(input).pipe(stream = fs.createWriteStream('invoice.pdf'))
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
