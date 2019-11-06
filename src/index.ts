import dotenv from 'dotenv';
import app from './app';
import 'reflect-metadata';
import 'datejs';

dotenv.config();

const port = 5000;

console.log(`[LOG]: ${new Date().toString('yyyy-MM-dd')}`);

app.listen(port, () => console.log(`Server running on port ${port}`));
