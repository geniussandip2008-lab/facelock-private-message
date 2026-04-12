const express = require('express');
const app = express(); // 🔥 এইটাই missing ছিল

const PORT = process.env.PORT || 3001;

// route
app.get('/', (req, res) => {
  res.send("Backend working 🚀");
});

// server start
app.listen(PORT, () => {
  console.log(`🔥 FaceLock Backend running on port ${PORT}`);
});