const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port =process.env.PORT || 5000

// middilwere
app.use(express.json())
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mj89i6p.mongodb.net/?appName=Cluster0`;


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

    const db = client.db('course_db')
    const courseCollection =db.collection('courses')

    // parcel api 
    app.get('/courses',async(req,res)=>{
      const result = await courseCollection.find().toArray()
      res.send(result)

    })

    app.post('/courses', async(req,res)=>{
        const parcel = req.body
        const result = await courseCollection.insertOne(parcel)
        res.send(result)
    })

    app.get('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const course = await courseCollection.findOne({ _id: new ObjectId(id) });
    if (!course) return res.status(404).send({ error: 'Course not found' });
    res.send(course);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete('/courses/:id', async(req,res)=>{
  const id =req.params.id
  const quary ={_id:new ObjectId(id)}

  const result = await courseCollection.deleteOne(quary)
  res.send(result)

})




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('course api is runn!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})