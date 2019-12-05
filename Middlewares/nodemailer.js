const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.username}`,
        pass: `${process.env.password}`,
    }
});

exports.sendMail = (mailOptions,cb) => {
    transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        cb(error);
    } 
    else {
        cb(null,info);
        console.log('Email sent: ' + info);
    }
  })
}