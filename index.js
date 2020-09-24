var express = require('express');
var app = express();
var bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB Connection
// TODO: Replace with production string using env variables
var mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.connect('mongodb://localhost:27017/entrenudo_admin', { useNewUrlParser: true });


const Order = mongoose.model('Order', new Schema({
    title: String,
    body: String,
    from: String,
    to: String,
    date: Date,
    background_image: String,
}));

const ord1 = Order.create({
    "title": "hola raza"
})
console.log(ord1)

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function (req, res) {
    res.json({ message: 'Entrenudo Orders Admin' });
});

router.get('/order', async (req, res) => {

    const orders = await Order.find({}, console.log);
    res.send(orders);
})
router.post('/order', async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.send(order)
})

app.use('/api', router);

app.listen(port);
console.log('Running on: ' + port);