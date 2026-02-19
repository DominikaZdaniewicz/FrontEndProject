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
                    <v-btn 
                        :title="$t('delete')"
                        icon="mdi-delete" 
                        @click="removeApplications(item.id)"
                        :size="40"
                        variant="text">
                    </v-btn>
                </div>
            </template>
            <template #item.server="{ item }">
                <span>{{ item.server || '—' }}</span>
            </template>
        </v-data-table>
    </client-only>
</template>

<script setup>
import { useApplications } from '~/composable/useApplications';
import AddEditApplications from '~/components/AddEditApplications.vue';
import headersNames from '../assets/data/headers.json';

    const { locale } = useI18n();
    
    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value] 
    }));
    
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('serverHeader'), key: "server" }, ...displayedHeaders.slice(1)]);

    const { applications, addApplications, removeApplications, updateApplications } = useApplications();

    const search = ref('')

    const formApplications = ref(null)

    const openAddApplications = () => {
        formApplications.value = {
            id: null,
            name: '',
            server: null,
            createdAt: '',
            updatedAt: ''
        }
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
