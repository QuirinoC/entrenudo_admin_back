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
const uri = "mongodb+srv://admin:admin123@entrenudo.bspcz.mongodb.net/entrenudo_admin?retryWrites=true&w=majority"
const LOCAL = 'mongodb://localhost:27017/entrenudo_admin'

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));


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
    let page = req.query.page || 0;
    let per_page = req.query.per_page || 5;
    const orders = await Order.find({})
    res.send(orders);
})
router.post('/order', async (req, res) => {
    console.log(req.body)
    const order = new Order(
        req.body
    );
    order.save();
    res.send(order);
})

app.use('/api', router);

app.listen(port);
console.log('Running on: ' + port);