const http = require('http');

const data = JSON.stringify({
  messages: [{ role: "user", content: "What is 25 * 4?" }],
  model: "meta-llama/llama-3.3-70b-instruct:free"
});

const req = http.request("http://localhost:3000/api/chat", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    // Need a valid session cookie for requireSession() to pass!
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => { console.log("Response:", body.substring(0, 500)); });
});
req.on('error', console.error);
req.write(data);
req.end();
