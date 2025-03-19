const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookings');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
