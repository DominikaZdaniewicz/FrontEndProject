<template>
    <v-dialog v-model="dialogOpenApplications" max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">
                {{ isEditing ? $t("editText") : $t("addText") }} {{$t("applicationHeader")}}
            </v-card-title>
            <v-card-text>
                <v-text-field
                    class="mb-2"
                    v-model="localApplication.name"
                    :label="$t('applicationHeader')"
                    :error-messages="nameError"
                ></v-text-field>
                <v-select 
                    v-model="localApplication.serverId"
                    :items="servers"
                    item-title="name"
                    item-value="id"
                    :label="$t('serverHeader')"
                    :error-messages="serverError"
                ></v-select>
                <v-textarea
                    v-model="localApplication.description"
                    :label="$t('description')">
                </v-textarea> 
                <v-select 
                    v-model="localApplication.owner"
                    :items="workers"
                    item-title="name"
                    item-value="name"
                    :label="$t('owner')"
                ></v-select>
                <v-checkbox 
                    v-model="localApplication.isActive"
                    :label="$t('status')"
                    hide-details>
                </v-checkbox>       
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
import workersNames from '../assets/data/workers.json';

    const { servers } = useServers();

    const workers = ref(workersNames)

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
        () => localApplication.value.serverId, 
        val => {
            if (val) serverError.value = ''
        }
    )


    const saveApplication = () => {
        if (!localApplication.value.name?.trim()) {
            nameError.value = $t('nameError');
            return 
        } else if(!localApplication.value.serverId){
            serverError.value = $t('serverError');
            return
        }
        nameError.value = ''
        serverError.value = ''
        emit('save-application', localApplication.value)
    }

    const cancelApplication = () => {
        nameError.value = ''
        serverError.value = ''
        emit('cancel-application')
    }

</script>