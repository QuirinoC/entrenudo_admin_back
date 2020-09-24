var express = require('express');
var app = express();
var bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB Connection
// TODO: Replace with production string using env variables
var mongoose = require('mongoose');
const { Schema } = mongoose;
//const DB_URL = "mongodb+srv://mongodb-stitch-something-suzft:<password>@cluster0-bspcz.mongodb.net/entrenudo_admin?retryWrites=true&w=majority";
const DB_URL = "mongodb://admin:admin1234@ds127936.mlab.com:27936/entrenudo_admin"
const LOCAL = 'mongodb://localhost:27017/entrenudo_admin'
mongoose.createConnection(DB_URL, { useNewUrlParser: true });


const Order = mongoose.model('Order', new Schema({
    title: String,
    body: String,
    from: String,
    to: String,
    date: Date,
    background_image: String,
}));


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