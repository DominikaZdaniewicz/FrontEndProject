<template>    
    <div class="layout mt-12">
        <div class="sidebar mr-4">
            <div class="mb-4">{{$t('pdfPreviewText')}}</div>
            <v-btn
                class="mb-2 w-100"
                v-for="file in files"
                :key="file"
                @click="openPdf(file)"
                :class="{ active: selectedFile === file }">
                {{ file }}
            </v-btn>
        </div>

        <div class="content">
            <iframe
                v-if="pdfUrl"
                :src="pdfUrl"
                width="100%"
                height="500px"></iframe>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

    const files = [
        'example.pdf',
        'faktura.pdf',
        'raport.pdf'
    ]

    const pdfUrl = ref('')
    const selectedFile = ref(null)

    const openPdf = (fileName) => {
        pdfUrl.value = `/api/pdf/${fileName}`
        selectedFile.value = fileName
    }
</script>

<style scoped>
    .layout {
        display: flex;
        gap: 20px;
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        min-width: 200px;
        gap: 10px;
    }

    .sidebar button.active {
        background: #374151;
        color: white;
        font-weight: bold;
    }

    .content {
        flex: 1;
    }
</style>