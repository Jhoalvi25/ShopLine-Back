var nodemailer = require("nodemailer");

var mailOptions = {
  from: '"Example Team" <from@example.com>',
  to: "user1@example.com, user2@example.com",
  subject: "Nice Nodemailer test",
  text: "Hey there, it’s our first message sent with Nodemailer 😉 ",
  html: "<b>Hey there! </b><br> This is our first message sent with Nodemailer",
};

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: "shoplineproject2023@gmail.com",
        pass: "ymzrdtjgcmpxzivl",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    await transporter.sendMail({
      from: "from@example.com",
      to: email,
      subject: subject,
      text: text,
      html: `<h2>Hi! Click in the link bellow to complete your account verification</h2><br>${text}`,
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = sendEmail;
