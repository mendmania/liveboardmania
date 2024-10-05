// server/api/next-races.js

import { readFile } from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
    try {
        const filePath = path.join(process.cwd(), 'demo', 'next_races.json');
        console.log(filePath)

        const data = await readFile(filePath, 'utf-8');

        const jsonData = JSON.parse(data);

        return jsonData;
    } catch (error) {
        console.error('Error reading next_races.json:', error);
        return {
            status: 'error',
            message: 'Unable to fetch race data.'
        };
    }
});
