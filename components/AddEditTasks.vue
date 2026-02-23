<template>
    <v-dialog v-model="dialogOpenTask" max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">{{ isEditing ? $t("editText") : $t("addText") }} {{$t("taskHeader")}}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="mb-2"
                    v-model="localTask.name"
                    :label="$t('taskHeader')"
                    :error-messages="$t(nameError)"
                ></v-text-field>
                <v-select 
                    v-model="localTask.serverId"
                    :items="servers"
                    item-title="name"
                    item-value="id"
                    :label="$t('serverHeader')"
                    :error-messages="serverError"
                ></v-select> 
                <v-select 
                    v-model="localTask.applicationId"
                    :items="applications.filter(app => app.serverId === localTask.serverId)"
                    item-title="name"
                    item-value="id"
                    :label="$t('applicationHeader')"
                ></v-select>
                <v-textarea
                    v-model="localTask.description"
                    :label="$t('description')">
                </v-textarea> 
                <v-select 
                    v-model="localTask.owner"
                    :items="workers"
                    item-title="name"
                    item-value="name"
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
import { useServers } from '~/composable/useServers';
import workersNames from '../assets/data/workers.json';

    const { servers } = useServers();

    const workers = ref(workersNames)
    const { applications } = useApplications();

    const props = defineProps({
        modelTaskValue: Object
    })

    const emit = defineEmits(['save-task', 'cancel-task'])

    const dialogOpenTask = ref(false);

    const isEditing = computed(() => !!props.modelTaskValue?.id)

    const localTask = ref({})

    const nameError = ref('')
    const serverError = ref('')

    watch(
        () => props.modelTaskValue,
        (val) => {
            dialogOpenTask.value = !!val;
            localTask.value = val ? { ...val } : {}
            nameError.value = ''
            serverError.value = ''
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
        (newVal) => {
            if (newVal) {
                serverError.value = ''
            }
        }
    )

    const saveTask = () => {
        if (!localTask.value.name?.trim()) {
            nameError.value = 'You must enter a name.'
            return 
        } else if(!localTask.value.serverId){
            serverError.value = 'You must select a server.'
            return
        }
        emit('save-task', localTask.value)
        dialogOpenTask.value = false
    }

    const cancelTask = () => {
        emit('cancel-task')
        dialogOpenTask.value = false
    }

</script>

<style scoped>




</style>