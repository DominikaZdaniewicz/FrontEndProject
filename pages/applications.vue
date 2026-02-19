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
            :model-application-value="formApplications"
            @save-application="handleSaveApplications"
            @cancel-application="formApplications = null"
        ></add-edit-applications>
        <div class=" mb-4">
            <search-bar :label="$t('search')" v-model="search" />
        </div>
        <v-data-table
            class="rounded-lg"
            :items="applications"
            :search="search"
            :headers="headers">
            <template #item.actions="{ item }">
                <div class="d-flex justify-end">
                    <v-btn 
                        :title="$t('edit')"
                        icon="mdi-pencil"
                        @click="openEditApplications(item)"
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
            <template #item.serverName="{ item }">
                <span>{{ (servers.value || []).find(s => s.id === item.serverId)?.name || '—' }}</span>
            </template>
        </v-data-table>
    </client-only>
</template>

<script setup>
import { useApplications } from '~/composable/useApplications';
import AddEditApplications from '~/components/AddEditApplications.vue';
import headersNames from '../assets/data/headers.json';
import { useServers } from '~/composable/useServers';

    const { servers } = useServers();

    const { locale } = useI18n();
    
    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value] 
    }));
    
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('serverHeader'), key: "serverName" }, { title: ' ', key: "empty" }, ...displayedHeaders.slice(1)]);

    const { applications, addApplications, removeApplications, updateApplications } = useApplications();

    const search = ref('')

    const formApplications = ref(null)

    const dialog = ref(false)

    const applicationToDelete = ref(null)

    const openAddApplications = () => {
        formApplications.value = {
            id: null,
            name: '',
            description: '',
            serverId: null,
            createdAt: '',
            updatedAt: '',
            owner: '',
            isActive: true
        }
    }

    const openDeleteDialog = (id) => {
        applicationToDelete.value = id
        dialog.value = true
    }

    const confirmDelete = () => {
        removeApplications(applicationToDelete.value)
        dialog.value = false
        applicationToDelete.value = null
    }

    const openEditApplications = (applications) => {
        formApplications.value = { ...applications }
    }

    const closeDialogApplications = () => {
        formApplications.value = null
    }

    const handleSaveApplications = (applications) => {
        
    if (applications.id) {
        updateApplications(applications)    
    } else {
        addApplications(applications)        
    }

    closeDialogApplications()
    }

</script>

<style scoped>


</style>
