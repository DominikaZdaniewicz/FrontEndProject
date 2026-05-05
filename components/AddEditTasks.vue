<template>
    <v-dialog 
        v-model="dialogOpenTasks" 
        max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">
                {{ isEditing ? $t("editText") : $t("addText") }} {{$t("taskHeader")}}
            </v-card-title>
            <v-card-text>
                <v-text-field
                    class="mb-2"
                    v-model="localTask.name"
                    :label="$t('taskHeader')"
                    :error-messages="nameError"
                ></v-text-field>
                <v-select
                    v-model="localTask.serverId"
                    :items="basicServerData"
                    item-title="name"
                    item-value="id"
                    :label="$t('serverHeader')"
                    :error-messages="serverError"/>                   
                <v-select
                    v-model="localTask.applicationId"
                    :items="availableApplications"
                    item-title="name"
                    item-value="id"
                    :label="$t('applicationHeader')"/>
                <v-textarea
                    v-model="localTask.description"
                    :label="$t('description')">
                </v-textarea> 
                <v-select 
                    v-model="localTask.ownerId"
                    :items="owners"
                    item-title="name"
                    item-value="id"
                    :label="$t('owner')"
                ></v-select>
                <v-checkbox 
                    v-model="localTask.isActive"
                    :label="$t('status')"
                    hide-details>
                </v-checkbox>   
            </v-card-text>
            <v-btn 
                class="bg-surface-variant mx-6" 
                @click="saveTask"> 
                {{ isEditing ? $t("saveEditText") : $t("addText") }} 
            </v-btn>
            <v-btn 
                text 
                class="mx-6 my-4" 
                @click="cancelTask">
                {{ $t('cancel') }}
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useApplications } from '~/composable/useApplications';
import { useOwners } from '~/composable/useOwners';
import { useServers } from '~/composable/useServers';
import { useTasks } from '~/composable/useTasks';

    const { owners, getOwners } = useOwners() 
    const { getTaskEdit } = useTasks()
    const { basicServerData, getServersBasic } = useServers()
    const { basicApplicationData, basicApplicationToTaskData, getApplicationsBasic, getApplicationsToTask } = useApplications()

    const props = defineProps({
        modelTaskValue: Object,
        dialogOpen: Boolean
    })
    const emit = defineEmits(['save-task', 'cancel-task', 'update:dialogOpenTasks'])

    const dialogOpenTasks = ref(false);

    const isEditing = computed(() => !!props.modelTaskValue?.id)

    const localTask = ref({})

    const nameError = ref('')
    const serverError = ref('')

    const emptyTask = {
        name: '',
        description: '',
        serverId: null,
        applicationId: null,
        ownerId: null,
        isActive: true
    }

    const availableApplications =  computed(() => {
        if (!localTask.value?.serverId) {
            getApplicationsBasic();
            return basicApplicationData.value
        };
        return basicApplicationToTaskData.value?.filter(a => a.serverId === localTask.value.serverId) ?? []
    })


    watch(
        () => props.modelTaskValue,
        async (val) => {
                        
            if (val === null) {
                dialogOpenTasks.value = false
                localTask.value = { ...emptyTask }
                return
            }

            dialogOpenTasks.value = !!val;
            await getOwners();   
            await getServersBasic();     
            await getApplicationsToTask();
            if (!props.modelTaskValue) return
            
            if (val.id) {
                const fullTask = await getTaskEdit(val.id)
                localTask.value = { ...emptyTask, ...fullTask }
            }
            else {
                localTask.value = { ...emptyTask }
            }
            },

        { immediate: true }
    )
    
    watch(
        () => localTask.value.name,
        (newVal) => {
            if (newVal?.trim()) {
                nameError.value = ''
            }
        }
    )

    watch(
        () => localTask.value.serverId, 
        val => {
            if (val) serverError.value = ''
        }
    )

    const saveTask = () => {
        if (!localTask.value.name?.trim()) {
            nameError.value = $t('nameError');
            return 
        } else if(!localTask.value.serverId){
            serverError.value = $t('serverError');
            return
        }
        nameError.value = ''
        serverError.value = ''
        emit('save-task', localTask.value)
        emit('update:dialogOpenTasks', false)
        dialogOpenTasks.value = false
    }

    const cancelTask = () => {
        nameError.value = ''
        serverError.value = ''
        emit('cancel-task')
        emit('update:dialogOpenTasks', false)
        dialogOpenTasks.value = false
    }

</script>