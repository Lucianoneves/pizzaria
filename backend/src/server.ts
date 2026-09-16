import dns from 'node:dns';
import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { router } from './routes';

dns.setDefaultResultOrder('ipv4first');

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
    }

    return response.status(500).json({
        error: 'Internal server error',
    });
});


const PORT = process.env.PORT || 3333; 

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

