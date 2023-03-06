const app = require('express')()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

// Get connection string and connect to DB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const visitorCount = async function (req, res, next) {
  // Connect to DB
  await client.connect();
  // Get our count collection
  const collection = client.db("visitors").collection("count");
  // Get our current number of visitors
  var visitor_counter = await collection.estimatedDocumentCount();

  // Check current number of visitors
  if (visitor_counter === 0){
    // First visit!
    console.log('First time !!! Total visits = '+ visitor_counter );
    await collection.insertOne({ counter : 1})
    req.visitor_counter = 0;
  } else {
    // n-th visit
    console.log('LOGGED ' + visitor_counter + ' visits')
    await collection.insertOne({ counter : visitor_counter + 1})
    req.visitor_counter = visitor_counter;
  }
  
  // close connection
  await client.close()
  next()
}

app.use(visitorCount)

app.get('/', (req, res) => {
    res.send({ totalVisitors: req.visitor_counter})
})

app.listen(3000, () => {
    console.log('Server started')
})
