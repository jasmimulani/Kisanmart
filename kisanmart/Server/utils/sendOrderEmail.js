import nodemailer from "nodemailer";
import User from "../models/User.js";
import Product from "../models/product.js";

const sendOrderEmail = async (userId, order) => {
  try {
    // Fetch user
    const user = await User.findById(userId);
    if (!user || !user.email) return;

    // Fetch products
    const items = await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          name: product?.name || "Product",
          quantity: item.quantity,
          price: product?.offerprice || 0,
        };
      })
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "YOUR_GMAIL_HERE",
        pass: process.env.EMAIL_PASS || "YOUR_GMAIL_APP_PASSWORD_HERE",
      },
    });

    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || "YOUR_GMAIL_HERE";

    // Create HTML table for items
    const itemHtml = items
      .map(
        (i) =>
          `<tr>
            <td style="padding:8px; border-bottom:1px solid #ddd;">${i.name}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd;">${i.quantity}</td>
            <td style="padding:8px; border-bottom:1px solid #ddd;">₹${i.quantity * i.price}</td>
          </tr>`
      )
      .join("");

    // Professional HTML template
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
          <h1>Order Confirmed – KisanMart</h1>
        </div>
        <div style="padding: 20px; color: #202124;">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Thank you for your order! Your farming supplies are on the way.</p>

          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total Amount:</strong> ₹${order.amount}</p>
          <p><strong>Payment Mode:</strong> ${order.paymentType}</p>

          <h3>Order Details:</h3>
          <table style="width:100%; border-collapse: collapse; margin-bottom:20px;">
            <tr>
              <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Product</th>
              <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Quantity</th>
              <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Price</th>
            </tr>
            ${itemHtml}
          </table>

          <div style="text-align: center; margin: 20px 0;">
            <a href="https://www.kisanmart.com/dashboard" 
               style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Go to My Account
            </a>
          </div>

          <p>We’ll notify you once your items are shipped. You can track your order anytime in your KisanMart account.</p>
          <p>For any questions or support, feel free to contact our dedicated team.</p>
          <p><strong>Happy Farming!</strong></p>
          <p><b>– Team KisanMart</b></p>
        </div>
        <div style="background-color: #f1f3f4; color: #5f6368; padding: 15px; font-size: 12px; text-align: center;">
          You are receiving this email because you placed an order at KisanMart.
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"KisanMart" <${fromAddress}>`,
      to: user.email,
      subject: "Your KisanMart Order is Confirmed!",
      html: htmlMessage,
    });

    console.log(`Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.log("Email Error:", error.message);
  }
};

export default sendOrderEmail;
