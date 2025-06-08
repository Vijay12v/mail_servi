// // app.js content
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const router = require('./routes');

// const app = express();

// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '../../public')));
// app.use(router);

// // Serve frontend
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../public/index.html'));
// });

// module.exports = app;




const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes');

const app = express();

app.use(bodyParser.json());
// Fix: Change the path resolution - go up one level from server directory to reach public
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);

// Serve frontend
app.get('*', (req, res) => {
  // Fix: Same path correction here
res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;