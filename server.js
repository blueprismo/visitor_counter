const app = require('express')()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

// Get connection string
const uri = process.env.MONGODB_URI;

// Connect to DB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const visitorCount = async function (req, res, next) {
  // Connect to DB
  await client.connect();
  // Get our count collection
  const collection = client.db("visitors").collection("count");
  // Get our number of visitors (if any!)
  var visitor_counter = await collection.estimatedDocumentCount();
  console.log(visitor_counter);

  // Check number of visitors
  if (visitor_counter === 0){
    // First visit! 
    //document.InsertOne(counter++)
    console.log('First time !!! ' + visitor_counter + '');
    req.visitor_counter = 0;
  } else {
    // n-th visit
    //document.InsertOne(initialvalue + 1)
    console.log('LOGGED ' + visitor_counter + 'times')
    req.visitor_counter = 0;
  }
  await client.close()
  next()
}

app.use(visitorCount)

app.get('/', (req, res) => {
    //res.sendStatus(200)
    res.send({ some: req.visitor_counter})
})

app.listen(3000, () => {
    console.log('Server started')
})
