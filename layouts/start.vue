<template>
    <v-app>
        <v-app-bar>
            <LangSwitch class="mr-5 d-flex justify-end align-end lang-switch"/>
        </v-app-bar>
        <v-main class="d-flex flex-column justify-center align-center">     
            <img
                :width="100"
                :src="logo"
                contain
                class="h-auto align-self-center mb-4"
            ></img>
            <h1 class="mb-8 text-uppercase">{{ $t("title") }}</h1>
            <v-container
                class="d-flex flex-column justify-center align-center">
                    <v-btn 
                        class="w-25 mx-2 my-2"
                        :to="localPath('/servers')">
                        {{ $t("serversBtn") }}
                    </v-btn>
                    <v-btn 
                        class="w-25 mx-2 my-2"
                        :to="localPath('/applications')">
                        {{ $t("applicationsBtn") }}
                    </v-btn>
                    <v-btn 
                        class="w-25 mx-2 my-2"
                        :to="localPath('/tasks')">
                        {{ $t("tasksBtn") }}
                    </v-btn>
                <NuxtPage/>
            
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import logo from '~/assets/image/logo.png'

    const localPath = useLocalePath();

</script>

<style scoped>

    .lang-switch {
        position: absolute;
        right: 17%;
    }

</style>