<template>
    <v-dialog v-model="dialogOpenServer" max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">{{ isEditing ? $t("editText") : $t("addText") }} {{$t("serverHeader")}}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="mb-2"
                    v-model="localServer.name"
                    :label="$t('serverHeader')"
                    :error-messages="$t(nameError)"
                ></v-text-field>  
                <v-textarea
                    v-model="localServer.description"
                    :label="$t('description')">
                </v-textarea>
                <v-select 
                    v-model="localServer.owner"
                    :items="workers"
                    item-title="name"
                    item-value="name"
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
                @click="saveServer"> 
                {{ isEditing ? $t("saveEditText") : $t("addText") }} 
            </v-btn>
            <v-btn 
                text 
                class="mx-6 my-4" 
                @click="cancelServer">
                {{ $t('cancel') }}
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup>
import workersNames from '../assets/data/workers.json';

    const workers = ref(workersNames)

    const props = defineProps({
        modelServerValue: Object
    })

    const emit = defineEmits(['saveServer', 'cancelServer'])

    const dialogOpenServer = ref(false);

    const isEditing = computed(() => !!props.modelServerValue?.id)

    const localServer = ref({})

    const nameError = ref('')

    watch(
        () => props.modelServerValue,
        (val) => {
            dialogOpenServer.value = !!val;
            localServer.value = val ? { ...val } : {}
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

    const saveServer= () => {
        if (!localServer.value.name?.trim()) {
            nameError.value = 'You must enter a name.'
            return 
        }
        emit('saveServer', localServer.value)
    }

    const cancelServer = () => {
        emit('cancelServer')
    }

</script>