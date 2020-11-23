var mongoose = require('mongoose');
const { Schema } = mongoose;

export const Order = mongoose.model('Order', new Schema({
    colorPalette: String,
    size: String,
    style: String,
    messageImage: String,
    sender: String,
    senderPhone: String,
    price: Number,
    date: Date,
    status: String
}));
