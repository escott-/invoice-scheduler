!function(e){function t(a){if(n[a])return n[a].exports;var r=n[a]={exports:{},id:a,loaded:!1};return e[a].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}var r=n(1),u=a(r),o=n(2),i=a(o),d=n(3),l=a(d),f=n(4),c=(a(f),n(5)),I=(a(c),n(6)),s=a(I),E=n(8),_=a(E),N=s["default"].PROJECT_ID;if(!N){var T=["Cannot find your project ID. Please set an environment variable named ",'"DATASET_ID", holding the ID of your project.'].join("");throw new Error(T)}var p=_["default"].datastore.dataset({projectId:N}),O=new Date,A=new Date;A.setDate(O.getDate()+30);var v={currencyFormat:s["default"].INVOICE_CURRENCY_FORMAT,invoice_number:2,date_now:O.toDateString(),date_due:A.toDateString(),from_name:s["default"].INVOICE_FROM_NAME,client_name:s["default"].INVOICE_CLIENT_NAME,subtotal:s["default"].INVOICE_AMOUNT,balance:s["default"].INVOICE_AMOUNT,items:[{description:s["default"].INVOICE_DESCRIPTION,quantity:s["default"].INVOICE_QUANTITY,rate:s["default"].INVOICE_RATE,amount:s["default"].INVOICE_AMOUNT}]},M=n(5).createXOAuth2Generator({user:s["default"].USERNAME,clientId:s["default"].CLIENT_ID,clientSecret:s["default"].CLIENT_SECRET,refreshToken:s["default"].REFRESH_TOKEN}),m=l["default"].createTransport({service:"gmail",auth:{xoauth2:M}}),C=n(9),x=p.createQuery("Invoice").order("invoice_number",{descending:!0}).limit(1);C.scheduleJob("20 * * * * *",function(){var e=new i["default"],t=u["default"].createWriteStream("invoice.pdf");p.runQuery(x,function(n,a){if(n)return n;v.balance=0===a.length?parseInt(s["default"].INVOICE_AMOUNT):a[0].data.balance+parseInt(s["default"].INVOICE_AMOUNT);var r={key:p.key("Invoice"),data:{invoice_number:0===a.length?12:++a[0].data.invoice_number,amount:parseInt(s["default"].INVOICE_AMOUNT),email:s["default"].EMAIL_TO,paid:"pending",balance:0===a.length?parseInt(s["default"].INVOICE_AMOUNT):a[0].data.balance+parseInt(s["default"].INVOICE_AMOUNT)}};e.generatePDFStream(v).pipe(t),t.on("close",function(e){m.verify(function(e,t){e?console.log(e):m.sendMail({from:s["default"].EMAIL_FROM,to:s["default"].EMAIL_TO,subject:s["default"].EMAIL_SUBJECT,text:s["default"].EMAIL_TEXT,attachments:[{filename:s["default"].EMAIL_ATTACHMENT,content:u["default"].createReadStream(s["default"].EMAIL_ATTACHMENT)}]},function(e,t){e?console.log(e):p.save(r,function(e,t){return e?void console.log(e):void 0})})})})})})},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("invoice-ninja")},function(e,t){e.exports=require("nodemailer")},function(e,t){e.exports=require("nodemailer-smtp-transport")},function(e,t){e.exports=require("xoauth2")},function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),u=a(r),o=(0,u["default"])(".env");t["default"]=o},function(e,t){e.exports=require("node-env-file")},function(e,t){e.exports=require("gcloud")},function(e,t){e.exports=require("node-schedule")}]);
//# sourceMappingURL=app.js.map