<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { EXCHANGE } from "~/constants/exchangeRate";


const props = defineProps({
    filters: {
        type: Object,
        required: true
    }
});

const loading = ref(true);
const error = ref(null);
const racesData = ref([]);

const fetchRaces = async () => {
    loading.value = true;
    error.value = null;
    try {
        console.log('-------------')
        const response = await axios.get('/api/next-races');
        if (response.data.status === 'success') {
            racesData.value = response.data.data.races;
        } else {
            console.error('Error fetching races:', response.data.message);
            racesData.value = [];
            error.value = response.data.message;
        }
    } catch (err) {
        console.error('Error fetching races data:', err);
        racesData.value = [];
        error.value = 'Failed to fetch race data.';
    } finally {
        loading.value = false;
    }
};




onMounted(() => {
    fetchRaces();
});

watch(() => props.filters, () => {
}, { deep: true });

const getRaceTypeIcon = (raceKey) => {
    return new URL(`/public/race-types/race-type-${raceKey}.svg`, import.meta.url).href;
};

const nextRace = computed(() => {
    if (error.value) {
        return null;
    }

    if (!racesData.value.length) return null;

    const filteredRaces = racesData.value.filter(race => props.filters[race.race_type]);

    if (!filteredRaces.length) return null;

    const convertPurse = (purse) => {
        if (purse.currency === 'GBP') {
            return purse.amount * EXCHANGE.GBPtoEURO;
        }
        return purse.amount;
    };

    return filteredRaces.reduce((prev, current) => {
        return convertPurse(current.purse) > convertPurse(prev.purse) ? current : prev;
    });
});



</script>

<template>
    <div class="max-w-xs bg-gray-800 text-white rounded-lg border p-4">

        <div v-if="loading" class="loading text-center">
            <p>Loading next race...</p>
        </div>
        <div v-else-if="error" class="error text-center ">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="nextRace" class="next-race-widget">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                    <div :class="`flag-${nextRace.event.country}`"></div>
                    <h3 class="text-lg font-bold">{{ nextRace.event.title }}</h3>
                </div>
                <span class="text-sm font-medium">{{ getRemainingTime(nextRace.post_time) }}</span>
            </div>

            <div class="flex justify-between items-center text-gray-300 text-sm mb-4">
                <p>{{ nextRace.num_runners }} runners</p>
                <p>{{ nextRace.distance }} m</p>
                <p>{{ getFormatedPurse(nextRace.purse) }}</p>
                <img :src="getRaceTypeIcon(nextRace.race_type)" :alt="`race-type-${nextRace.race_type}`" />

            </div>

            <ul class="space-y-3 p-4 bg-white">
                <li v-for="runner in nextRace.runners" :key="runner.id_runner"
                    class="flex justify-between items-center border-b last:border-none pb-3 last:pb-0">
                    <div class="flex items-center">
                        <img v-if="runner.silk" :src="`/silks/${runner.silk}`" :alt="`${runner.name} Silk`"
                            class="w-6 h-6 mr-3" />
                        <span class="text-gray-900">{{ runner.name }}</span>
                    </div>
                    <button class="bg-yellow-400 text-gray-900 font-bold py-1 px-3 min-w-16 rounded">{{ runner.odds
                        }}</button>
                </li>
            </ul>

            <a :href="`http://www.racebets.com/bet/${nextRace.id_race}`"
                class="block text-center bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600">
                Place Bet
            </a>
        </div>

        <div v-else class="no-race text-center text-red-500">
            <p>No races available for the selected filters.</p>
        </div>
    </div>
</template>


<style scoped>
.next-race-widget {
    border-radius: 8px;
}

.event h3 {
    margin: 0 0 10px 0;
}

.details p {
    margin: 5px 0;
}

.runners {
    list-style: none;
    padding: 0;
    margin: 10px 0;
}

.runners li {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.runners img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
}

.bet-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
}

.bet-button:hover {
    background-color: #0056b3;
}

.no-race,
.error,
.loading {
    padding: 20px;
    border-radius: 8px;
}

.loading {
    color: white;
}

@media (max-width: 600px) {
    .next-race-widget {
        padding: 10px;
    }

    .bet-button {
        width: 100%;
        text-align: center;
    }
}
</style>