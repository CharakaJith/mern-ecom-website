const nodemailer = require('nodemailer');
const logger = require('../middleware/log/logger');
const { LOG_TYPE } = require('../constants/logger.constants');
const { STATUS_CODE } = require('../constants/app.constants');
const { MAIL } = require('../common/messages');

require('dotenv').config();

// configure transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailService = {
  sendEmail: async (to, order) => {
    try {
      // format order
      const placedDate = new Date(order.orderDate).toLocaleDateString('en-GB');

      // items table
      const itemsHtml = order.items
        .map(
          (item, index) => `
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">${index + 1}</td>
            <td style="padding:8px; border:1px solid #ddd;">${item.name}</td>
            <td style="padding:8px; border:1px solid #ddd;">${item.size}</td>
            <td style="padding:8px; border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:8px; border:1px solid #ddd;">LKR ${item.price.toLocaleString()}.00</td>
            <td style="padding:8px; border:1px solid #ddd;">LKR ${(item.price * item.quantity).toLocaleString()}.00</td>
          </tr>
        `,
        )
        .join('');

      const html = `
        <div style="font-family:Arial,sans-serif; padding:20px; color:#333;">
          <h2 style="color:#2c3e50;">We have recieved your order - ${order.displayId}</h2>
          <p>Thank you for your order! Here are your order details:</p>
          
          <p><strong>order ID:</strong> ${order.displayId}</p>
          <p><strong>Placed Date:</strong> ${placedDate}</p>

          <table style="border-collapse:collapse; width:100%; margin-top:15px;">
            <thead>
              <tr style="background:#f4f4f4;">
                <th style="padding:8px; border:1px solid #ddd;">#</th>
                <th style="padding:8px; border:1px solid #ddd;">Item Name</th>
                <th style="padding:8px; border:1px solid #ddd;">Size</th>
                <th style="padding:8px; border:1px solid #ddd;">Qty</th>
                <th style="padding:8px; border:1px solid #ddd;">Price</th>
                <th style="padding:8px; border:1px solid #ddd;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <h3 style="margin-top:20px; color:#2c3e50;">Total: LKR ${order.totalPrice}</h3>

          <p style="margin-top:30px;">We’ll notify you once your order is shipped.</p>
          <p style="color:#555;">Best regards,<br/>Stich & Style Team</p>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `"Stich & Style" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Order Confrimation',
        html,
      });

      logger(LOG_TYPE.INFO, true, STATUS_CODE.OK, MAIL.SEND.SUCCESS(to));

      return info;
    } catch (error) {
      logger(LOG_TYPE.ERROR, false, STATUS_CODE.SERVER_ERROR, MAIL.SEND.FAILED(error.message));
    }
  },
};

module.exports = emailService;
