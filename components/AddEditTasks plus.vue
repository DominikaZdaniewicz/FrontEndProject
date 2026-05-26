<template>
    <v-dialog
        :model-value="dialogOpenTasks"
        @update:model-value="updateDialog"
        max-width="500px"
    >
        <v-card>
        <v-card-title class="mx-2 mt-4">
            {{ mode === 'edit' ? $t('editText') : $t('addText') }} {{ $t('taskHeader') }}
        </v-card-title>
        

        <v-card-text>
            <v-text-field
                class="mb-2"
                v-model="localTask.name"
                :label="$t('taskHeader')"
                :error-messages="nameError"/>
            <v-select
                v-model="localTask.serverId"
                :items="basicServerData"
                item-title="name"
                item-value="id"
                :label="$t('serverHeader')"
                :error-messages="serverError"/>
            <v-select
                v-model="localTask.applicationId"
                :items="basicApplicationData"
                item-title="name"
                item-value="id"
                :label="$t('applicationHeader')"/>
            <v-textarea
                v-model="localTask.description"
                :label="$t('description')"
            />
            <v-select
                v-model="localTask.ownerId"
                :items="owners"
                item-title="name"
                item-value="id"
                :label="$t('owner')"
            />
            <v-checkbox
                v-model="localTask.isActive"
                :label="$t('status')"
                hide-details
            />
        </v-card-text>

        <v-btn class="bg-surface-variant mx-6"  @click="saveTask">
        {{ mode === 'edit' ? $t('saveEditText') : $t('addText') }}
        </v-btn>
        <v-btn class="mx-6 my-4" text @click="cancelTask">{{ $t('cancel') }}</v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useServers } from '~/composable/useServers'
import { useApplications } from '~/composable/useApplications'
import { useTasks } from '~/composable/useTasks'
import { useOwners } from '~/composable/useOwners';

    const { owners } = useOwners() 
    const { getTaskEdit } = useTasks();
    const { basicApplicationData, getApplicationsBasic } = useApplications()
    const { basicServerData, getServersBasic } = useServers()

    const props = defineProps({
        mode: { type: String, required: true },
        modelTaskValue: Object,
        dialogOpenTasks: Boolean
    })

    const emit = defineEmits(['save-task', 'cancel-task', 'update:dialogOpenTasks'])

    const dialogOpenTasks = ref(false);

    const emptyTask = {
        id: null,
        name: '',
        description: '',
        serverId: null,
        applicationId: null,
        ownerId: null,
        isActive: true
    }

    const localTask = ref({ ...emptyTask})

    const nameError = ref('')
    const serverError = ref('')
    const isInitializing = ref(false)

    // onMounted(async () => {
    //     await getOwners()
    //     await getServersBasic()
    //     await getApplicationsBasic()
    // })

    // watch(() => props.modelTaskValue,
    //     async (val) => {
    //         if (!val) {
    //             localTask.value = { ...emptyTask }
    //             return
    //         }

    //         if (val.id) {
    //             const fullTask = await getTaskEdit(val.id)
    //             localTask.value = { ...emptyTask, ...fullTask }
    //         } else {
    //             localTask.value = { ...emptyTask }
    //         }
    //     },
    //     { immediate: true }
    // )

     watch(
        () => props.modelTaskValue,
        async (val) => {
                        
            if (val === null) {
                dialogOpenTasks.value = false
                localTask.value = { ...emptyTask }
                return
            }

            dialogOpenTasks.value = !!val;
            await getOwners()
            await getServersBasic()
            await getApplicationsBasic()

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
        val => {
            if (val?.trim()) nameError.value = ''
        }
    )

    watch(
        () => localTask.value.serverId, 
        val => {
            if (val) serverError.value = ''
        }
    )

    watch(
        () => localTask.value.serverId,
        (newVal, oldVal) => {
            if (isInitializing.value) return
            if (newVal !== oldVal) {
                localTask.value.applicationId = null
            }
        }
    )

    const updateDialog = (val) => {
        emit('update:dialogOpenTasks', val)
    }

    const saveTask = async () => {
        if (!localTask.value.name?.trim()) {
            nameError.value = $t('nameError')
            return
        }

        if (!localTask.value.serverId && !localTask.value.applicationId) {
            serverError.value = $t('serverError')
            return
        }

        const app = basicApplicationData.value.find(
            a => a.id === localTask.value.applicationId
        )
        if (app) {
            localTask.value.serverId = app.serverId
        }

        emit('save-task', { ...localTask.value })

        nameError.value = ''
        serverError.value = ''

        emit('update:dialogOpenTasks', false)
    }

    const cancelTask = () => {
        emit('cancel-task')
        nameError.value = ''
        serverError.value = ''
        emit('update:dialogOpenTasks', false)
    }
        
    watch(
        () => localTask.value.applicationId,
        (newAppId) => {
            if (!newAppId) return

            const app = basicApplicationData.value.find(a => a.id === newAppId)
            if (app) {
            localTask.value.serverId = app.serverId
            }
        }
    )

</script>