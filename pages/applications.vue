<template>
    <client-only>
        <div class="d-flex justify-end mb-6 mt-8">
            <v-btn
                v-if="isAdmin"
                @click="openImportApplications">
                {{ $t('import') }}
            </v-btn>
            <v-btn
                class="ml-4"
                @click="openExportApplications">
                {{ $t('export') }}
            </v-btn>
            <v-btn 
                v-if="isAdmin"
                prepend-icon="mdi-plus"
                class="ml-8 bg-surface-variant w-25" 
                @click="openAddApplications">
                {{ $t("addApplication") }}
            </v-btn>
        </div>
        <v-dialog v-model="dialogImport" max-width="500">
            <v-card
                class = "px-2 py-4"
                :text="$t('importMsg')">
                <v-file-input
                    v-model="selectedFile"
                    accept=".xlsx,.xls"
                    label="Select Excel file"
                    clearable/>
                <template #actions>    
                    <v-spacer />
                    <v-btn
                        @click="dialogImport = false">
                        {{ $t('cancel') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        :disabled="!selectedFile"
                        @click="confirmImport">
                        {{ $t('import') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogExport" max-width="500">
            <v-card
                prepend-icon="mdi-export"
                :text="$t('exportMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialogExport = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmExportApplications">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <add-edit-applications
            :model-application-value="formApplication"
            @save-application="handleSaveApplications"
            @cancel-application="formApplication = null"/>
        <div class="mb-4 d-flex align-center">
            <v-btn 
                prepend-icon="mdi-filter-outline"
                class="py-7 mr-8 d-flex justify-end"
                @click="filterMenu = !filterMenu">
                {{ $t('filter') }}
            </v-btn>
            <div class="w-100">
                <search-bar
                    class="flex-grow-1"
                    :label="$t('search')" 
                    v-model="search" />
            </div>
        </div>
        <div v-if="!filterMenu" class="d-flex align-center justify-end mb-4 w-50">
            <v-select
                v-model="emptyFilter"
                hide-details
                class="mr-6"
                :items="[
                { value: 'all', title: $t('all') },
                { value: 'empty', title: $t('empty') },
                { value: 'notEmpty', title: $t('notEmpty') },]"/>
            <v-select
                v-model="activeFilter"
                hide-details
                :items="[
                { value: 'allActive', title: $t('all') },
                { value: 'active', title: $t('active') },
                { value: 'inactive', title: $t('inactive') },]"/>
        </div>
        <v-data-table-server
            class="rounded-lg"
            :items="applications"
            :items-length="totalItems"
            :items-per-page-options="itemsPerPageOptions"
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :headers="headers"
            v-model:sort-by="sortBy"
            multi-sort>
            <template #item.serverName="{ value }">
                {{ value || '-' }}
            </template>
            <template #item.dateOfCreation="{ value }">
                {{ formatDate(value) }}
            </template>
            <template #item.dateOfUpdate="{ value }">
                {{ formatDate(value) ?? '-' }}
            </template>
            <template #item.actions="{ item }">
                <div 
                    v-if="isAdmin"
                    class="d-flex justify-end">
                    <v-btn 
                        :title="$t('edit')"
                        icon="mdi-pencil"
                        @click="openEditApplication(item)"
                        class="mr-3"
                        :size="40"
                        variant="text"/>
                    <v-btn
                        icon="mdi-delete"
                        variant="text"
                        :size="40"
                        :disabled="!item.isEmpty"
                        :title="item.isEmpty ? $t('delete') : $t('applicationUsed')"
                        @click="openDeleteDialog(item.id)"/>
                </div>
            </template>
        </v-data-table-server>
        <v-dialog v-model="dialog" max-width="500">
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
import { useApplications } from '~/composable/useApplications';
import AddEditApplications from '~/components/AddEditApplications.vue';
import headersNames from '../assets/data/headers.json';

    const emit = defineEmits(['applications-updated'])

    const { addApplication, removeApplications, updateApplications, paginationApplication, getExportApplications, importApplications } = useApplications();
    const { data } = useAuth()

    const { locale } = useI18n();
    const page = ref(1)
    const itemsPerPage = ref(10);
    const totalItems = computed(() => paginationData.value?.numberOfApplications ?? 0)
    const itemsPerPageOptions = computed(() => [{ value: 10, title: 10 }, { value: 25, title: 25 }, { value: totalItems.value, title: $t('all') }]);
    const paginationData = ref(null);

    const resolvedPageSize = computed(() => itemsPerPage.value === 'all' ? totalItems.value || 10 : itemsPerPage.value);

    const applications = computed(() => paginationData.value?.productPerPage ?? [])
        
    
    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value],
        sortable: true
    }));
    
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('serverHeader'), key: "serverName", sortable: true }, ...displayedHeaders.slice(1)]);

    const search = ref('')
    
    const filterMenu = ref(true)

    const emptyFilter = ref('all')

    const activeFilter = ref('allActive')

    const sortBy = ref([])

    const formApplication = ref(null)

    const isAdmin = computed(() => {
        return data.value?.roles?.includes("administrator")
    })

    const dialog = ref(false)
    const dialogExport = ref(false)
    const dialogImport = ref(false)

    const applicationToDelete = ref(null)

    const selectedFile = ref(null)
    
    const confirmImport = async () => {
        if (!selectedFile.value) return

        try {
            await importApplications(selectedFile.value)
            await reloadPage()
            dialogImport.value = false
        } catch (e) {
            console.error('Import failed', e)
        } finally {
            selectedFile.value = null
        }
    }

    const openAddApplications = () => {
        formApplication.value = {
           id: null,
            name: '',
            description: '',
            serverName: '',
            serverId: null,
            userId: null,
            userName: '',
            isActive: true,
            isEmpty: true
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

    const reloadPage = async () => {
        paginationData.value = await paginationApplication
            (page.value, 
            resolvedPageSize.value, 
            search.value, 
            emptyFilter.value === 'empty', 
            emptyFilter.value === 'notEmpty', 
            activeFilter.value,
            sortBy.value,
        )}

    const openDeleteDialog = (id) => {
        applicationToDelete.value = id
        dialog.value = true
    }

    const openExportApplications = () => {
        dialogExport.value = true
    }

    const openImportApplications = () => {
        dialogImport.value = true
    }

    const confirmDelete = async () => {
        const deletedAppId = applicationToDelete.value
        await removeApplications(deletedAppId)
        dialog.value = false
        applicationToDelete.value = null
        await reloadPage()
    }    
    
    const confirmExportApplications = async () => {
        await getExportApplications()
        dialogExport.value = false
    }

    const openEditApplication = (applications) => {
        formApplication.value = { ...applications }
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
        await reloadPage()
        emit('applications-updated')  
        closeDialogApplications()
    }

    watch(
        [page, resolvedPageSize],
        async () => {
            await reloadPage()
        },
        { immediate: true }
    )

    watch(
        [search, emptyFilter, activeFilter, sortBy],
        async () => {
            page.value = 1
            await reloadPage()
        }
    )


</script>

<style scoped>


</style>
