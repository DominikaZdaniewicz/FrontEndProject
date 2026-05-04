<template>
    <client-only>
        <div class="mt-8">
            <search-bar :label="$t('search')" v-model="search" />
        </div>
        <div> {{ console.log('servers', servers) }}</div>
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
        <v-data-table
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :items="servers"
            :search="search"
            :items-per-page-options="itemsPerPageOptions"
            :items-per-page="itemsPerPageS"
            :page="pageS"
            />
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
        <v-data-table
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :items="applications"
            :search="search"
            :items-per-page-options="itemsPerPageOptions"
            :items-per-page="itemsPerPageA"
            :page="pageA"
            />
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
        <v-data-table
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :items="tasks"
            :search="search"
            :items-per-page-options="itemsPerPageOptions"
            :items-per-page="itemsPerPageT"
            :page="pageT"
            /> 
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
        <v-data-table
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :items="owners"
            :search="search"
            :items-per-page-options="itemsPerPageOptions"
            :items-per-page="itemsPerPageO"
            :page="pageO"
            /> 
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

    const dialogServersExport = ref(false)
    const dialogApplicationsExport = ref(false)
    const dialogTasksExport = ref(false)
    const dialogOwnersExport = ref(false)
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

    const itemsPerPageOptions = [{ value: 5, title: 5 }, { value: 15, title: 15 }, { value: 'all', title: $t('all') }];

    const reloadPage = async () => {
        paginationS.value = await paginationBasicServer(pageS.value, resolvedPageSizeS.value, search.value)
        paginationA.value = await paginationBasicApplication(pageA.value, resolvedPageSizeA.value, search.value)
        paginationT.value = await paginationBasicTask(pageT.value, resolvedPageSizeT.value, search.value)
        paginationO.value = await paginationBasicOwner(pageO.value, resolvedPageSizeO.value, search.value)
    }

    watch(
        [pageS, resolvedPageSizeS, pageA, resolvedPageSizeA, pageT, resolvedPageSizeT, pageO, resolvedPageSizeO],
        async () => {
            await reloadPage()
        },
        { immediate: true }
    )

</script>

<style scoped>

</style>