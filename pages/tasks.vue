<template>
  <client-only>
    <div class="d-flex justify-end mb-6 mt-8">
      <v-btn class="bg-surface-variant" @click="openAddTask">
        {{ $t("addTask") }}
      </v-btn>
    </div>

    <add-edit-tasks
      :mode="dialogMode"
      :model-task-value="formTaskForEdit"
      :dialog-open="dialogTaskOpen"
      @update:dialogOpen="dialogTaskOpen = $event"
      @save-task="handleSaveTask"
      @cancel-task="dialogTaskOpen = false"
    />

    <div class="mb-4">
      <search-bar :label="$t('search')" v-model="search" />
    </div>

    <v-data-table
      class="rounded-lg"
      :headers="headers"
      :items="backendTasks"
      :search="search"
    >
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
      <template #item.serverId="{ item }">
        <span>{{ getServerName(item.applicationId) }}</span>
      </template>
      <template #item.applicationId="{ item }">
        <span>{{ getApplicationName(item.applicationId) }}</span>
      </template>
    </v-data-table>
  </client-only>
</template>

<script setup>
import { useTasks } from '~/composable/useTasks';
import AddEditTasks from '~/components/AddEditTasks.vue';
import headersNames from '../assets/data/headers.json';
import { useServers } from '~/composable/useServers';
import { useApplications } from '~/composable/useApplications';
import { useI18n } from 'vue-i18n';

    const { locale, t } = useI18n();

    const displayedHeaders = headersNames.map(h => ({
      ...h,
      title: h.title[locale.value]
    }));

    const headers = ref([
      ...displayedHeaders.slice(0, 1),
      { title: t('serverHeader'), key: 'serverId' },
      { title: t('applicationHeader'), key: 'applicationId' },
      ...displayedHeaders.slice(1)
    ]);

    const { backendTasks, getTasks, addTask, removeTask, updateTask } = useTasks();
    await getTasks();
        
    const { backendServers, getServers } = useServers();
    await getServers();
    const { backendApplications, getApplications } = useApplications();
        
    await getApplications()

    const search = ref('');

    const dialogMode = ref('add');
    const dialogTaskOpen = ref(false);
    const formTaskForEdit = ref(null);
    const dialogDelete = ref(false);
    const taskToDelete = ref(null);
    
    // const getServerName= (serverId) => {
    //   return backendServers.value.find(server => server.id === serverId)?.name || '-';
    // }

    const getServerName = (applicationId) => {
      
      const app = backendApplications.value.find(a => a.id === applicationId)
      if (!app) return '-'
      
      const server = backendServers.value.find(s => s.id === app.serverId)

      return server?.name || '-'

      // const app = backendApplications.value.find(app => app.id === applicationId);
      // if(!app) {return backendServers.value.find(server => server.id === serverId)?.name || '-'}
      // else { return app.serverId?.name || '-' }
    }

    const getApplicationName = (applicationId) => {
      return backendApplications.value.find(app => app.id === applicationId)?.name || '-';
    };
    
    const openAddTask = () => {
      dialogMode.value = 'add';
      formTaskForEdit.value = {
        id: null,
        name: '',
        description: '',
        serverId: null,
        applicationId: null,
        ownerId: null,
        isActive: true
      };
      dialogTaskOpen.value = true;
    }; 

    const formatDate = (dateString) => {
      if (!dateString) return "-"

      return new Date(dateString).toLocaleDateString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
      })
    }
    const openEditTask = task => {
      dialogMode.value = 'edit';
      formTaskForEdit.value = 
      {
        id: task.id,
        name: task.name,
        description: task.description ?? '',
        serverId: task.serverId ?? null,
        applicationId: task.applicationId ?? null,
        ownerId: task.ownerId ?? null,
        isActive: task.isActive ?? false
      };
      dialogTaskOpen.value = true;  
    };

    const handleSaveTask = async taskData => {
      if (dialogMode.value === 'edit') {
        await updateTask(taskData);
      } else {
        await addTask(taskData);
      }
      await getTasks()
      dialogTaskOpen.value = false;
      formTaskForEdit.value = {
        id: task.id,
        name: task.name,
        description: task.description ?? '',
        serverId: task.serverId ?? null,
        applicationId: task.applicationId ?? null,
        ownerId: task.ownerId ?? null,
        isActive: task.isActive ?? false
      };
    };

    const openDeleteDialog = id => {
      taskToDelete.value = id;
      dialogDelete.value = true;
    };

    const confirmDelete = async () => {
      await removeTask(taskToDelete.value);
      dialogDelete.value = false;
      taskToDelete.value = null;
    };

    watch(
      () => backendApplications.value.map(a => a.serverId),
      () => {
        getServerName()
        getApplicationName()
        updateTask()
      }
    )


</script>