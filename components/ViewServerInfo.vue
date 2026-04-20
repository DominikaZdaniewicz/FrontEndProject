<template>
    <v-dialog v-model="dialogInfoServer" max-width="500px">
        <v-card v-if="localServer">
            <v-card-title class="mx-2 mt-4"> {{$t("serversFullInfo")}} </v-card-title>
            <v-card-text>
                <v-text-field
                    readonly
                    variant="plain"
                    v-model="localServer.name"
                    :label="$t('nameHeader')"
                ></v-text-field> 
                <v-textarea
                    readonly
                    variant="plain"
                    v-model="localServer.description"
                    auto-grow
                    rows = "1"  
                    aria-modal="8"
                    :label="$t('description')">
                </v-textarea>
                <v-select 
                    readonly
                    variant="plain"
                    v-model="localServer.ownerId"
                    :items="owners"
                    item-title="name"
                    item-value="id"
                    :label="$t('owner')"
                ></v-select>
                <v-text-field
                    readonly
                    variant="plain"
                    v-model="isActive"
                    :label="$t('status')"
                ></v-text-field>
                <v-text-field
                    readonly
                    variant="plain"
                    :value="formatDate(localServer.dateOfCreation)"
                    :label="$t('createdHeader')"
                    persistent-placeholder
                ></v-text-field>
                <v-text-field
                    readonly
                    variant="plain"
                    :value="formatDate(localServer.dateOfUpdate)"
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
                    :value="applicationsList"
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
                    :value="tasksList"
                    :label="$t('tasksList')"
                    persistent-placeholder
                ></v-text-field>                  
            </v-card-text>
            <v-text-field>{{ console.log() }}</v-text-field>
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
import { useOwners } from '~/composable/useOwners';
import { useServers } from '~/composable/useServers';

    const { getOwners } = await useOwners()
    const { getServersSummary} = useServers()
    const owners = await getOwners()

    const serversSummary = ref([])
    serversSummary.value = await getServersSummary();
    // const serversApps = ref([])

    const isActive = computed(() => {
        return localServer.value?.isActive ? $t('active') : $t('inactive')
    })

    const props = defineProps({
        modelServerValue: Object
    })

    const emit = defineEmits(['close-server'])

    const localServer = ref(null)

    const dialogInfoServer = ref(false);   

    const applicationsCount = computed(() => {
        const id = localServer.value?.id
        if (!id) return 0

        const list = serversSummary.value?._rawValue || serversSummary.value
        const server = list.find(s => s.id === id)

        return server?.applicationsNumber ?? 0
    })
        
    const tasksCount = computed(() => {
        const id = localServer.value?.id
        if (!id) return 0

        const list = serversSummary.value?._rawValue || serversSummary.value
        const server = list.find(s => s.id === id)

        return server?.tasksNumber ?? 0
    })
    
    const applicationsList = computed(() => {
        const id = localServer.value?.id
        if (!id) return '-'

        const list = serversSummary.value?._rawValue || serversSummary.value
        const server = list.find(s => s.id === id)

        return server?.applicationsList || '-'
    })

    const tasksList = computed(() => {
        const id = localServer.value?.id
        if (!id) return '-'

        const list = serversSummary.value?._rawValue || serversSummary.value
        const server = list.find(s => s.id === id)

        return server?.tasksList || '-'
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
        (newServer) => {
            if (!newServer) return

            localServer.value = { ...newServer }
            dialogInfoServer.value = true
    })

</script>

<style scoped>

    v-select { 
        appearance: none;
        cursor: default; 
        padding-right: 10px; 
    }


</style>