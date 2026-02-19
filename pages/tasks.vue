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
                    <v-btn 
                        :title="$t('delete')"
                        icon="mdi-delete" 
                        @click="removeTask(item.id)"
                        size="40"
                        flat />
                </div>
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
    
    const headers = ref([...displayedHeaders.slice(0, 1), { title: $t('applicationHeader'), key: "application" }, ...displayedHeaders.slice(1)]);


    const { tasks, addTask, removeTask, updateTask } = useTasks();

    const search = ref('')

    const formTask = ref(null)

    const openAddTask = () => {
        formTask.value = {
            id: null,
            name: '',
            application: null,
            createdAt: '',
            updatedAt: ''
        }
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
