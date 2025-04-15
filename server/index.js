const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*path', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});