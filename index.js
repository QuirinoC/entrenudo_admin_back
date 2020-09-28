var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let http = require('http')
let fs = require('fs');
var cors = require('cors')

// AWS
var AWS = require('aws-sdk');

// Enter copied or downloaded access ID and secret key here
const ID = process.env.AWS_ACCESS_KEY_ID || '';
const SECRET = process.env.AWS_SECRET_ACCESS_KEY || '';

// The name of the bucket that you have created
const BUCKET_NAME = 'entrenudo-bucket';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors())

// DB Connection
// TODO: Replace with production string using env variables
var mongoose = require('mongoose');
const { Schema } = mongoose;
//const DB_URL = "mongodb+srv://mongodb-stitch-something-suzft:<password>@cluster0-bspcz.mongodb.net/entrenudo_admin?retryWrites=true&w=majority";
const uri = "mongodb://admin:admin123@ds127936.mlab.com:27936/entrenudo"
const LOCAL = 'mongodb://localhost:27017/entrenudo_admin'

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));

const Order = mongoose.model('Order', new Schema({
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

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Entrenudo Orders Admin' });
});

router.get('/order', async(req, res) => {
    let page = req.query.page || 0;
    let per_page = req.query.per_page || 5;
    const orders = await Order.find({})
    res.send(orders);
})
router.post('/order', async(req, res) => {
    req.body['Date'] = Date.now();
    req.body.status = req.body.status || 'Pending';
    const order = new Order(
        req.body
    );

    await order.save();

    let s3_image_url = ""
    if (req.body.messageImage) {
        try {
            s3_image_url = (await storeImage(req.body.messageImage, order._id)).Location;
            order.messageImage = s3_image_url;
            await order.save();
        } catch (err) {
            console.log(err)
        }
    }

    console.log(order);
    res.send({
        id: order._id,
        imageStored: s3_image_url
    });
})

async function storeImage(image, id) {
    const params = {
        Bucket: BUCKET_NAME,
        ACL: 'public-read',
        Key: `${id}.jpg`,
        Body: Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };

    return await s3.upload(params, async function(err, data) {
        if (err) {
            console.log("Error uploading image");
            console.log(err)
        }
        console.log(`File uploaded successfully. ${data}`);
    }).promise();
}

router.get('/details', async(req, res) => {
    const from = req.query.from || "";
    const to = req.query.to || "";
    const product = req.query.product || "";
    fs.readFile('form.html', 'utf-8', function(err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
        data = data.replace('PRODUCT', product)
        data = data.replace('FROM', from)
        data = data.replace('TO', to)
        res.write(data);
        res.end();
    });
})

router.post('/upload_image', async(req, res) => {

});

app.use('/api', router);

app.listen(port);
console.log('Running on: ' + port);