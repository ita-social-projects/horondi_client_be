const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const path = require('path');
const rfs = require('rotating-file-stream');
const connectDB = require('./config/db');

const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const accessLogStream = rfs.createStream('access.log', {
  interval: '3d',
  path: path.join(__dirname, 'logs'),
});

const app = express();
app.use(cors());
connectDB();

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
