const app = require('express')()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

// Get connection string
const uri = process.env.MONGODB_URI;

// Connect to DB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var counter; 

async function getTotalVisitors() {
  try {
    // get the collection
    const collection = client.db("visitors").collection("count");
    var visitor_counter = await collection.estimatedDocumentCount();
    console.log(visitor_counter);
    return visitor_counter
  }
  finally {
    await client.close();
  }
}

const visitorCount = function (req, res, next) {
  counter = getTotalVisitors().catch(console.dir);
  console.log('LOGGED ' + counter + 'times')
  next()
}

app.use(visitorCount)

app.get('/', (req, res) => {
    //res.sendStatus(200)
    res.send({ some: counter})
})

app.listen(3000, () => {
    console.log('Server started')
})
