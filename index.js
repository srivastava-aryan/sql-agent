import express from 'express';      
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import pool from './src/db/db.index.js';
import queryRoutes from './src/routes/queryRoutes.js';
import { initVectorStore } from './src/services/ragService.js';

const app = express();
app.use(cors());
app.use(express.json());

await initVectorStore();

app.get('/', (req, res) => {
    res.send("🏃‍♂️‍➡️Agent is running");
});

app.get('/test-db', async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
});

app.use('/api', queryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});