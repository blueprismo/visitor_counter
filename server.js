const express = require('express')
const app = express()
const counterFilePath = 'counter.txt';
const fs = require('fs')

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
 
// Read how many people are there
function readCounter() {
  try {
    const counter = parseInt(fs.readFileSync(counterFilePath, 'utf8'));
    return isNaN(counter) ? 0 : counter; // If counter is NaN, return 0
  } catch (err) {
    // Return 0 if file doesn't exist or there is an error reading the file
    return 0;
  }
}

// Function to write the counter value to the file
function writeCounter(counter) {
  fs.writeFileSync(counterFilePath, counter.toString());
}

// Increment the counter and write it back to the file
function incrementCounter() {
  const counter = readCounter() + 1;
  writeCounter(counter);
}

// Example usage: get the current counter value
function getCurrentCounter() {
  const counter = readCounter();
  console.log('Current counter value:', counter);
  return counter;
}

// get the image
app.get('/count.svg', (req, res) => {
  let visitor_counter = getCurrentCounter();

  if (visitor_counter === 0){
    visitor_counter = 0;
    visitor_counter.counter = 0;
    // First visit!
    console.log('First time !!! Total visits = 0');
    incrementCounter();
    
  } else {
    // n-th visit
    console.log('LOGGED ' + visitor_counter + ' visits')
    incrementCounter();
  }

  // This helps with GitHub's image cache 
  //   see more: https://rushter.com/counter.svg
  res.set({
  'content-type': 'image/svg+xml',
  'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
  })
  console.log("Visitor counter before send to func: " + visitor_counter)
  // Send the generated SVG as the result
  res.send(getCountImage(visitor_counter));
})

const listener = app.listen(3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})