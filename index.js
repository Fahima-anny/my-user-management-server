const express = require('express');
const cors = require('cors');
require('dotenv').config() ;
const app = express() ;
const port = process.env.PORT || 5000 ;


// middleware 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohdc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const usersCollection = client.db("userManagementDB").collection("users");


// create a new user 
app.post("/users", async(req, res) => {
    const user = req.body ;
    // console.log(user) ;
    const result = await usersCollection.insertOne(user) ;
    res.send(result) ;
})

// get all users 
app.get("/users", async(req, res) => {
    const cursor = usersCollection.find() ;
    const result = await cursor.toArray() ;
    res.send(result) 
})


// get one user 
app.get("/users/:id", async(req,res) => {
    const id = req.params.id ;
    const query = {_id: new ObjectId(id)} ;
    const result = await usersCollection.findOne(query) ;
    res.send(result)
})


// update an user 
app.patch("/users/:id", async(req, res) => {
    const id = req.params.id ;
    const user = req.body ;
    const filter  = {_id: new ObjectId(id)} ;
    const updatedDoc = {
        $set: {
name: user.name ,
email: user.email ,
gender: user.gender ,
status: user.status ,
        }
    }
    const options = {upsert: true} ;
    const result = await usersCollection.updateOne(filter, updatedDoc, options) ;
    res.send(result) ;
})


// delete one user 
app.delete("/users/:id", async(req,res) => {
    const id = req.params.id ;
    console.log(id,"delete kor sala re")
    const query = {_id : new ObjectId(id)} ;
    const result = await usersCollection.deleteOne(query) ;
    res.send(result)
})


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("user management system running hai bossy")
})

app.listen(port, () => {
    console.log(`user manager running on port : ${port}`)
})
