<template>
    <v-card class="d-flex flex-column justify-center align-start w-50 h-50 pa-16">
        <h1>{{ $t("unauthorized") }}</h1>
        <p class="mt-4">{{ $t("unauthorizedMsg") }}</p>
        <v-btn 
            class="mt-12 bg-surface-variant btn"
            :to="localPath('/auth/login')">
            {{ $t("goToLogin") }}
        </v-btn>    
    </v-card>
</template>

<script setup>

    const localPath = useLocalePath();

    definePageMeta({
        layout: 'empty'
    })
</script>