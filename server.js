const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function getCountImage(count) {
  // This is not the greatest way for generating an SVG but it'll do for now
  const countArray = count.toString().padStart(6, '0').split('');

  const parts = countArray.reduce((acc, next, index) => `
        ${acc}
        <rect id="Rectangle" fill="#000000" x="${index * 32}" y="0.5" width="29" height="29"></rect>
        <text id="0" font-family="Courier" font-size="24" font-weight="normal" fill="#00FF13">
            <tspan x="${index * 32 + 7}" y="22">${next}</tspan>
        </text>
`, '');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="189px" height="30px" viewBox="0 0 189 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Count</title>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      ${parts}
    </g>
</svg>
`
}
  
// get the image
app.get('/count.svg', async (req, res) => {

  const collection = client.db("visitors").collection("count");
  let visitor_counter = await collection.findOne();
  if (visitor_counter === null){
    visitor_counter = 0;
    visitor_counter.counter = 0;
    // First visit!
    console.log('First time !!! Total visits = 0');
    await collection.insertOne({ counter : 1})
    
  } else {
    // n-th visit
    let newvalue = visitor_counter.counter + 1
    console.log(newvalue)
    console.log('LOGGED ' + visitor_counter.counter + ' visits')
    await collection.updateOne({},{ $set: { counter : newvalue}})
  }

  //console.log(visitor_counter)

  // This helps with GitHub's image cache 
  //   see more: https://rushter.com/counter.svg
  res.set({
  'content-type': 'image/svg+xml',
  'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
  })
  
  // Send the generated SVG as the result
  res.send(getCountImage(visitor_counter.counter));
})

const listener = app.listen(3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})