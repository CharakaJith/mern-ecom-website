const emailService = require('../services/email.service');
require('dotenv').config();

async function testEmailService() {
  // mock order
  const mockOrder = {
    _id: '68dd6cf3bf4a119b06d5d286',
    orderDate: '2025-10-01T18:03:31.771Z',
    totalPrice: 24450,
    items: [
      { name: 'Compression Tank', size: 'L', quantity: 1, price: 4750 },
      { name: 'Workout Shirt', size: 'XL', quantity: 1, price: 5450 },
      { name: 'Shorts', size: 'M', quantity: 2, price: 4750 },
    ],
  };

  try {
    const info = await emailService.sendEmail(process.env.TEST_MAIL, mockOrder);
    console.log('Email sent successfully!', info.messageId);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

testEmailService();
