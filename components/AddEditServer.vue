<template>
    <v-dialog v-model="dialogOpenServers" max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">{{ isEditing ? $t("editText") : $t("addText") }} {{$t("serverHeader")}}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="mb-2"
                    v-model="localServer.name"
                    :label="$t('serverHeader')"
                    :error-messages="nameError"
                ></v-text-field>  
                <v-textarea
                    v-model="localServer.description"
                    :label="$t('description')">
                </v-textarea>
                <v-select 
                    v-model="localServer.userId"
                    :items="backendUsers"
                    item-title="userName"
                    item-value="id"
                    :label="$t('owner')"
                ></v-select>
                <v-checkbox 
                    v-model="localServer.isActive"
                    :label="$t('status')"
                    hide-details>
                </v-checkbox>  
            </v-card-text>
            <v-btn 
                class="bg-surface-variant mx-6" 
                @click="addServer"> 
                {{ isEditing ? $t("saveEditText") : $t("addText") }} 
            </v-btn>
            <v-btn 
                text 
                class="mx-6 my-4" 
                @click="deleteServer">
                {{ $t('cancel') }}
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup>
// import { useOwners } from '~/composable/useOwners';
import { useUsers } from '~/composable/useUsers';
import { useServers } from '~/composable/useServers';

    // const { owners, getOwners } = useOwners()
    const { getServerEdit } = useServers()
    const { backendUsers, getUsers } = useUsers()

    const props = defineProps({
        modelServerValue: Object
    })

    const emit = defineEmits(['saveServer', 'cancelServer'])

    const dialogOpenServers = ref(false);

    const isEditing = computed(() => !!props.modelServerValue?.id)

    const emptyServer = {
        name: '',
        description: '',
        userId: null,
        isActive: true
    }

    const localServer = ref({ ...emptyServer })

    const nameError = ref('')

    watch(
        () => props.modelServerValue,
        async (val) => {
                        
            if (val === null) {
                dialogOpenServers.value = false
                localServer.value = { ...emptyServer }
                return
            }

            dialogOpenServers.value = !!val;
            await getUsers()
            
            if (val.id) {
                const fullServer = await getServerEdit(val.id)
                localServer.value = { ...emptyServer, ...fullServer }
            }
            else {
                localServer.value = { ...emptyServer }
            }
            },
        { immediate: true }
    )
    
    watch(
        () => localServer.value.name,
        (newVal) => {
            if (newVal?.trim()) {
                nameError.value = ''
            }
        }
    )

    const addServer= () => {
        if (!localServer.value.name?.trim()) {
            nameError.value = $t('nameError');
            return 
        }
        emit('saveServer', localServer.value)
        dialogOpenServers.value = false;
        nameError.value = ''
    }

    const deleteServer = () => {
        emit('cancelServer')
        dialogOpenServers.value = false;
    }

</script>