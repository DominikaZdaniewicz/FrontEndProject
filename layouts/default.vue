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
    <v-main>
        <v-container
            class="w-66 my-2">
                <v-tabs>
                    <v-tab :to="localPath('/servers')">{{ $t("serversBtn") }}</v-tab>
                    <v-tab :to="localPath('/applications')">{{ $t("applicationsBtn") }}</v-tab>
                    <v-tab :to="localPath('/tasks')">{{ $t("tasksBtn") }}</v-tab>
                </v-tabs>
                <v-spacer />
            <NuxtPage/>
        </v-container>
    </v-main>
</template>

<script setup>

    const localPath = useLocalePath();

</script>

<style>

    .v-data-table-header__content {
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
    }

    .lang-switch {
        position: absolute;
        right: 18%;
    }

</style>