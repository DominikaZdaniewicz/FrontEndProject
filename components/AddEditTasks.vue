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
                    v-model="localTask.application"
                    :items="applications"
                    item-title="name"
                    item-value="name"
                    :label="$t('applicationHeader')"
                    :error-messages="applicationError"
                ></v-select>
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

    const { applications } = useApplications();

    const props = defineProps({
        modelTaskValue: Object
    })

    const emit = defineEmits(['save-task', 'cancel-task'])

    const dialogOpenTask = ref(false);

    const isEditing = computed(() => !!props.modelTaskValue?.id)

    const localTask = ref({})

    const nameError = ref('')
    const applicationError = ref('')

    watch(
        () => props.modelTaskValue,
        (val) => {
            dialogOpenTask.value = !!val;
            localTask.value = val ? { ...val } : {}
            nameError.value = ''
            applicationError.value = ''
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
        () => localTask.value.application,
        (newVal) => {
            if (newVal?.trim()) {
                applicationError.value = ''
            }
        }
    )

    const saveTask = () => {
        if (!localTask.value.name?.trim()) {
            nameError.value = 'You must enter a name.'
            return 
        } else if(!localTask.value.application?.trim()){
            applicationError.value = 'You must select an application.'
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