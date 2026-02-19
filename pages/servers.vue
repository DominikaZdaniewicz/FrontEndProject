<template>
    <client-only>
        <div class="d-flex justify-end mb-6 mt-8">
            <v-btn 
                class="bg-surface-variant" 
                @click="openAddServer">
                {{ $t("addServer") }}
            </v-btn>
        </div>
        <add-edit-server
            :model-server-value="formServer"
            @save-server="handleSaveServer"
            @cancel-server="formServer = null"
        />
        <div class=" mb-4">
            <search-bar :label="$t('search')" v-model="search" />
        </div>        
        <v-data-table
            class="rounded-lg"
            :headers="headers"
            :items="servers"
            :search="search">
            <template #item.actions="{ item }">
                <div class="d-flex justify-end">
                    <v-btn 
                        :title="$t('edit')"
                        icon="mdi-pencil"
                        @click="openEditServer(item)"
                        class="mr-3"
                        :size="40"
                        variant="text"/>
                    <v-btn 
                        :title="$t('delete')"
                        icon="mdi-delete" 
                        @click="removeServer(item.id)"
                        :size="40"
                        variant="text"/>
                </div>
            </template>
        </v-data-table>
    </client-only>
</template>

<script setup>
import { useServers } from '~/composable/useServers';
import AddEditServer from '~/components/AddEditServer.vue';
import headersNames from '../assets/data/headers.json';

    const { servers, addServer, removeServer, updateServer } = useServers();

    const { locale } = useI18n();
    
    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value] 
    }));
    
    const headers = ref([...displayedHeaders.slice(0, 1), { title: ' ', key: "empty" }, ...displayedHeaders.slice(1)]);

    const search = ref('')

    const formServer = ref(null)

    const openAddServer = () => {
        formServer.value = {
            id: null,
            name: '',
            createdAt: '',
            updatedAt: ''
        }
    }

    const openEditServer = (server) => {
        formServer.value = { ...server }
    }

    const closeDialogServer = () => {
        formServer.value = null
    }

    const handleSaveServer = (server) => {
        
    if (server.id) {
        updateServer(server)    
    } else {
        addServer(server)        
    }

    closeDialogServer()
    }
</script>

<style scoped>

</style>