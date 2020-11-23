var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
const uri = process.env.URI
const LOCAL = process.env.LOCAL

// AWS
var AWS = require('aws-sdk');

// Enter copied or downloaded access ID and secret key here
const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors())

// DB Connection
var mongoose = require('mongoose');

mongoose.connect(LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));

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
        } else {
            console.log(`File uploaded successfully. ${data}`);
        }
    }).promise();
}

app.use('/api', router);
app.listen(port);
console.log('Running on: ' + port);