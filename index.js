const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://artistic-aura-client.web.app"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.User_DB}:${process.env.UserPass_DB}@cluster0.tvtcgta.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db("artisticAuraDB").collection("craft");
    const craftCategoryCollection = client
      .db("artisticAuraDB")
      .collection("categoryCraft");

    app.get("/craft", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.get("/myCraft/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await craftCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get("/categoryCraft", async (req, res) => {
      const cursor = craftCategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/categoryCraft/:subcategory_name", async (req, res) => {
      console.log(req.params.subcategory_name);
      const result = await craftCategoryCollection
        .find({ subcategory_name: req.params.subcategory_name })
        .toArray();
      res.send(result);
    });

    app.get("/categoryCraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCategoryCollection.findOne(query);
      res.send(result);
    });

    app.post("/addCraft", async (req, res) => {
      const addNewItem = req.body;
      console.log(addNewItem);
      const result = await craftCollection.insertOne(addNewItem);
      res.send(result);
    });

    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;

      const craft = {
        $set: {
          item_name: updatedCraft.item_name,
          subcategory_name: updatedCraft.subcategory_name,
          short_description: updatedCraft.short_description,
          stock_status: updatedCraft.stock_status,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          processing_time: updatedCraft.processing_time,
          customization: updatedCraft.customization,
          photo: updatedCraft.photo,
        },
      };

      const result = await craftCollection.updateOne(filter, craft, options);
      res.send(result);
    });

    app.delete("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      `Pinged your deployment. You successfully connected to MongoDB! ${port}`
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});
app.listen(port, () => {
  console.log(`Artistic Aura Server is running on port: ${port}`);
});
