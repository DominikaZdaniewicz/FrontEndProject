<template>
    <v-app>
        <v-app-bar>
            <LangSwitch class="mr-5 d-flex justify-end align-end lang-switch"/>
        </v-app-bar>
        <v-main class="d-flex flex-column justify-center align-center">     
            <NuxtPage/>
        </v-main>
    </v-app>
</template>

<script setup>
</script>

<style scoped>

    .lang-switch {
        position: absolute;
        right: 17%;
    }

</style>