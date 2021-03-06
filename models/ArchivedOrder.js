'use strict';
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const ArchivedOrderSchema = new Schema({
  tableNumber: {
    type: Number,
    required: true
  },
  seatOrders: [
    {
      seatNumber: {
        type: Number,
        required: true
      },
      menuItems: [
        {
          itemName: {
            type: String,
            required: true
          },
          itemPrepareTime: {
            type: Number,
            required: true
          },
          itemPrice: {
            type: String,
            required: true
          }
        }
      ]
    }
  ],
  // employeeName: {
  //   type: String,
  //   required: true
  // },
  orderInTime: {
    type: Date,
    required: true,
    default: Date.now()
  }
});
module.exports = mongoose.model(`ArchivedOrder`, ArchivedOrderSchema);
