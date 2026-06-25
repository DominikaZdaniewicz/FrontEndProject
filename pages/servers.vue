<template>
    <client-only>
        <div class="d-flex justify-end mb-6 mt-8">
            <v-btn 
                v-if="isAdmin"
                prepend-icon="mdi-plus"
                class="ml-8 bg-surface-variant w-25" 
                @click="openAddServer">
                {{ $t("addServer") }}
            </v-btn>
        </div>
        <!-- <v-dialog v-model="dialogImport" max-width="500">
            <v-card class="px-4 py-4" :text="$t('importMsg')">
                <div
                    id="my-dropzone" 
                    class="dropzone border border-dashed rounded-lg pa-6 text-center d-flex flex-column align-center justify-center">
                    <v-icon size="40" class="mt-6">
                        mdi-cloud-upload
                    </v-icon>
                </div>
                <template #actions>
                    <v-spacer />
                    <v-btn @click="dialogImport = false">
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
        </v-dialog> -->
        <v-dialog v-model="dialogExport" max-width="500">
            <v-card
                prepend-icon="mdi-export"
                class = "px-4 py-4"
                :text="$t('exportMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialogExport = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmExportServers">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogPDFExport" max-width="500">
            <v-card
                prepend-icon="mdi-export"
                class = "px-4 py-4"
                :text="$t('exportPdfMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialogPDFExport = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmPDFExportServers">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <add-edit-server
            :model-server-value="formServer"
            @save-server="handleSaveServer"
            @cancel-server="formServer = null"/>
        <view-server-info
            :model-server-value="infoServer"
            @close-server="infoServer = null"/>
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
        <div
            v-if="isAdmin"
            class="my-6 d-flex justify-end align-center">
            <!-- <div
                class="d-flex align-center ml-4">
                {{$t('importFrom')}}
            </div> -->
            <div>
                <v-btn
                    class="ml-4"
                    @click="openImportServers">
                    {{ $t('exportExcel') }}
                </v-btn>
            </div>
            <div
                class="d-flex align-center ml-4">
                {{$t('exportTo')}}
            </div>
            <div>
                <v-btn
                    class="ml-4"
                    @click="openExportServers">
                    {{ $t('exportExcel') }}
                </v-btn>
                <v-btn
                    class="ml-4"
                    @click="openExportServersPDF">
                    {{ $t('exportPDF') }}
                </v-btn>
            </div>
        </div>
        <v-data-table-server
            class="rounded-lg"
            :headers="headers"
            :items="servers"
            :items-length="totalItems"
            :items-per-page-options="itemsPerPageOptions"
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            v-model:sort-by="sortBy"
            multi-sort>
            <template #item.name ="{ item }">
                <span 
                    @click="openInfoServer(item)" 
                    class="serverName">
                    {{ item.name }}
                </span>
            </template>
            <template #item.description="{ item }">
                {{ item?.description ? item.description.slice(0, 50) + (item.description.length > 50 ? '...' : '') : '' }}
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
                        @click="openEditServer(item)"
                        class="mr-3"
                        :size="40"
                        variant="text"/>
                    <v-btn
                        icon="mdi-delete"
                        variant="text"
                        :size="40"
                        :disabled="!item.isEmpty"
                        :title="item.isEmpty ? $t('delete') : $t('serverUsed')"
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
import { useServers } from '~/composable/useServers';
import AddEditServer from '~/components/AddEditServer.vue';
import headersNames from '../assets/data/headers.json';
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

    const { locale } = useI18n();
    
    const { addServer, removeServer, updateServer, paginationServer, exportXlsx, exportPdf } =  useServers();    
    const { data } = useAuth()
    const page = ref(1)
    const itemsPerPage = ref(10);
    const totalItems = computed(() => paginationData.value?.numberOfServers ?? 0)
    const itemsPerPageOptions = computed(() => [{ value: 10, title: 10 }, { value: 25, title: 25 }, { value: totalItems.value, title: $t('all') }]);
    const paginationData = ref(null);

    const resolvedPageSize = computed(() => itemsPerPage.value === 'all' ? totalItems.value || 10 : itemsPerPage.value);

    const servers = computed(() => paginationData.value?.productPerPage ?? [])

    const isAdmin = computed(() => {
        return data.value?.roles?.includes("administrator")
    })

    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value],
        sortable: true
    }));
   
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('description'), key: "description", sortable: true}, ...displayedHeaders.slice(1)]);

    const search = ref('')

    const filterMenu = ref(true)

    const emptyFilter = ref('all')

    const activeFilter = ref('allActive')

    const sortBy = ref([])

    const dialog = ref(false)

    const dialogExport = ref(false)

    const dialogPDFExport = ref(false)

    // const dialogImport = ref(false)

    const formServer = ref(null)

    const infoServer = ref(null)

    const serverToDelete = ref(null)
    
    const selectedFile = ref(null)
    
    // const confirmImport = async () => {
    //     if (!selectedFile.value) return;

    //     dz.processQueue();
    // };

    const openAddServer = () => {
        formServer.value = reactive({
            id: null,
            name: '',
            description: '',
            userId: null,
            userName: '',
            isActive: true,
        })
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"

        return new Date(dateString).toLocaleString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const reloadPage = async () => {
        paginationData.value = await paginationServer(
            page.value, 
            resolvedPageSize.value, 
            search.value, 
            emptyFilter.value === 'empty', 
            emptyFilter.value === 'notEmpty', 
            activeFilter.value,
            sortBy.value,
        )}

    const openDeleteDialog = (localServerId) => {
        serverToDelete.value = localServerId;
        dialog.value = true
    }

    const openExportServers = () => {
        dialogExport.value = true
    }

    const openExportServersPDF = () => {
        dialogPDFExport.value = true
    }

    // const openImportServers = () => {
    //     dialogImport.value = true
    // }

    const confirmDelete = async () => {
        if (!serverToDelete.value) return

        await removeServer(serverToDelete.value);
        await reloadPage();
        dialog.value = false
        serverToDelete.value = null
        await reloadPage()
    }

    const confirmPDFExportServers = async () => {
        await exportPdf()
        dialogPDFExport.value = false
    }

    const confirmExportServers = async () => {
        await exportXlsx()
        dialogExport.value = false
    }

    const openEditServer = (servers) => {
        formServer.value = { ...servers }
    }
    
    const openInfoServer = (servers) => {
        infoServer.value = { ...servers }
    }

    const handleSaveServer = async (server) => {
        
        if (server.id) {
            await updateServer(server)    
        } else {
            await addServer(server)      
        }
            await reloadPage();
            formServer.value = null;
    }

    // Dropzone.autoDiscover = false;

    // let dz = null;

    // watch(dialogImport, async (isOpen) => {
    //     if (isOpen) {
    //         await nextTick();

    //         if (dz) {
    //             dz.destroy();
    //         }

    //         dz = new Dropzone("#my-dropzone", {
    //             url: "/api/Server/import",
    //             paramName: "file",      
    //             acceptedFiles: ".xlsx,.xls",
    //             maxFiles: 1,
    //             dictDefaultMessage: $t('selectExcelFile'),   
    //             autoProcessQueue: false,
    //             // headers: {
    //             //         Authorization: `Bearer ${useAuth().data.value?.token}`
    //             //     }
    //         });
                
    //         dz.on("addedfile", (file) => {
    //             selectedFile.value = file;
    //         });
            
    //         dz.on("success", async () => {
    //             await reloadPage();
    //             dialogImport.value = false;
    //             dz.removeAllFiles();
    //         });

    //         dz.on("removedfile", () => {
    //             selectedFile.value = null;
    //         });
    //     }
    // });

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
    .serverName:hover {
    text-decoration: underline;
    cursor: pointer;
    }

</style>