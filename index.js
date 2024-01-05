const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();



app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://newdata:hAC0Qp8JViZ7dFyn@cluster0.pg0uckr.mongodb.net/?retryWrites=true&w=majority';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const itemsCollection = client.db('devhouse').collection('products');
      const customerCollection = client.db('devhouse').collection('customer');
      const supplyCollection = client.db('devhouse').collection('supplyproducts');
      const employeeCollection = client.db('devhouse').collection('employee');
     
      // console.log("Pinged your deployment. You successfully connected to MongoDB!");
      app.get('/products', async(req,res)=>{
        const query = {};
        const cursor = itemsCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
  
      });

      app.post('/products', async(req, res) =>{
        console.log("Request", req.body);
        const newUser = req.body;
        const result = await itemsCollection.insertOne(newUser);
        res.send(result);
      });
      app.get('/products/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const products = await itemsCollection.findOne(query);
        res.send(products);
  
      });

      app.delete('/products/:id', async(req, res) =>{
        const id = (req.params.id);
        const query = {_id:new ObjectId(id)};
        const result = await itemsCollection.deleteOne(query);
        res.send(result);
      });

      app.put('/products/:id', async(req, res) =>{
        const id = req.params.id;
        const updateItem = req.body;
        const query = {_id:new ObjectId(id)};
        const options= { upsert: true};
        const updatedDoc ={
          $set: {
            name: updateItem.name,
            price: updateItem.price,
            imei: updateItem.imei,
            stock: updateItem.stock
          }
        };
        console.log(updatedDoc);
        const result = await itemsCollection.updateOne(query, updatedDoc, options);
        
        res.send(result);
        
      })




      //customer api
      app.get('/customer', async(req,res)=>{
        const query = {};
        const cursor = customerCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
  
      });

      app.post('/customer', async(req, res) =>{
        // console.log("Request", req.body);
        const newCustomer = req.body;
        const result = await customerCollection.insertOne(newCustomer);
        res.send(result);
      });


      app.get('/supplyproducts', async(req,res)=>{
        const query = {};
        const cursor = supplyCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
  
      });
      app.post('/supplyproducts', async(req, res) =>{
        // console.log("Request", req.body);
        const newSupplyProducts = req.body;
        const result = await supplyCollection.insertOne(newSupplyProducts);

        res.send(result);
      });




    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
    }
    run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send("Server is running");
})

app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
})