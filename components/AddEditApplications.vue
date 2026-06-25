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
                    :items="basicServerData"
                    item-title="name"
                    item-value="id"
                    :label="$t('serverHeader')"
                    :error-messages="serverError"
                    />              
                <v-textarea
                    v-model="localApplication.description"
                    :label="$t('description')">
                </v-textarea> 
                <v-select 
                    v-model="localApplication.userId"
                    :items="backendUsers"
                    item-title="userName"
                    item-value="id"
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
import { useApplications } from '~/composable/useApplications';
import { useServers } from '~/composable/useServers';
import { useUsers } from '~/composable/useUsers';

    const { getApplicationEdit } = useApplications()
    const { basicServerData, getServersBasic } = useServers()
    const { backendUsers, getUsers } = useUsers()

    const props = defineProps({
        modelApplicationValue: Object
    })
    const emit = defineEmits(['save-application', 'cancel-application', 'applications-updated'])

    const dialogOpenApplications = ref(false);

    const isEditing = computed(() => !!props.modelApplicationValue?.id)

    const localApplication = ref({})

    const nameError = ref('')
    const serverError = ref('')

    const emptyApplication = {
        name: '',
        description: '',
        serverId: null,
        userId: null,
        isActive: true
    }

    watch(
        () => props.modelApplicationValue,
        async (val) => {
                        
            if (val === null) {
                dialogOpenApplications.value = false
                localApplication.value = { ...emptyApplication }
                return
            }

            dialogOpenApplications.value = !!val;
            await getUsers();
            await getServersBasic();

            if (!props.modelApplicationValue) return
            
            if (val.id) {
                const fullApplication = await getApplicationEdit(val.id)
                localApplication.value = { ...emptyApplication, ...fullApplication }
            }
            else {
                localApplication.value = { ...emptyApplication }
            }
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
        emit("applications-updated")
        dialogOpenApplications.value = false;        
    }

    const cancelApplication = () => {
        nameError.value = ''
        serverError.value = ''
        emit('cancel-application')
    }

</script>