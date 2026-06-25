<template>
    <v-app>
        <v-app-bar>
            <LangSwitch class="mr-5 d-flex justify-end align-end lang-switch"/>
        </v-app-bar>
        <v-main class="d-flex flex-column justify-center align-center">     
            <router-link 
                :to="localPath('/')" 
                class="text-decoration-none text-white">
                <h1 class="mb-4 text-uppercase">{{ $t("title") }}</h1>
            </router-link> 
            <NuxtPage/>
        </v-main>
    </v-app>
</template>

<script setup>
    const localPath = useLocalePath();

</script>

<style scoped>

    .lang-switch {
        position: absolute;
        right: 17%;
    }

</style>