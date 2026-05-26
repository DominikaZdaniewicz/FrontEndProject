<template>
    <v-app-bar class="d-flex align-center">
        <v-app-bar-title>
            <router-link 
                :to="localPath('/')" 
                class="text-decoration-none text-white">
                {{ $t("title") }}
            </router-link> 
        </v-app-bar-title>
        <LangSwitch class="d-flex justify-end align-center lang-switch"/>
    </v-app-bar>
    <v-main
        class="d-flex flex-column justify-center align-center">
        <NuxtPage/>
    </v-main>
</template>

<script setup>

    const localPath = useLocalePath();

</script>

<style>

    /* .v-data-table-header__content {
        font-weight: 600;
        color: #ffffff;
        letter-spacing: 1px;   
    }

    .v-data-table__th {
        border-bottom: 1px solid rgb(255, 255, 255) !important;
    }

    .v-data-table__td {
        width: 20%;
    }

    .v-toolbar {
        position: relative;
    }

    .v-toolbar-title {
        position: absolute;
        left: 17%;
    } */

    .lang-switch {
        position: absolute;
        right: 18%;
    }

</style>