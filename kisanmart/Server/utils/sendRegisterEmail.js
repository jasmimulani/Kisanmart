import nodemailer from "nodemailer";

const sendRegisterEmail = async (name, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "YOUR_GMAIL_HERE",
        pass: process.env.EMAIL_PASS || "YOUR_GMAIL_APP_PASSWORD_HERE",
      },
    });

    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || "YOUR_GMAIL_HERE";

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to KisanMart, ${name}!</h1>
        </div>
        <div style="padding: 20px; color: #202124;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>We are thrilled to have you join <strong>KisanMart</strong>, your trusted partner in farming and agriculture.</p>
          <p>Your account is now active, and you can start enjoying the benefits:</p>
          <ul>
            <li>Access high-quality seeds, fertilizers, and farming tools</li>
            <li>Get real-time updates on crop prices and market trends</li>
            <li>Connect with fellow farmers and share farming tips</li>
            <li>Place orders easily with fast and secure delivery</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.kisanmart.com/login" 
               style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Go to KisanMart
            </a>
          </div>
          <p>If you have any questions, our dedicated support team is always here to help you grow.</p>
          <p><strong>Happy Farming!</strong></p>
          <p><b>– Team KisanMart</b></p>
        </div>
        <div style="background-color: #f1f3f4; color: #5f6368; padding: 15px; font-size: 12px; text-align: center;">
          You are receiving this email because you registered at KisanMart.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"KisanMart" <${fromAddress}>`,
      to: email,
      subject: "Welcome to KisanMart – Your Farming Partner!",
      html: htmlMessage,
    });

    console.log(`Registration email sent to ${email}`);
  } catch (error) {
    console.log("Registration Email Error:", error.message);
  }
};

export default sendRegisterEmail;
