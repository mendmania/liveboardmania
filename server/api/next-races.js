import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineEventHandler(async (event) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, '..', '..', 'demo', 'next_races.json');
        console.log(`Reading file from: ${filePath}`);

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