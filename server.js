const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const passport = require('passport');
require('./middleware/auth'); // Ensure passport strategy is loaded

dotenv.config();

const app = express();

app.use(express.json());

app.use(passport.initialize());

app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/post'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
