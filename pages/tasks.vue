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
      :items="tasks"
      :search="search"
    >
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
        <span>{{ getServerName(item.serverId, item.applicationId) }}</span>
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
import { ref, computed } from 'vue';
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

    const { tasks, addTask, removeTask, updateTask } = useTasks();
    const { servers } = useServers();
    const { applications } = useApplications();

    const search = ref('');

    const dialogMode = ref('add');
    const dialogTaskOpen = ref(false);
    const formTaskForEdit = ref(null);
    const dialogDelete = ref(false);
    const taskToDelete = ref(null);

    const getServerName = (serverId, applicationId = null) => {
        const app = applications.value.find(a => Number(a.id) === Number(applicationId));
        const serverIdToUse = app?.serverId ?? serverId;
        return servers.value.find(s => Number(s.id) === Number(serverIdToUse))?.name || '-';
    };

    const getApplicationName = id => {
        const application = applications.value.find(a => Number(a.id) === Number(id));
        return application?.name || '-';
    };

    const openAddTask = () => {
    dialogMode.value = 'add';
    formTaskForEdit.value = {
        id: null,
        name: '',
        description: '',
        serverId: null,
        applicationId: null,
        owner: '',
        isActive: true
    };
    dialogTaskOpen.value = true;
    };

    const openEditTask = task => {
        dialogMode.value = 'edit';
        formTaskForEdit.value = { ...task };
        dialogTaskOpen.value = true;
    };

    const handleSaveTask = taskData => {
        if (dialogMode.value === 'edit') {
            updateTask(taskData);
        } else {
            addTask(taskData);
        }
        dialogTaskOpen.value = false;
        formTaskForEdit.value = null;
    };

    const openDeleteDialog = id => {
        taskToDelete.value = id;
        dialogDelete.value = true;
    };

    const confirmDelete = () => {
        removeTask(taskToDelete.value);
        dialogDelete.value = false;
        taskToDelete.value = null;
    };
</script>