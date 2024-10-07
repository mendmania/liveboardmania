import nextRaces from '../../demo/next_races.json';

const shuffleArray = (array) => {
    const arr = array.slice(); 
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const getRandomNumber = (min, max, decimal = false) => {
    const rand = Math.random() * (max - min) + min;
    return decimal ? rand : Math.floor(rand);
};

const updateRaceData = (data) => {
    const updatedData = JSON.parse(JSON.stringify(data));

    updatedData.data.races = updatedData.data.races.map((race) => {
        race.post_time += getRandomNumber(-3600, 3600);

        const purseChangeFactor = 1 + getRandomNumber(-99, 99) / 100;
        race.purse.amount = Math.round(race.purse.amount * purseChangeFactor);

        race.runners = race.runners.map((runner) => {
            runner.odds += getRandomNumber(-1, 1, true);

            if (runner.odds < 1) runner.odds = 1;

            if (!Number.isInteger(runner.odds)) {
                runner.odds = Number(runner.odds.toFixed(2));
            } else {
                runner.odds = Math.round(runner.odds);
            }

            return runner;
        });

        return race;
    });

    updatedData.data.races = shuffleArray(updatedData.data.races);

    return updatedData;
};

export default defineEventHandler(async (event) => {
    try {
        const updatedRaceData = updateRaceData(nextRaces);
        return updatedRaceData;
    } catch (error) {
        console.error('Error fetching next races data:', error);
        return {
            status: 'error',
            message: 'Unable to fetch race data.'
        };
    }
});
