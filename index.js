const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// use Middleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ranar.k1lxxpd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const productCollection = client.db('product-list').collection('products')
    console.log("Connected to DataBase");

    // (Read) Find Multiple Documents
    app.get('/allproducts', async (req, res) => {
      const query = {}
      const cursor = productCollection.find(query)
      const products = await cursor.toArray()
      res.send(products)
    })

    // (Read) Find Single Document
    app.get('/allproducts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const product = await productCollection.findOne(query)
      res.send(product)
    })

    // Delete a Product 
    app.delete('/allproducts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const product = await productCollection.deleteOne(query)
      res.send(product);
    });

    // Update Products api
    app.put('/allproducts/:id', async (req, res) => {
      const id = req.params.id;
      const updatedQunatity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedQunatity.updateQuantity,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Add a Product 
    app.post('/allproducts', async (req, res) => {
      const newProduct = req.body;
      console.log('adding new user', newProduct);
      const product = await productCollection.insertOne(newProduct);
      res.send(product);
    });
  }

  finally {

  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World! Nodemon is Running')
})

app.listen(port, () => {
  console.log(`Nodemon Running on port ${port}`)
})