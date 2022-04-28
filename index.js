const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())






// const uri = "mongodb+srv://ideal-CRUD-and-JWT:idealcrudandjwt123456789@cluster0.3negq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3negq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("idealCRUDandJWTdb").collection("products");

    
    console.log("Connected correctly to server");

    // adding or posting a product in the db
    app.post('/products', async (req,res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    })


    // Get all products of the db
    app.get('/products', async (req,res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })





/* ________________________________
    >>>>>>>>>>>>Orders<<<<<<<<<<<<<<
    """""""""""""""""""""""""""""""" */



    
    const ordersCollection = client.db("idealCRUDandJWTdb").collection("orders");
    


    // adding or posting a order in the db agains an email
    app.post('/orders', async (req,res) => {
      const newOrder = req.body;
      // console.log(newOrder);
      const result = await ordersCollection.insertOne(newOrder);
      res.send(result);
    })


    // Get all orders agains an email from the db
    app.get('/orders', async (req,res) => {
      // console.log(req.query);
      const email = req.query.email;
      const query = {email: email};
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })


    // delete a order from db
    app.delete('/orders/:id', async (req,res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    })


    // update a order from db
    app.put('/orders/:id', async (req,res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const filter = {_id: ObjectId(id)};
      const options = {upsert : true}
      const updatedDoc = {$set: updateInfo};
      const result = await ordersCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

  } finally {

  }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World! Its for CRUD Operations')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})