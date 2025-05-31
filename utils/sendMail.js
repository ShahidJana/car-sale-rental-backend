const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "janashahid999@gmail.com",
    pass: "nnynyhekwzvkpyfo", // App password
  },
});

const sendEmail = async (from, to, subject, html) => {
  const mailOptions = {
    from: `"JANADRIVE" <${from}>`, 
    to,                            
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
