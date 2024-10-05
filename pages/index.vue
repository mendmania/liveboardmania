<script setup>
import { ref } from 'vue';

const activeFilters = ref({ G: true, J: true, T: true, D: false });

const setFilters = (newFilters) => {
    activeFilters.value = newFilters;
};
</script>

<template>
    <RaceFilter @update-filters="setFilters" />
    <WidgetNextRace :filters="activeFilters" />
</template>