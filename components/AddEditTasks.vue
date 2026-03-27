<template>
    <v-dialog
        :model-value="dialogOpen"
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
                :error-messages="nameError"
            />
            <v-select
                v-model="localTask.serverId"
                :items="backendServers"
                item-title="name"
                item-value="id"
                :label="$t('serverHeader')"
                :error-messages="serverError"/>
            <v-select
                v-model="localTask.applicationId"
                :items="filteredApplications"
                item-title="name"
                item-value="id"
                :label="$t('applicationHeader')"
            >
                <template #selection>
                    <span>{{ displayApplicationName }}</span>
                </template>
            </v-select>
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
import { ref, watch, computed } from 'vue'
import { useServers } from '~/composable/useServers'
import { useApplications } from '~/composable/useApplications'
import { useTasks } from '~/composable/useTasks'
import { useOwners } from '~/composable/useOwners';

    const { getOwners } = await useOwners()
    const owners = await getOwners()

    const props = defineProps({
        mode: { type: String, required: true },
        modelTaskValue: Object,
        dialogOpen: Boolean
    })
    const { getTasks } = useTasks();
    await getTasks();
    const { backendServers, getServers } = useServers()
    await getServers()

    const { backendApplications, getApplications } = useApplications()
    await getApplications()

    const emit = defineEmits(['save-task', 'cancel-task', 'update:dialogOpen'])

    const emptyTask = () => ({
        id: null,
        name: '',
        description: '',
        serverId: null,
        applicationId: null,
        ownerId: null,
        isActive: true
    })

    const localTask = ref({ ...emptyTask() })

    const nameError = ref('')
    const serverError = ref('')

    const displayApplicationName = computed(() => {
        const app = backendApplications.value.find(a => a.id === localTask.value.applicationId)
        return app?.name || '-'
    })

    const filteredApplications = computed(() => {
        if (!localTask.value.serverId) return []
        return backendApplications.value.filter(
            a => a.serverId === localTask.value.serverId
        )
    })

    watch(
        () => props.modelTaskValue,
        task => {
            if (props.mode === 'edit' && task) {
            localTask.value = { ...task }
            } else {
            localTask.value = emptyTask()
            }
        },
        { immediate: true, deep: true }
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
            if (props.mode === 'add' && newVal !== oldVal) {
                localTask.value.applicationId = null
            }
        }
    )

    const updateDialog = (val) => {
        emit('update:dialogOpen', val)
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

        const app = backendApplications.value.find(
            a => a.id === localTask.value.applicationId
        )
        if (app) {
            localTask.value.serverId = app.serverId
        }

        emit('save-task', { ...localTask.value })

        nameError.value = ''
        serverError.value = ''

        emit('update:dialogOpen', false)
    }

    const cancelTask = () => {
        emit('cancel-task')
        nameError.value = ''
        serverError.value = ''
        emit('update:dialogOpen', false)
    }
        
    watch(
        () => localTask.value.applicationId,
        (newAppId) => {
            if (!newAppId) return

            const app = backendApplications.value.find(a => a.id === newAppId)
            if (app) {
            localTask.value.serverId = app.serverId
            }
        }
    )

</script>