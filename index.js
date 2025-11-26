const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mj89i6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect(); // Optional

    const db = client.db('course_db');
    const courseCollection = db.collection('courses');

    // Get all courses
    app.get('/courses', async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });

    // Create new course
    app.post('/courses', async (req, res) => {
      const course = req.body;
      const result = await courseCollection.insertOne(course);
      res.send(result);
    });

    // Get single course
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

    // Delete course
    app.delete('/courses/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await courseCollection.deleteOne(query);
      res.send(result);
    });

    console.log("Connected to MongoDB Successfully!");
  } finally {
    // Do not close for server apps
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Course API is running!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
