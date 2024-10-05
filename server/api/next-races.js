import nextRaces from '../../demo/next_races.json';

export default defineEventHandler(async (event) => {
    try {
        return nextRaces;
    } catch (error) {
        console.error('Error fetching next races data:', error);
        return {
            status: 'error',
            message: 'Unable to fetch race data.'
        };
    }
});