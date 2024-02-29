import express from 'express';
import routes from './routes/api';

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// api routes
app.use('/', routes);

export default app;