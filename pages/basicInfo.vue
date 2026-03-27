<template>
    <client-only>
        <div class="mt-8">
            <search-bar :label="$t('search')" v-model="search" />
        </div>
        <div>
            <h2 class="text-h5 mt-8 mb-4">{{ $t('serversBtn') }}</h2>
            <v-data-table
                class="rounded-lg mt-8 pl-4 pr-4 small-columns"
                :items="serversBasic"
                :search="search"
                :items-per-page-options="itemsPerPageOptionsS"
                :items-per-page="itemsPerPageS"
                :page="pageS"
                />
            <h2 class="text-h5 mt-8 mb-4">{{ $t('applicationsBtn') }}</h2>
            <v-data-table
                class="rounded-lg mt-8 pl-4 pr-4 small-columns"
                :items="applicationsBasic"
                :search="search"
                :items-per-page-options="itemsPerPageOptionsA"
                :items-per-page="itemsPerPageA"
                :page="pageA"
                />
            <h2 class="text-h5 mt-8 mb-4">{{ $t('tasksBtn') }}</h2>
            <v-data-table
                class="rounded-lg mt-8 pl-4 pr-4 small-columns"
                :items="tasksBasic"
                :search="search"
                :items-per-page-options="itemsPerPageOptionsT"
                :items-per-page="itemsPerPageT"
                :page="pageT"
                /> 
        </div>
    </client-only>
</template>

<script setup>
import { useServers } from '~/composable/useServers';
import { useApplications } from '~/composable/useApplications';
import { useTasks } from '~/composable/useTasks';
// import headersNames from '../assets/data/headers.json';


    const { getApplicationsBasic } = await useApplications();
    const applicationsBasic = await getApplicationsBasic();
    const { getTasksBasic } = await useTasks();
    const tasksBasic = await getTasksBasic();
    const { getServersBasic } = await useServers();    
    const serversBasic = await getServersBasic();

    const { locale } = useI18n();

    const { data: paggination } = await useFetch('/api/Swevew/paggination')

    const pageS = ref(1);
    const itemsPerPageS = computed(() => paggination.value?.itemsPerPage ?? 10);
    const itemsPerPageOptionsS = computed(() => paggination.value?.itemsPerPageOptions ?? [5, 10, 20, 50]);

    const pageA = ref(1);
    const itemsPerPageA = computed(() => paggination.value?.itemsPerPage ?? 10);
    const itemsPerPageOptionsA = computed(() => paggination.value?.itemsPerPageOptions ?? [5, 10, 20, 50]);

    const pageT = ref(1);
    const itemsPerPageT = computed(() => paggination.value?.itemsPerPage ?? 10);
    const itemsPerPageOptionsT = computed(() => paggination.value?.itemsPerPageOptions ?? [5, 10, 20, 50]);

    const settings = ref(null);

    
    const search = ref('')


    // const displayedHeaders = headersNames.map(h => ({
    //     ...h,
    //     title: h.title[locale.value] 
    // }));

    // const headers = ref([{title: 'Id', key: "id"}, ...displayedHeaders.slice(0, 1)]);


</script>

<style scoped>

</style>