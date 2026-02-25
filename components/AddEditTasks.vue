<template>
    <v-dialog
        :model-value="dialogOpen"
        @update:model-value="val => emit('update:dialogOpen', val)"
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
            :items="servers"
            item-title="name"
            item-value="id"
            :label="$t('serverHeader')"
            :error-messages="serverError"
            />
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
            v-model="localTask.owner"
            :items="workers"
            item-title="name"
            item-value="name"
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
import { ref, reactive, watch, computed } from 'vue'
import { useServers } from '~/composable/useServers'
import { useApplications } from '~/composable/useApplications'
import workersNames from '../assets/data/workers.json'

    const emit = defineEmits(['save-task', 'cancel-task', 'update:dialogOpen'])

    const props = defineProps({
        mode: { type: String, required: true },
        modelTaskValue: Object,
        dialogOpen: Boolean
    })

    const { servers } = useServers()
    const { applications } = useApplications()
    const workers = ref(workersNames)

    const emptyTask = () => ({
        id: null,
        name: '',
        description: '',
        serverId: null,
        applicationId: null,
        owner: '',
        isActive: true
    })

    const localTask = reactive({ ...emptyTask() })

    const nameError = ref('')
    const serverError = ref('')

    const displayApplicationName = computed(() => {
        const app = applications.value.find(a => Number(a.id) === Number(localTask.applicationId))
        if (!app || Number(app.serverId) !== Number(localTask.serverId)) return '-'
        return app.name
    })

    const filteredApplications = computed(() => {
        if (!localTask.serverId) return []
        return applications.value.filter(
            a => Number(a.serverId) === Number(localTask.serverId)
        )
    })

    watch(
        () => props.modelTaskValue,
        task => {
            if (props.mode === 'edit' && task) {
            Object.assign(localTask, task)
            const app = applications.value.find(a => Number(a.id) === Number(task.applicationId))
            if (app) {
                localTask.serverId = app.serverId
            }
            } else if (props.mode === 'add') {
            Object.assign(localTask, emptyTask())
            }
        },
        { immediate: true }
    )

    watch(
        () => localTask.name, 
        val => {
            if (val?.trim()) nameError.value = ''
        }
    )

    watch(
        () => localTask.serverId, 
        val => {
            if (val) serverError.value = ''
        }
    )

    const saveTask = () => {
        if (!localTask.name?.trim()) {
            nameError.value = $t('nameError')
            return
        }
        if (!localTask.serverId) {
            serverError.value = $t('serverError')
            return
        }
        const app = applications.value.find(a => Number(a.id) === Number(localTask.applicationId))
        if (!app || Number(app.serverId) !== Number(localTask.serverId)) {
            localTask.applicationId = null
        }
        emit('save-task', { ...localTask })
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
</script>