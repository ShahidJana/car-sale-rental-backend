const Contact = require("../Models/contact");
const sendEmail = require("../utils/sendMail");

exports.ContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and message are required.",
      });
    }

    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    const emailBody = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 28px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h3 style="color: #222; text-align: center; font-size: 18px; margin-bottom: 30px;">New Message from Contact Form Submission</h3>

    <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Name: ${name}</p>
    <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Email: ${email}</p>
    <p style="font-size: 14px; color: #333; margin-bottom: 20px;">Phone: ${phone}</p>

    <div>
      <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Message:</p>
      <div style="background-color: #f9f9f9; padding: 18px; border-radius: 6px; color: #444; font-size: 12px; line-height: 1.6;">
        ${message}
      </div>
    </div>

    <p style="text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
      — Sent via <strong>JANADRIVE</strong> Contact Form —
    </p>
  </div>
`;

    await sendEmail(
      email,
      "janashahid999@gmail.com",
      "New Message from JANADRIVE",
      emailBody
    );
    res.status(201).json({
      success: true,
      message: "Message received. We'll get back to you soon.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error. Please try again later." });
  }
};
