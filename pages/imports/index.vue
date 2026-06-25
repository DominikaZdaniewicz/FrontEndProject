<template>
    <client-only>
        <div class="d-flex justify-end mb-6 mt-8">
            <v-btn 
                prepend-icon="mdi-upload"
                class="ml-8 bg-surface-variant w-25" 
                @click="fileDialog = true">
                {{ $t("addFile") }}
            </v-btn>
        </div>
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
        <!-- :items-length="totalItems"
            :items-per-page-options="itemsPerPageOptions"
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            v-model:sort-by="sortBy"
            multi-sort-->
        <v-data-table-server
          :headers="headers"
          :items-length="totalItems"
          :items="imports"
          :loading="loading"
          :options="options"
          @update:options="loadList"
        >
            <template v-slot:[`item.id`]="{ item }">
                <div class="d-flex justify-center">
                <v-btn
                    icon
                    @click="downloadFile(item)"
                    class="ma-0 pa-0"
                    elevation="0"
                    variant="text"
                >
                    <v-icon color="primary">mdi-file-download-outline</v-icon>
                </v-btn>
                </div>
            </template>

            <template v-slot:[`item.createdAt`]="{ item }">
                <div class="createdAt cell">
                    {{ formatDate(item.createdAt) }}
                </div>
            </template>

            <template v-slot:[`item.outcome`]="{ item }">
                 <div v-if="item.type === 'Pdf'">
                    <v-icon color="success">mdi-check-circle-outline</v-icon>
                </div> 
                <div class="pa-0 ma-0">
                    <import-stages-status :item="item"></import-stages-status>
                </div>
            </template>
            <template v-slot:[`item.preview`]="{ item }">
                 <div v-if="item.type === 'Pdf'">
                    <v-icon color="success">mdi-check-circle-outline</v-icon>
                </div> 
                <div class="pa-0 ma-0">
                    <v-btn icon :to="`/imports/${item.id}`">
                        <v-icon color="primary">mdi-database-outline</v-icon>
                    </v-btn>
                </div>
            </template>
            
            <template v-slot:[`item.type`]="{ item }">
                <div class="cell">
                    {{ item.importFileType }}
                </div>
            </template>

            <template v-slot:[`item.processingStartedAt`]="{ item }">
                    <!-- <div v-if="item.type === 'Pdf'">
                        {{ $f.asDateTime(item.createdAt) }}
                    </div>  -->
                    <div class="pa-0 ma-0 processingStartedAt cell">
                        S: {{ formatDate(item.processingStartedAt) }}
                        <br />
                        K: {{ formatDate(item.processingEndedAt) }}
                    </div>
            </template>

             <template v-slot:[`item.errors`]="{ item }">
                 <div v-if="item.type === 'Pdf'">
                    <v-icon color="success">mdi-check-circle-outline</v-icon>
                </div> 
                <div class="pa-0 ma-0 cell-min">
                    <v-btn icon tile small>
                        <v-icon
                          v-if="
                            item.processingEndedAt &&
                            (item.errors == null || item.errors.length === 0)
                          "
                          color="success"
                          >mdi-check-circle-outline
                        </v-icon>
                        <v-icon
                          v-if="
                            item.processingEndedAt &&
                            item.errors &&
                            item.errors.length > 0
                          "
                          color="error"
                          :title="item.errors"
                          >mdi-alert-circle-outline
                        </v-icon>
                    </v-btn>
                </div>
            </template>

            <template v-slot:[`item.preview`]="{ item }">
                <v-btn
                v-if="item.type !== 'Pdf'"
                icon
                :to="`/imports/${item.id}`"
                class="ma-0 pa-0"
                elevation="0"
                variant="text"
                >
                <v-icon color="primary">mdi-database-outline</v-icon>
                </v-btn>
            </template>

            <template v-slot:[`item.btns`]="{ item }">
                 <!-- <v-btn
                  :loading="item.loading"
                  color="primary"
                  x-small
                  @click.stop="rawImport(item)">
                  Import
                </v-btn>  -->
                <div class="pa-0 ma-0">
                  <v-btn
                    :loading="item.loading"
                    x-small
                    @click.stop="handleRestartImport(item)"> 
                    <div
                        class="text-primary">
                        {{ $t('reimport') }} 
                    </div>
                  </v-btn> 
                </div>
            </template>
<!-- 
            <template v-slot:[`item.btns`]="{ item }">
                <v-btn
                :loading="item.loading"
                color="primary"
                x-small
                @click.stop="handleRestartImport(item)">
                {{ t("reimport") }}
                </v-btn>
            </template> -->
        </v-data-table-server>
        <!-- <v-data-table-server
            class="rounded-lg "
            :items="imports"
            :loading="loading"
            :headers="headers">
            <template v-slot:[`item.id`]="{ item }">
                <div class="d-flex justify-center">
                    <v-btn icon @click="downloadFile(item)">
                        <v-icon color="primary"> mdi-file-download-outline </v-icon>
                    </v-btn>
                </div>
            </template>
            <template v-slot:[`item.filename`]="{ item }">
                <div class="filename cell">
                    {{ item.filename }}
                </div>
            </template>
             <template v-slot:[`item.isArchived`]="{ item }">
                <div class="d-flex justify-center">
                    <v-btn v-if="!item.isArchived" icon @click="archiveFile(item)">
                        <v-icon color="primary"> mdi-archive-outline </v-icon>
                    </v-btn>
                    <v-btn v-if="item.isArchived" icon @click="unArchiveFile(item)">
                        <v-icon color="primary"> mdi-archive-off-outline </v-icon>
                    </v-btn>
                </div>
            </template> 
            <template v-slot:[`item.createdAt`]="{ item }">
                <div class="createdAt cell">
                    {{ formatDate(item.createdAt) }}
                </div>
            </template>
            <template v-slot:[`item.processingStartedAt`]="{ item }">
                 <div v-if="item.type === 'Pdf'">
                    {{ $f.asDateTime(item.createdAt) }}
                </div> 
                <div class="pa-0 ma-0 processingStartedAt cell">
                    S: {{ formatDate(item.processingStartedAt) }}
                    <br />
                    K: {{ formatDate(item.processingEndedAt) }}
                </div>
            </template>
            <template v-slot:[`item.errors`]="{ item }">
                 <div v-if="item.type === 'Pdf'">
                    <v-icon color="success">mdi-check-circle-outline</v-icon>
                </div> 
                <div class="pa-0 ma-0 cell-min">
                    <v-btn icon tile small>
                        <v-icon
                          v-if="
                            item.processingEndedAt &&
                            (item.errors == null || item.errors.length === 0)
                          "
                          color="success"
                          >mdi-check-circle-outline
                        </v-icon>
                        <v-icon
                          v-if="
                            item.processingEndedAt &&
                            item.errors &&
                            item.errors.length > 0
                          "
                          color="error"
                          :title="item.errors"
                          >mdi-alert-circle-outline
                        </v-icon>
                    </v-btn>
                </div>
            </template>
            <template v-slot:[`item.outcome`]="{ item }">
                 <div v-if="item.type === 'Pdf'">
                    <v-icon color="success">mdi-check-circle-outline</v-icon>
                </div> 
                <div class="pa-0 ma-0">
                    <import-stages-status :item="item"></import-stages-status>
                </div>
            </template>
            <template v-slot:[`item.preview`]="{ item }">
                 <div v-if="item.type === 'Pdf'">
                    <v-icon color="success">mdi-check-circle-outline</v-icon>
                </div> 
                <div class="pa-0 ma-0">
                    <v-btn icon :to="`/imports/${item.id}`">
                        <v-icon color="primary">mdi-database-outline</v-icon>
                    </v-btn>
                </div>
            </template>
             <template v-slot:[`item.Type`]="{ item }">
                {{ typeLabels?.[item.importFileType] ?? item.importFileType }}
                 {{ console.log(item) }} 
                  {{item.importFileType}}
            </template> 
            <template v-slot:[`item.btns`]="{ item }">
                 <v-btn
                  :loading="item.loading"
                  color="primary"
                  x-small
                  @click.stop="rawImport(item)">
                  Import
                </v-btn> 
                <div class="pa-0 ma-0">
                  <v-btn
                    :loading="item.loading"
                    x-small
                    @click.stop="handleRestartImport(item)"> 
                    <div
                        class="text-primary">
                        {{ $t('reimport') }} 
                    </div>
                  </v-btn> 
                </div>
            </template>
        </v-data-table-server> -->
        <v-dialog v-model="fileDialog" width="800">
            <import-attachment 
            @saved="saveAttachment">
        </import-attachment>
        </v-dialog>
    </client-only>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ImportStagesStatus from '@/components/ImportStagesStatus.vue'
import { useImport } from '~/composable/useImport'
import { useNuxtApp } from '#app';
import { useToast } from 'vue-toastification'

    // definePageMeta({
    // auth: {
    //     roles: ['Administrator'],
    //     unauthenticatedOnly: false,
    // },
    // })

    const { t } = useI18n()
    const toast = useToast()

    const { getList, restartImport } = useImport()
    
    const search = ref('')
    const fileDialog = ref(false)
    const imports = ref([])
    const totalItems = ref(0);
    const loading = ref(false)

    const filter = ref({
        phrase: '',
        type: null,
        createdAt: null,
    })

    const loadList = ({ page, itemsPerPage, sortBy, sortDesc }) => {
        options.value.page = page;
        options.value.itemsPerPage = itemsPerPage;
        options.value.sortBy = sortBy;
        options.value.sortDesc = sortDesc;
        // refresh();
    };

    const options = ref({
        page: 1,
        pageSize: 10,
    })

    const typeLabels = computed(() => ({
        Server: t('serverType'),
        Application: t('applicationType'),
        Task: t('taskType'),
    }))

    const waitForImport = async (id) => {

        await new Promise(r => setTimeout(r, 1500))

        const data = await fetchImports()
        // if (!data?.items) continue;

        const current = data?.items?.find(x => x.id === id)

        if (current?.applyImportReport?.totalItems > 0) {
            // done = true
        }

    }

    const fetchImports = async () => {
        loading.value = true

        try {
            const res = await getList({
                page: options.value.page,
                pageSize: options.value.pageSize,
                filter: {
                    ...filter.value,
                    phrase: search.value,
                },
            })
            totalItems.value = res?.imports || 0
            console.log(totalItems.value)

            imports.value = res?.items || []
            // console.log(res.items[0].importFileType)
            return res;
        } catch (e) {
            console.error('Błąd pobierania importów:', e)
            toast.error('Nie udało się pobrać danych')
            return null;
        } finally {
            loading.value = false
        }
    }

    const downloadFile = async (item) => {
        try {
            const url = `/api/Imports/${item.id}/download`

            const response = await fetch(url)
            const blob = await response.blob()

            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.setAttribute('download', item.filename)

            document.body.appendChild(link)
            link.click()
        } catch (e) {
            toast.error('Błąd pobierania pliku')
        }
    }

    const handleRestartImport = async (item) => {
        if (!confirm(t('reimportMsg'))) return

        item.loading = true

        try {
            await restartImport(item.id)

            toast.success(t('reimportMsg2'))

            await fetchImports()
        } catch (err) {
            console.error('RESTART IMPORT ERROR:', err)
            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                'Unknown error'

            toast.error(message)
        } finally {
            item.loading = false
        }
    }

    const saveAttachment = async (res) => {
        console.log("NOWA FUNKCJA SAVE ATTACHMENT ✅");
        console.log("DATA:", res);
                
        fileDialog.value = false
        // $toast.success('Plik zapisany – import został zlecony.');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await waitForImport(res.id);
        await fetchImports()
    }

    // const saveAttachmentError = (msg) => {
    //     $toast.error(msg || "Nie udało się zapisać pliku.");
    // };

    const formatDate = (date) => {
        if (!date) return '-'
        return new Date(date).toLocaleString()
    }

    const headers = computed(() => [
        { key: 'id', width: '1em' },
        { key: 'filename', title: t('fileName') },
        { key: 'type', title: t('type') },
        { key: 'source', title: t('source') },
        { key: 'createdAt', title: t('createdHeader') },
        { key: 'processingStartedAt', title: t('processingStartedAt'), sortable: false },
        { key: 'errors', title: t('errors'), sortable: false },
        { key: 'outcome', title: t('outcome') },
        { key: 'preview', title: t('preview'), sortable: false },
        { key: 'btns', title: '', sortable: false },
    ])

    watch([search], () => {
        fetchImports()
    })

    onMounted(() => {
        fetchImports()
    })
</script>

<style scoped>

.cell {
  width: 6vw;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-min {
  width: 2vw;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>