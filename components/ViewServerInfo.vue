<template>
    <v-dialog v-model="dialogInfoServer" max-width="500px">
        <v-card v-if="serverDetails">
            <v-card-title class="mx-2 mt-4"> {{$t("serversFullInfo")}} </v-card-title>
            <v-card-text>
                <v-text-field
                    readonly
                    variant="plain"
                    v-model="serverDetails.name"
                    :label="$t('nameHeader')"
                ></v-text-field> 
                <v-textarea
                    readonly
                    variant="plain"
                    v-model="serverDetails.description"
                    auto-grow
                    rows = "1"  
                    aria-modal="8"
                    :label="$t('description')">
                </v-textarea>
                <v-text-field
                    readonly
                    variant="plain"
                    v-model="serverDetails.ownerName"
                    :label="$t('owner')"
                ></v-text-field>
                <!-- <v-select 
                    readonly
                    variant="plain"
                    v-model="serverDetails.ownerId"
                    :items="owners"
                    item-title="name"
                    item-value="id"
                    :label="$t('owner')"
                ></v-select> -->             
                <v-text-field
                    readonly
                    variant="plain"
                    v-model="isActive"
                    :label="$t('status')"
                ></v-text-field>
                <v-text-field
                    readonly
                    variant="plain"
                    :value="formatDate(serverDetails.dateOfCreation)"
                    :label="$t('createdHeader')"
                    persistent-placeholder
                ></v-text-field>
                <v-text-field
                    readonly
                    variant="plain"
                    :value="formatDate(serverDetails.dateOfUpdate)"
                    :label="$t('updatedHeader')"
                    persistent-placeholder
                ></v-text-field>
                <v-text-field
                    readonly
                    variant="plain"
                    :value="applicationsCount"
                    :label="$t('applicationsNumber')"
                    persistent-placeholder
                ></v-text-field> 
                <v-text-field
                    readonly
                    variant="plain"
                    :model-value="applicationsList"
                    :label="$t('appsList')"
                    persistent-placeholder
                ></v-text-field> 
                <v-text-field
                    readonly
                    variant="plain"
                    :value="tasksCount"
                    :label="$t('tasksNumber')"
                    persistent-placeholder
                ></v-text-field>
                <v-text-field
                    readonly
                    variant="plain"
                    :model-value="tasksList"
                    :label="$t('tasksList')"
                    persistent-placeholder
                ></v-text-field>                  
            </v-card-text>
            <v-btn 
                text 
                class="mx-6 my-4" 
                @click="closeServer">
                {{ $t('close') }}
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useServers } from '~/composable/useServers';

    const { getServerDetails } = useServers()

    const serverDetails = ref(null)

    const isActive = computed(() => {
        return serverDetails.value?.isActive ? $t('active') : $t('inactive')
    })

    const props = defineProps({
        modelServerValue: Object
    })

    const emit = defineEmits(['close-server'])


    const dialogInfoServer = ref(false);   

    const applicationsCount = computed(() => {
        return serverDetails.value?.applicationsNumber ?? 0
    })
        
    const tasksCount = computed(() => {
        return serverDetails.value?.tasksNumber ?? 0
    })
    
    const applicationsList = computed(() => {
        return serverDetails.value?.applicationsList ?? '-'
    })

    const tasksList = computed(() => {
        return serverDetails.value?.tasksList ?? '-'
    })
   
    const formatDate = (dateString) => {
        if (!dateString) return "-"

        return new Date(dateString).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }
    
    const closeServer = () => {
        dialogInfoServer.value = false;
        emit('close-server')
    }

    watch(
        () => props.modelServerValue,
        async (newServer) => {
            if (!newServer?.id) return

            serverDetails.value = { ...newServer }
            dialogInfoServer.value = true

            serverDetails.value = await getServerDetails(newServer.id)
        },
    )

</script>

<style scoped>

    v-select { 
        appearance: none;
        cursor: default; 
        padding-right: 10px; 
    }


</style>