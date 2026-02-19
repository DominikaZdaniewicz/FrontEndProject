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
            <template #item.description="{ item }">
                {{ item.raw?.description ? item.raw.description.slice(0, 50) + (item.raw.description.length > 50 ? '...' : '') : '' }}
            </template>
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
                        icon="mdi-delete"
                        variant="text"
                        :size="40"
                        :disabled="isServerUsed(item.id)"
                        :title="isServerUsed(item.id) ? $t('serverUsed') : $t('delete')"
                        @click="openDeleteDialog(item.id)"/>
                </div>
            </template>
        </v-data-table>
        <v-dialog
            v-model="dialog"
            max-width="500">
            <v-card
                prepend-icon="mdi-alert"
                :text="$t('deleteMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialog = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmDelete">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
    </client-only>
</template>

<script setup>
import { useServers } from '~/composable/useServers';
import AddEditServer from '~/components/AddEditServer.vue';
import headersNames from '../assets/data/headers.json';
import serversData from '~/assets/data/servers.json';

    const applications = ref([])

    const { servers, addServer, removeServer, updateServer } = useServers();

    const { locale } = useI18n();
    
    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value] 
    }));
    
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('description'), key: "description" }, { title: ' ', key: "empty" }, ...displayedHeaders.slice(1)]);

    const search = ref('')

    const dialog = ref(false)

    const formServer = ref(null)

    const serverToDelete = ref(null)

    const openAddServer = () => {
        formServer.value = {
            id: null,
            name: '',
            description: '',
            createdAt: '',
            updatedAt: '',
            owner: '',
            isActive: true
        }
    }

    const isServerUsed = (serverId) => {
        if (!serverId) return false
        return applications.value?.some(app => Number(app.serverId) === Number(serverId)) ?? false
    }


    const openDeleteDialog = (serverId) => {
        serverToDelete.value = serverId
        dialog.value = true
    }

    const confirmDelete = () => {
        if (!serverToDelete.value) return

        const serverObj = servers.value.find(s => s.id === serverToDelete.value)
        if (!serverObj) return

        if (isServerUsed(serverObj.id)) {
            alert($t('serverUsed'))
            dialog.value = false
            serverToDelete.value = null
            return
        }

        removeServer(serverToDelete.value)
        dialog.value = false
        serverToDelete.value = null
    }

    const openEditServer = (server) => {
        const matchedServer = servers.value.find(s => s.name === server.server)
        formServer.value = { 
            ...server,
            serverId: server.serverId ?? matchedServer?.id ?? null
        }
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

    watchEffect(() => {
        if (!process.client) return;

        const savedServers = JSON.parse(localStorage.getItem('servers') || 'null');
        servers.value = savedServers ?? serversData;
    });

    watchEffect(() => {
        if (!process.client) return

        const rawApps = JSON.parse(localStorage.getItem('applications') || '[]');

        applications.value = rawApps.map(app => ({
            ...app,
            serverId: app.serverId ?? servers.value.find(s => s.name === app.server)?.id ?? null
        }));
    })

</script>

<style scoped>

</style>