<template>
    <v-dialog v-model="dialogOpenApplications" max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">{{ isEditing ? $t("editText") : $t("addText") }} {{$t("applicationHeader")}}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="mb-2"
                    v-model="localApplication.name"
                    :label="$t('applicationHeader')"
                    :error-messages="$t(nameError)"
                ></v-text-field>
                <v-select 
                    v-model="localApplication.server"
                    :items="servers"
                    item-title="name"
                    item-value="name"
                    :label="$t('taskHeader')"
                    :error-messages="serverError"
                ></v-select>      
            </v-card-text>
            <v-btn 
                class="bg-surface-variant mx-6" 
                @click="saveApplication"> 
                {{ isEditing ? $t("saveEditText") : $t("addText") }} 
            </v-btn>
            <v-btn 
                text 
                class="mx-6 my-4" 
                @click="cancelApplication">
                {{ $t('cancel') }}
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useServers } from '~/composable/useServers';

    const { servers } = useServers();

    const props = defineProps({
        modelApplicationValue: Object
    })

    const emit = defineEmits(['save-application', 'cancel-application'])

    const dialogOpenApplications = ref(false);

    const isEditing = computed(() => !!props.modelApplicationValue?.id)

    const localApplication = ref({})

    const nameError = ref('')
    const serverError = ref('')

    watch(
        () => props.modelApplicationValue,
        (val) => {
            dialogOpenApplications.value = !!val;
            localApplication.value = val ? { ...val } : {}
        },
        { immediate: true }
    )
    
    watch(
        () => localApplication.value.name,
        (newVal) => {
            if (newVal?.trim()) {
                nameError.value = ''
            }
        }
    )

    watch(
        () => localApplication.value.server,
        (newVal) => {
            if (newVal?.trim()) {
                serverError.value = ''
            }
        }
    )

    const saveApplication = () => {
        if (!localApplication.value.name?.trim()) {
            nameError.value = 'You must enter a name.'
            return 
        } else if(!localApplication.value.server?.trim()){
            serverError.value = 'You must select a server.'
            return
        }
        emit('save-application', localApplication.value)
    }

    const cancelApplication = () => {
        emit('cancel-application')
    }

</script>