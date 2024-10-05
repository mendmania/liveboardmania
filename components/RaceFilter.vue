<template>
    <div class="race-filter">
        <h2>Race Type Filter</h2>
        <div class="flex">
            <label v-for="(label, key) in raceTypes" :key="key" class="mr-3 cursor-pointer">
                <input type="checkbox" :value="key" v-model="selectedFilters" @change="updateFilters" />
                {{ label }}
            </label>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const raceTypes = {
    G: 'Gallop',
    J: 'Jumping',
    T: 'Trot',
    D: 'Dogs'
};

const selectedFilters = ref(['G', 'J', 'T']);
const emit = defineEmits(['update-filters']);

const updateFilters = () => {
    const filters = Object.keys(raceTypes).reduce((acc, key) => {
        acc[key] = selectedFilters.value.includes(key);
        return acc;
    }, {});
    emit('update-filters', filters);
};
</script>

<style scoped>
.race-filter {
    padding: 16px;
    margin-bottom: 20px;
}

.race-filter h2 {
    margin-bottom: 10px;
}

.race-filter label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
}

.race-filter input {
    margin-right: 8px;
}
</style>