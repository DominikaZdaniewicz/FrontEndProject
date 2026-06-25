<template>
  <client-only>
    <div class="d-flex justify-end mb-6 mt-8">
      <v-btn 
          v-if="isAdmin"
          prepend-icon="mdi-plus"
          class="ml-8 bg-surface-variant w-25" 
          @click="openAddTask">
          {{ $t("addTask") }}
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
  <!-- <v-dialog v-model="dialogImport" max-width="500">
      <v-card
          class = "px-2 py-4"
          :text="$t('importMsg')">
          <v-file-input
              v-model="selectedFile"
              accept=".xlsx,.xls"
              :label="$t('selectExcelFile')"
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
    </v-dialog> -->
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
                    @click="confirmExportTasks">
                    {{ $t('yes') }}
                </v-btn>
            </template>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogExportPDF" max-width="500">
        <v-card
            prepend-icon="mdi-export"
            :text="$t('exportMsg')">
            <template #actions>
                <v-spacer />
                <v-btn
                    @click="dialogExportPDF = false">
                    {{ $t('no') }}
                </v-btn>
                <v-btn
                    class="bg-surface-variant"
                    @click="confirmExportTasksPDF">
                    {{ $t('yes') }}
                </v-btn>
            </template>
        </v-card>
    </v-dialog>
    <add-edit-tasks
        :mode="dialogMode"
        :model-task-value="formTask"
        :dialog-open="dialogTaskOpen"
        @update:dialogOpenTasks="dialogTaskOpen = $event"
        @save-task="handleSaveTask"
        @cancel-task="dialogTaskOpen = false"/>
    <email-user
        :model-user-value="selectedUser"
        :dialog-open="dialogEmailUserOpen"
        @update:dialogOpen="dialogEmailUserOpen = $event"
        @cancel-user="dialogEmailUserOpen = false"
        :task-id="selectedTaskId"/>
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
        <div v-if="!filterMenu" class="d-flex align-center justify-end mb-4 w-25">
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
                    @click="openImportTasks">
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
                    @click="openExportTasks">
                    {{ $t('exportExcel') }}
                </v-btn>
                <v-btn
                    class="ml-4"
                    @click="openExportTasksPDF">
                    {{ $t('exportPDF') }}
                </v-btn>
            </div>
        </div>
    <v-data-table-server
      class="rounded-lg"
      :items="tasks"
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
      <template #item.applicationName="{ value }">
        {{ value || '-' }}
      </template>
      <template #item.dateOfCreation="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #item.dateOfUpdate="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #item.actions="{ item }">
        <div 
          class="d-flex justify-end align-center">
          <v-btn
              v-if="item.userId"
              icon="mdi-email-outline"
              @click="openEmailUser(item)"
              size="30"
              flat
              class="bg-surface-variant mr-2"/>
          <v-btn
              v-else
              icon="mdi-email-outline"
              @click="openEmailUser(item)"
              size="30"
              flat
              class="bg-surface-variant mr-2"
              disabled/>
          <v-btn
            :title="$t('edit')"
            icon="mdi-pencil"
            @click="openEditTask(item)"
            class="mr-3"
            size="40"
            flat
          />
          <v-dialog v-model="dialogDelete" max-width="500">
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
            <v-card prepend-icon="mdi-alert" :text="$t('deleteMsg')">
              <template #actions>
                <v-spacer />
                <v-btn @click="dialogDelete = false">{{ $t('no') }}</v-btn>
                <v-btn class="bg-surface-variant" @click="confirmDelete">
                  {{ $t('yes') }}
                </v-btn>
              </template>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-data-table-server>
  </client-only>
</template>

<script setup>
import { useTasks } from '~/composable/useTasks';
import AddEditTasks from '~/components/AddEditTasks.vue';
import EmailUser from '~/components/EmailUser.vue';
import headersNames from '../assets/data/headers.json';
import { useI18n } from 'vue-i18n';
import { useUsers } from '~/composable/useUsers';
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

    const { getUsers, backendUsers } = useUsers();
    const { locale, t } = useI18n();
    const { data } = useAuth()
    const page = ref(1)
    const itemsPerPage = ref(10);
    const paginationData = ref(null);

    const isAdmin = computed(() => {
        return data.value?.roles?.includes("administrator")
    })

    const tasks = computed(() => paginationData.value?.productPerPage ?? [])
        
    const totalItems = computed(() => paginationData.value?.numberOfTasks ?? 0)

    const itemsPerPageOptions = computed(() => [{ value: 10, title: 10 }, { value: 25, title: 25 }, { value: totalItems.value, title: $t('all') }]);

    const resolvedPageSize = computed(() => itemsPerPage.value === 'all' ? totalItems.value || 10 : itemsPerPage.value);

    const dialogEmailUserOpen = ref(false);

    const selectedUser = ref(null)
    const selectedTaskId = ref(null)
    const displayedHeaders = headersNames.map(h => ({
      ...h,
      title: h.title[locale.value],
      sortable: true
    }));

    const headers = ref([
      ...displayedHeaders.slice(0, 1),
      { title: t('serverHeader'), key: 'serverName', sortable: true },
      { title: t('applicationHeader'), key: 'applicationName', sortable: true },
      ...displayedHeaders.slice(1)
    ]);

    const { addTask, removeTask, updateTask, paginationTask, exportXlsx, importTasks, exportPdf, getImportRawData } = useTasks();

    const search = ref('')
    
    const filterMenu = ref(true)

    const activeFilter = ref('allActive')

    const sortBy = ref([])

    const selectedFile = ref(null)

    const importId = ref(null)
    
    // const confirmImport = async () => {
    //     if (!selectedFile.value) return;

    //     dz.processQueue();
    // };

    const dialogMode = ref('add');
    const dialogTaskOpen = ref(false);
    const formTask = ref(null);
    const dialogDelete = ref(false);
    const taskToDelete = ref(null);
    const dialogExport = ref(false)
    const dialogExportPDF = ref(false)
    // const dialogImport = ref(false)

    const openAddTask = () => {
      dialogMode.value = 'add';
      formTask.value = {
        name: '',
        description: '',
        serverId: null,
        serverName: null,
        applicationId: null,
        applicationName: null,
        userId: null,
        isActive: true
      };
      dialogTaskOpen.value = true;
    }; 

    const loadData = async () => {
      
      if (!importId.value) return

      const result = await getImportRawData(importId.value, {
        page: page.value,
        pageSize: resolvedPageSize.value,
        phrase: search.value
      })

      paginationData.value = {
        productPerPage: result.items.items,
        numberOfTasks: result.items.totalCount
      }

      headers.value = result.headers
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
      paginationData.value = await paginationTask
          (page.value, 
          resolvedPageSize.value, 
          search.value, 
          activeFilter.value,
          sortBy.value,
      )
    }

    const openEditTask = (task) => {
      dialogMode.value = 'edit'
      formTask.value = { ...task }
      dialogTaskOpen.value = true
    }

    const handleSaveTask = async taskData => {
      if (dialogMode.value === 'edit') {
        await updateTask(taskData);
      } else {
        await addTask(taskData);
      }
      await reloadPage()
      dialogTaskOpen.value = false;
    };

    const openDeleteDialog = id => {
      taskToDelete.value = id;
      dialogDelete.value = true;
    };

    const openExportTasks = () => {
      dialogExport.value = true
    }

    const openExportTasksPDF = () => {
      dialogExportPDF.value = true
    }

    // const openImportTasks = () => {
    //   dialogImport.value = true
    // }

    const confirmDelete = async () => {
      await removeTask(taskToDelete.value);
      dialogDelete.value = false;
      taskToDelete.value = null;
      await reloadPage()
    };

    const confirmExportTasks = async () => {
      await exportXlsx()
      dialogExport.value = false
    }

    const confirmExportTasksPDF = async () => {
      await exportPdf()
      dialogExportPDF.value = false
    }

    const openEmailUser = async (task) => {
      await getUsers()

      const usersArray = Array.isArray(backendUsers.value) ? backendUsers.value : [];
  
      const user = usersArray.find(u => u.id === task.userId)

      if (!user) {
        return
      }
      selectedUser.value = user
      selectedTaskId.value = task.id
      dialogEmailUserOpen.value = true
    }

//     Dropzone.autoDiscover = false;

//     let dz = null;

//     watch(dialogImport, async (isOpen) => {
//         if (isOpen) {
//             await nextTick();

//             if (dz) {
//                 dz.destroy();
//             }
// // url: "/api/Task/import",
//             dz = new Dropzone("#my-dropzone", {
//                 url: "http://localhost:5056/api/ImportData/internal/Main",
//                 paramName: "file",      
//                 acceptedFiles: ".xlsx,.xls",
//                 maxFiles: 1,
//                 dictDefaultMessage: $t('selectExcelFile'),   
//                 autoProcessQueue: false,
//                 // headers: {
//                 //         Authorization: `Bearer ${useAuth().data.value?.token}`
//                 //     }
//             });
                
//             dz.on("addedfile", (file) => {
//                 selectedFile.value = file;
//             });

//             dz.on("success", async (file, response) => {
//                 console.log("RESPONSE:", response)
//                 importId.value = response.importId 
//                 await loadData() 
//                 dialogImport.value = false
//                 dz.removeAllFiles()
//             })
            
//             // dz.on("success", async () => {
//             //     await reloadPage();
//             //     dialogImport.value = false;
//             //     dz.removeAllFiles();
//             // });

//             dz.on("removedfile", () => {
//                 selectedFile.value = null;
//             });
//         }
//     });

    watch(
        [page, resolvedPageSize],
        async () => {
            await reloadPage()
        },
        { immediate: true }
    )

    watch(
        [search, activeFilter, sortBy],
        async () => {
            page.value = 1
            await reloadPage()
        }
    )
</script>