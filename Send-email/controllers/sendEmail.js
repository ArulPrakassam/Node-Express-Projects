const nodemailer = require("nodemailer");
const sendGrid = require("@sendgrid/mail");

//ethereal nodemail
const sendEmailEth = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "matilda.predovic4@ethereal.email",
      pass: "tMPumtD8QJmRP24sA3",
    },
  });

  const info = await transporter.sendMail({
    from: '"Testing" <example@gmail.com>',
    to: "sample@gmail.com",
    subject: "test email",
    html: "<h2>Send email success with node js</h2>",
  });
  res.json(info);
};

//sendgrid/mail
const sendEmail = async (req, res) => {
  sendGrid.setApiKey(process.env.API_KEY);
  const msg = {
    to: "example@gmail.com",
    from: "ouremail@gmail.com",
    subject: "test email",
    html: "<h2>Send email success with node js</h2>",
  };
  const info = await sendGrid.send(msg);
  res.json(info);
};
module.exports = sendEmail;
