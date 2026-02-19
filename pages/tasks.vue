<template>
    <client-only>
        <div class="d-flex justify-end mb-6 mt-8">
            <v-btn 
                class="bg-surface-variant" 
                @click="openAddTask">
                {{ $t("addTask") }}
            </v-btn>
        </div>
        <add-edit-tasks
            :model-task-value="formTask"
            @save-task="handleSaveTask"
            @cancel-task="formTask = null"
        ></add-edit-tasks>
        <div class=" mb-4">
            <search-bar :label="$t('search')" v-model="search" />
        </div>   
        <v-data-table
            hide-default-footer
            class="rounded-lg"
            :headers="headers"
            :items="tasks"
            :search="search">
            <template #item.actions="{ item }">
                <div class="d-flex justify-end">
                    <v-btn 
                        :title="$t('edit')"
                        icon="mdi-pencil"
                        @click="openEditTask(item)"
                        class="mr-3"
                        size="40"
                        flat />
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
                <span>{{ item.serverName || '—' }}</span>
            </template>
            <template #item.application="{ item }">
                <span>{{ item.application || '—' }}</span>
            </template>
        </v-data-table>
    </client-only>
</template>

<script setup>
import { useTasks } from '~/composable/useTasks';
import AddEditTasks from '~/components/AddEditTasks.vue';
import headersNames from '../assets/data/headers.json';

    const { locale } = useI18n();
    
    const displayedHeaders = headersNames.map(h => ({
        ...h,
        title: h.title[locale.value] 
    }));
    
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('serverHeader'), key: "serverName" }, { title: $t('applicationHeader'), key: "application" }, ...displayedHeaders.slice(1)]);


    const { tasks, addTask, removeTask, updateTask } = useTasks();

    const search = ref('')

    const formTask = ref(null)

    const dialog = ref(false)

    const taskToDelete = ref(null)

    const openAddTask = () => {
        formTask.value = {
            id: null,
            name: '',
            description: '',
            serverName: null,
            application: null,
            createdAt: '',
            updatedAt: '',
            owner: '',
            isActive: true
        }
    }

    const openDeleteDialog = (id) => {
        taskToDelete.value = id
        dialog.value = true
    }

    const confirmDelete = () => {
        removeTask(taskToDelete.value)
        dialog.value = false
        taskToDelete.value = null
    }

    const openEditTask = (task) => {
        formTask.value = { ...task}
    }

    const closeDialogTask = () => {
        formTask.value = null
    }

    const handleSaveTask = (task) => {
        if (task.id) {
            updateTask(task)    
        } else {
            addTask(task)        
        }

        closeDialogTask()
    }

</script>

<style scoped>



</style>
