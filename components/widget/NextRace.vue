<script setup>
import { ref, computed } from 'vue';
import { EXCHANGE } from "~/constants/exchangeRate";

const props = defineProps({
    filters: {
        type: Object,
        required: true
    }
});

const { data: responseData, pending: isLoading, error: fetchError } = useFetch('/api/next-races', {
    params: { ...props.filters },
});

const racesData = computed(() => {
    if (responseData.value && responseData.value.status === 'success') {
        return responseData.value.data.races;
    }
    return [];
});

const error = computed(() => {
    if (fetchError.value) {
        return fetchError.value.message || 'Failed to fetch race data.';
    }
    if (responseData.value && responseData.value.status !== 'success') {
        return responseData.value.message || 'Error fetching races.';
    }
    return null;
});

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

const getRaceTypeIcon = (raceKey) => {
    return `/race-types/race-type-${raceKey}.svg`;
};

const openInNewTab = (raceId) => {
    const url = `http://www.racebets.com/bet/${raceId}`;
    if (typeof window !== 'undefined') {
        window.open(url, '_blank');
    }
};
</script>

<template>
    <div class="max-w-md w-80 bg-gray-800 text-white rounded-md border p-2">

        <div v-if="isLoading" class="loading text-center">
            <p>Loading next race...</p>
        </div>

        <div v-else-if="error" class="error text-center ">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="nextRace" class="next-race-widget">
            <div class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                    <div :class="`flag-${nextRace.event.country}`" class="mr-2"></div>
                    <h3 class="text-lg font-bold">{{ nextRace.event.title }}</h3>
                </div>
                <span class="text-sm font-medium">{{ getRemainingTime(nextRace.post_time) }}</span>
            </div>

            <div class="flex justify-between items-center text-gray-300 text-sm mb-4 border-t border-[#666666] pt-2">
                <div class="flex">
                    <p class="border-r border-[#666666] pr-2 mr-2">{{ nextRace.num_runners }} runners</p>
                    <p class="border-r border-[#666666] pr-2 mr-2">{{ nextRace.distance }} m</p>
                    <p class="">{{ getFormatedPurse(nextRace.purse) }}</p>
                </div>
                <img loading="lazy" :src="getRaceTypeIcon(nextRace.race_type)" :alt="`type-${nextRace.race_type}`" />
            </div>

            <ul class="bg-white">
                <li v-for="runner in nextRace.runners" :key="runner.id_runner"
                    class="flex justify-between items-center border-b last:border-none py-2 px-2">
                    <div class="flex items-center">
                        <img v-if="runner.silk" :src="`/silks/${runner.silk}`" :alt="`${runner.name} Silk`"
                            class="w-6 h-6 mr-3" loading="lazy" />
                        <span class="text-gray-900">{{ runner.name }}</span>
                    </div>
                    <button @click="openInNewTab(nextRace.id_race)"
                        class="bg-yellow-400 text-gray-900 font-bold py-1 px-3 min-w-16 rounded">
                        {{ runner.odds }}
                    </button>
                </li>
            </ul>
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

</style>
