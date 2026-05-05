<template>
    <client-only>
        <div class="mt-8">
            <search-bar :label="$t('search')" v-model="search" />
        </div>
        <div class="d-flex align-center justify-space-between mb-6 mt-8">
            <h2 class="text-h5">{{ $t('serversBtn') }}</h2>
            <v-btn
                @click="openExportServers">
                {{ $t('export') }}
            </v-btn>
        </div>
        <v-dialog v-model="dialogServersExport" max-width="500">
            <v-card
                prepend-icon="mdi-alert"
                :text="$t('exportMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialogServersExport = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmExportServers">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-data-table-server
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :headers="headers"
            :items="servers"
            :search="search"
            v-model:items-per-page="itemsPerPageS"
            :items-per-page-options="itemsPerPageOptionsS"
            :items-length="totalItemsS"
            v-model:page="pageS"
            v-model:sort-by="sortByBasicS"
            multi-sort/>
        <div class="d-flex align-center justify-space-between mb-6 mt-8">
            <h2 class="text-h5">{{ $t('applicationsBtn') }}</h2>
            <v-btn
                @click="openExportApplications">
                {{ $t('export') }}
            </v-btn>
        </div>
        <v-dialog v-model="dialogApplicationsExport" max-width="500">
            <v-card
                prepend-icon="mdi-alert"
                :text="$t('exportMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialogApplicationsExport = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmExportApplications">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-data-table-server
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :headers="headers"
            :items="applications"
            :search="search"
            :items-per-page-options="itemsPerPageOptionsA"
            v-model:items-per-page="itemsPerPageA"
            :items-length="totalItemsA"
            v-model:page="pageA"
            v-model:sort-by="sortByBasicA"
            multi-sort/> 
        <div class="d-flex align-center justify-space-between mb-6 mt-8">
            <h2 class="text-h5">{{ $t('tasksBtn') }}</h2>
            <v-btn
                @click="openExportTasks">
                {{ $t('export') }}
            </v-btn>
        </div>
        <v-dialog v-model="dialogTasksExport" max-width="500">
            <v-card
                prepend-icon="mdi-alert"
                :text="$t('exportMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialogTasksExport = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmExportTasks">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-data-table-server
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :headers="headers"
            :items="tasks"
            :search="search"
            :items-per-page-options="itemsPerPageOptionsT"
            v-model:items-per-page="itemsPerPageT"
            :items-length="totalItemsT"
            v-model:page="pageT"
            v-model:sort-by="sortByBasicT"
            multi-sort/> 
        <div class="d-flex align-center justify-space-between mb-6 mt-8">
            <h2 class="text-h5">{{ $t('ownersBtn') }}</h2>
            <v-btn
                @click="openExportOwners">
                {{ $t('export') }}
            </v-btn>
        </div>
        <v-dialog v-model="dialogOwnersExport" max-width="500">
            <v-card
                prepend-icon="mdi-alert"
                :text="$t('exportMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialogOwnersExport = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmExportOwners">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-data-table-server
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :headers="headers"
            :items="owners"
            :search="search"
            :items-per-page-options="itemsPerPageOptionsO"
            v-model:items-per-page="itemsPerPageO"
            v-model:page="pageO"
            :items-length="totalItemsO"
            v-model:sort-by="sortByBasicO"
            multi-sort/> 
    </client-only>
</template>

<script setup>
import { useServers } from '~/composable/useServers';
import { useApplications } from '~/composable/useApplications';
import { useTasks } from '~/composable/useTasks';
import { useOwners } from '~/composable/useOwners';

    const { paginationBasicApplication, getExportBasicApplications } = useApplications();
    const { paginationBasicTask, getExportBasicTasks } = useTasks();
    const { paginationBasicServer, getExportBasicServers } = useServers();    
    const { paginationBasicOwner, getExportBasicOwners } = useOwners()

    const { locale } = useI18n();

    const sortByBasicS = ref([])
    const sortByBasicA = ref([])
    const sortByBasicT = ref([])
    const sortByBasicO = ref([])

    const dialogServersExport = ref(false)
    const dialogApplicationsExport = ref(false)
    const dialogTasksExport = ref(false)
    const dialogOwnersExport = ref(false)

    const headers = [{ title: 'Id', key: 'id', sortable: true }, { title: $t('nameHeader'), key: 'name', sortable: true }]

    const openExportServers = () => {
        dialogServersExport.value = true
    }
    const openExportApplications = () => {
        dialogApplicationsExport.value = true
    }
    const openExportTasks = () => {
        dialogTasksExport.value = true
    }
    const openExportOwners = () => {
        dialogOwnersExport.value = true
    }

    const confirmExportServers = async () => {
        await getExportBasicServers()
        dialogServersExport.value = false
    }
    const confirmExportApplications = async () => {
        await getExportBasicApplications()
        dialogApplicationsExport.value = false
    }
    const confirmExportTasks = async () => {
        await getExportBasicTasks()
        dialogTasksExport.value = false
    }
    const confirmExportOwners = async () => {
        await getExportBasicOwners()
        dialogOwnersExport.value = false
    }
    
    const pageS = ref(1)
    const pageA = ref(1)
    const pageT = ref(1)
    const pageO = ref(1)

    const itemsPerPageS = ref(5)
    const itemsPerPageA = ref(5)
    const itemsPerPageT = ref(5)
    const itemsPerPageO = ref(5)

    const paginationS = ref(null)
    const paginationA = ref(null)
    const paginationT = ref(null)
    const paginationO = ref(null)

    const search = ref('')

    const totalItemsS = computed(() => paginationS.value?.numberOfServers ?? 0)
    const totalItemsA = computed(() => paginationA.value?.numberOfApplications ?? 0)
    const totalItemsT = computed(() => paginationT.value?.numberOfTasks ?? 0)
    const totalItemsO = computed(() => paginationO.value?.numberOfOwners ?? 0)

    const resolvedPageSizeS = computed(() => itemsPerPageS.value === 'all' ? totalItemsS.value || 5 : itemsPerPageS.value);
    const resolvedPageSizeA = computed(() => itemsPerPageA.value === 'all' ? totalItemsA.value || 5 : itemsPerPageA.value);
    const resolvedPageSizeT = computed(() => itemsPerPageT.value === 'all' ? totalItemsT.value || 5 : itemsPerPageT.value);
    const resolvedPageSizeO = computed(() => itemsPerPageO.value === 'all' ? totalItemsO.value || 5 : itemsPerPageO.value);

    const servers = computed(() => paginationS.value?.serversPerPage ?? [])
    const applications = computed(() => paginationA.value?.appsPerPage ?? [])
    const tasks = computed(() => paginationT.value?.tasksPerPage ?? [])
    const owners = computed(() => paginationO.value?.ownersPerPage ?? [])

    const itemsPerPageOptionsS = computed(() => [{ value: 5, title: 5 }, { value: 10, title: 10 }, { value: totalItemsS.value, title: $t('all') }]);
    const itemsPerPageOptionsA = computed(() => [{ value: 5, title: 5 }, { value: 10, title: 10 }, { value: totalItemsA.value, title: $t('all') }]);
    const itemsPerPageOptionsT = computed(() => [{ value: 5, title: 5 }, { value: 10, title: 10 }, { value: totalItemsT.value, title: $t('all') }]);
    const itemsPerPageOptionsO = computed(() => [{ value: 5, title: 5 }, { value: 10, title: 10 }, { value: totalItemsO.value, title: $t('all') }]);

    const reloadPageS = async () => {
        paginationS.value = await paginationBasicServer(pageS.value, resolvedPageSizeS.value, search.value, sortByBasicS.value)
    }
    const reloadPageA = async () => {
        paginationA.value = await paginationBasicApplication(pageA.value, resolvedPageSizeA.value, search.value, sortByBasicA.value)
    }
    const reloadPageT = async () => {
        paginationT.value = await paginationBasicTask(pageT.value, resolvedPageSizeT.value, search.value, sortByBasicT.value)
    }
    const reloadPageO = async () => {
        paginationO.value = await paginationBasicOwner(pageO.value, resolvedPageSizeO.value, search.value, sortByBasicO.value)
    }

    watch(
        [pageS, resolvedPageSizeS, search],
        async () => {
            await reloadPageS()
        },
        { immediate: true }
    )

    watch(
        [pageA, resolvedPageSizeA, search],
        async () => {
            await reloadPageA()
        },
        { immediate: true }
    )

    watch(
        [pageT, resolvedPageSizeT, search],
        async () => {
            await reloadPageT()
        },
        { immediate: true }
    )

    watch(
        [pageO, resolvedPageSizeO, search],
        async () => {
            await reloadPageO()
        },
        { immediate: true }
    )
    
    watch(
        [search, sortByBasicS],
        async () => {
            pageS.value = 1
            await reloadPageS()
        }
    )

    watch(
        [search, sortByBasicA],
        async () => {
            pageA.value = 1
            await reloadPageA()
        }
    )

    watch(
        [search, sortByBasicT],
        async () => {
            pageT.value = 1
            await reloadPageT()
        }
    )

    watch(
        [search, sortByBasicO],
        async () => {
            pageO.value = 1
            await reloadPageO()
        }
    )

</script>

<style scoped>

</style>