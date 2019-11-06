import dotenv from 'dotenv';
import app from './app';
import 'reflect-metadata';
import 'datejs';

dotenv.config();

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
