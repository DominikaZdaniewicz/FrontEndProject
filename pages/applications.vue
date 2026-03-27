<template>
    <client-only>
        <div class="d-flex justify-end mb-6 mt-8">
            <v-btn 
                class="bg-surface-variant" 
                @click="openAddApplications">
                {{ $t("addApplication") }}
            </v-btn>
        </div>
        <add-edit-applications
            :model-application-value="formApplication"
            @save-application="handleSaveApplications"
            @cancel-application="formApplication = null"
        ></add-edit-applications>
        <div class=" mb-4">
            <search-bar :label="$t('search')" v-model="search" />
        </div>
        <v-data-table
            class="rounded-lg"
            :items="backendApplications"
            :search="search"
            :headers="headers">
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
                        @click="openEditApplication(item)"
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
                            :title="$t('delete')"
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
            <template #item.serverId="{ item }">
                <span>{{ getServerName(item.serverId)}}</span>
            </template>
        </v-data-table>
    </client-only>
</template>

<script setup>
import { useApplications } from '~/composable/useApplications';
import AddEditApplications from '~/components/AddEditApplications.vue';
import headersNames from '../assets/data/headers.json';
import { useServers } from '~/composable/useServers';
import { useTasks } from '~/composable/useTasks';
import { useOwners } from '~/composable/useOwners';

    const { getOwners } = await useOwners()
    const owners = await getOwners()
    const emit = defineEmits(['applications-updated'])

    const { backendServers, getServers } = useServers();
    await getServers();  
    const { backendApplications, getApplications, addApplication, removeApplications, updateApplications } = useApplications();
    await getApplications();
    const { backendTasks, getTasks } = useTasks();
    await getTasks()

    const { locale } = useI18n();
    
    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value] 
    }));
    
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('serverHeader'), key: "serverId" }, { title: ' ', key: "empty" }, ...displayedHeaders.slice(1)]);

    const search = ref('')

    const formApplication = ref(null)

    const dialog = ref(false)

    const applicationToDelete = ref(null)

    const openAddApplications = () => {
        formApplication.value = {
            Id: null,
            name: '',
            serverId: null,
            description: '',
            // DateOfCreation: '',
            // DateOfUpdate: '',
            ownerId: null,
            isActive: true
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"

        return new Date(dateString).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    const getServerName= (id) => {
        return backendServers.value.find(s => s.id === id)?.name || '-'
    }

    const openDeleteDialog = (id) => {
        applicationToDelete.value = id
        dialog.value = true
    }

    const confirmDelete = async () => {
        const deletedAppId = applicationToDelete.value
        await removeApplications(deletedAppId)
        backendTasks.value.forEach(task => {
            if (task.applicationId === deletedAppId) {
                task.application = "-"
                task.applicationId = null
            }
        })
        dialog.value = false
        applicationToDelete.value = null
    }

    const openEditApplication = (backendApplications) => {
        formApplication.value = { ...backendApplications }
    }

    const closeDialogApplications = () => {
        formApplication.value = null
    }

    const handleSaveApplications = async (application) => {
        if (application.id) {
            await updateApplications(application)

        } else {
            await addApplication(application)
            
        }
        await getApplications()
        emit('applications-updated')  
        closeDialogApplications()
    }

</script>

<style scoped>


</style>
