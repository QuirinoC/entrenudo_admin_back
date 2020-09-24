var mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Order', new Schema({
    title: String,
    body: String,
    from: String,
    to: String,
    date: Date,
    background_image: String,
}));