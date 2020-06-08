const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const path = require('path');
const rfs = require('rotating-file-stream');
const connectDB = require('./config/db');

const errorHandler = require('./middleware/errorHandler');

// const auth = require('./routes/users/auth');
// const users = require('./routes/users/users');
// const products = require('./routes/products/products');
// const catalogs = require('./routes/products/catalogs');
// const categories = require('./routes/products/categories');
// const brands = require('./routes/products/brands');
// const colors = require('./routes/products/colors');
// const generator = require('./routes/products/generator');
// const orders = require('./routes/purchase/order');
// const news = require('./routes/pages/news');
// const rating = require('./routes/rating/rating');
// const comments = require('./routes/comments/comments');

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

// app.use('/auth', auth);
// app.use('/users', users);
// app.use('/products', products);
// app.use('/catalogs', catalogs);
// app.use('/categories', categories);
// app.use('/brands', brands);
// app.use('/colors', colors);
// app.use('/generator', generator);
// app.use('/orders', orders);
// app.use('/news', news);
// app.use('/rating', rating);
// app.use('/comments', comments);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
