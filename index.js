const express = require('express');
const port = 4000;
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oeq97.mongodb.net/emaJhonShop?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World ema-jhon!')
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(`emaJhonShop`).collection(`products`);
  const ordersCollection = client.db(`emaJhonShop`).collection(`order`);

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
    .then(result => {
      res.send(result.insertedCount);
    })
  })

  app.get('/products', (req, res)=> {
    productsCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.get('/products/:key', (req, res)=> {
    productsCollection.find({key : req.params.key})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })

  app.post('/productByKeys', (req, res)=>{
    const productKeys = req.body;
    productsCollection.find({key : {$in: productKeys}})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.json(result.insertedCount);
    })
  })
});

app.listen(port);