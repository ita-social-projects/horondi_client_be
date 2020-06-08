import { model, Schema } from 'mongoose';

const OrderSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    required: true,
  },
  orderItems: [
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  deliveryAddress: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    buildingNumber: {
      type: String,
      required: true,
    },
  },
  deliveryType: {
    type: String,
    required: true,
    enum: ['currier', 'post', 'delivery servise'],
  },
  contactPhone: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: [
      'credit card',
      'pay pal',
      'cash',
      'google pay',
      'amazon pay',
      'apple pay',
    ],
  },
  status: {
    type: String,
    required: true,
    enum: ['delivered', 'pending', 'canceled'],
  },
});

const Orders = model('order', OrderSchema);

module.exports = Orders;
