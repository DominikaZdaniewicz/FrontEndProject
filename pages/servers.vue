<template>
    <client-only>
        <div class="d-flex justify-end mb-4 mt-8">
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
        <view-server-info
            :model-server-value="infoServer"
            @close-server="infoServer = null"
        />
        <div class=" mb-4">
            <search-bar :label="$t('search')" v-model="search" />
        </div> 
        <v-data-table
            class="rounded-lg"
            :headers="headers"
            :items="backendServers"
            :search="search"
            :items-per-page-options="itemsPerPageOptions"
            :items-per-page="itemsPerPage"
            :page="page">    
            <template #item.name="{ item }">
                <span   
                    @click="openInfoServer(item)" 
                    class="serverName">
                    {{ item.name }}
                </span>    
            </template>    
            <template #item.description="{ item }">
                {{ item.description ? item.description.slice(0, 50) + (item.description.length > 50 ? '...' : '') : '' }}
            </template>
            <template #item.dateOfCreation="{ item }">
                {{ formatDate(item.dateOfCreation) }}
            </template>
            <template #item.dateOfUpdate="{ item }">
                {{ formatDate(item.dateOfUpdate) }}
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
                    <v-dialog
                        v-model="dialog"
                        max-width="500">
                        <template #activator="{ props }">
                            <v-btn
                            v-bind="props"
                            icon="mdi-delete"
                            variant="text"
                            :size="40"
                            :disabled="isServerUsed(item.id)"
                            :title="isServerUsed(item.id) ? $t('serverUsed') : $t('delete')"
                            @click="openDeleteDialog(item.id)"
                            />
                        </template>
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
                </div>
            </template>
        </v-data-table>
    </client-only>
</template>

<script setup>
import { useServers } from '~/composable/useServers';
import AddEditServer from '~/components/AddEditServer.vue';
import headersNames from '../assets/data/headers.json';
import { useOwners } from '~/composable/useOwners';
import { useApplications } from '~/composable/useApplications';
import { useTasks } from '~/composable/useTasks';

    const { getOwners } = await useOwners()
    const owners = await getOwners()
    const { backendApplications, getApplications } = useApplications()
    await getApplications()
    const { backendTasks, getTasks } =  useTasks()
    await getTasks()
    const { backendServers, getServers, addServer, removeServer, updateServer, getServersSummary } =  useServers();    
    const serversSummary = await getServersSummary()
    await getServers();  

    const { locale } = useI18n();
    
    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value] 
    }));
   
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('description'), key: "description" }, { title: ' ', key: "empty" }, ...displayedHeaders.slice(1)]);

    const search = ref('')

    const dialog = ref(false)

    const formServer = ref(null)

    const infoServer = ref(null)
    const serverToDelete = ref(null)

    const openAddServer = () => {
        formServer.value = reactive({
            Id: null,
            Name: '',
            Description: '',
            // dateOfCreation: '',
            // dateOfUpdate: '',
            OwnerId: null,
            IsActive: true
        })
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"

        return new Date(dateString).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    const { data: paggination } = await useFetch('/api/Server/paggination')

    const page = ref(1);

    const itemsPerPage = computed(() => paggination.value?.itemsPerPage ?? 10);
    const itemsPerPageOptions = computed(() => paggination.value?.itemsPerPageOptions ?? [5, 10, 20, 50]);


    const localServerId = formServer.value?.id;

    const isServerUsed = (localServerId) => {
        if (!localServerId) return false
        const usedInApplications = backendApplications.value?.some(app => app.serverId === localServerId) ?? false
        const usedInTasks = backendTasks.value?.some(task => task.serverId === localServerId) ?? false

        return usedInApplications || usedInTasks;
    }

    const openDeleteDialog = (localServerId) => {
        serverToDelete.value = localServerId;
        dialog.value = true
    }

    const confirmDelete = async () => {
        if (!serverToDelete.value) return

        const serverObj = backendServers.value.find(s => s.id === serverToDelete.value)
        if (!serverObj) return

        await removeServer(serverToDelete.value)
        dialog.value = false
        serverToDelete.value = null
    }

    const openEditServer = (backendServers) => {
        formServer.value = { ...backendServers }
    }

    const openInfoServer = (backendServers) => {
        infoServer.value = { ...backendServers }
    }

    const closeDialogServer = () => {
        formServer.value = null;
    }

    const handleSaveServer = async (server) => {
        
        if (server.id) {
            await updateServer(server)    
        } else {
            await addServer(server)      
        }
        closeDialogServer()
    }

</script>

<style scoped>
    .serverName:hover {
    text-decoration: underline;
    cursor: pointer;
    }

</style>