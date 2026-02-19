<template>
    <v-text-field
        v-model="search"
        :tlabelitle="$t('search')"
        prepend-inner-icon="mdi-magnify"
        rounded="lg"
        hide-details
        single-line
        variant="solo"
    ></v-text-field>
</template>

<script setup>

    const search = defineModel()
    
</script>

<style scoped>

</style>