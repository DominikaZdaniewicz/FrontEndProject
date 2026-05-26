<template>
    <client-only
        v-if="isAdmin">
        <add-edit-user
            :mode="dialogMode"
            :model-user-value="formUser"
            :dialog-open="dialogUserOpen"
            @update:dialogOpenUser="dialogUserOpen = $event"
            @save-user="handleSaveUser"
            @cancel-user="dialogUserOpen = false"/>
        <div class="mb-4 d-flex align-center">
            <v-btn 
                prepend-icon="mdi-filter-outline"
                class="py-7 mr-8 d-flex justify-end"
                @click="filterMenu = !filterMenu">
                {{ $t('filter') }}
            </v-btn>
            <div class="w-100">
                <search-bar
                    class="flex-grow-1"
                    :label="$t('search')" 
                    v-model="search" />
            </div>
        </div>
        <div v-if="!filterMenu" class="d-flex align-center justify-end mb-4 w-50">
            <v-select
                v-model="filterIsAdmin"
                hide-details
                class="mr-6"
                :items="[
                { value: 'all', title: $t('all') },
                { value: 'user', title: $t('users') },
                { value: 'administrator', title: $t('administrator') },]"/>
        </div>
        <div class="d-flex align-center justify-space-between mb-6 mt-8">
            <h2 class="text-h5">{{ $t('users') }}</h2>
            <div class="d-flex justify-end mb-6 mt-8">    
                <v-btn
                    @click="openExportUsers">
                    {{ $t('export') }}
                </v-btn>
                <v-btn 
                    prepend-icon="mdi-plus"
                    class="ml-8 bg-surface-variant" 
                    @click="openAddUser">
                    {{ $t("addUser") }}
                </v-btn>
            </div>
        </div>
        <v-dialog v-model="dialogExport" max-width="500">
            <v-card
                prepend-icon="mdi-export"
                :text="$t('exportMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="dialogExport = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="confirmExportUsers">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-data-table-server
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :items="users"
            :headers="headers"
            :items-per-page-options="itemsPerPageOptions"
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :items-length="totalItems"
            v-model:sort-by="sortBy"
            multi-sort> 
            <template #item.roles="{ item }">
                {{ item.roles.join(', ') }}
            </template>
            <template #item.actions="{ item }">
                <div class="d-flex justify-end">
                <v-btn
                    icon="mdi-pencil"
                    @click="openEditUser(item)"
                    size="40"
                    flat/>
                <v-dialog v-model="dialogDelete" max-width="500">
                    <template #activator="{ props }">
                        <v-btn
                            v-bind="props"
                            icon="mdi-delete"
                            variant="text"
                            :size="40"
                            :title="$t('delete')"
                            @click="openDeleteDialog(item.userId)"/>
                    </template>
                    <v-card prepend-icon="mdi-alert" :text="$t('deleteMsg')">
                        <template #actions>
                            <v-spacer />
                            <v-btn @click="dialogDelete = false"> {{ $t('no') }} </v-btn>
                            <v-btn class="bg-surface-variant" @click="confirmDelete"> {{ $t('yes') }} </v-btn>
                        </template>
                    </v-card>
                </v-dialog>
                </div>
            </template>
        </v-data-table-server>
    </client-only>
</template>

<script setup>

import { useUsers } from '~/composable/useUsers';

    const { data } = useAuth();
    const { addUser, updateUser, paginationUser, removeUser, getExportUsers } = useUsers();

    const { t } = useI18n();

    const dialogUsersExport = ref(false)

    const search = ref('')

    const filterMenu = ref(true)

    const filterIsAdmin = ref('all')

    const sortBy = ref([])

    const dialogMode = ref('add');
    const dialogUserOpen = ref(false);
    const formUser = ref(null);
    const dialogDelete = ref(false);
    const userToDelete = ref(null);
    const dialogExport = ref(false)


    const headers = [
        { title: $t('userName'), key: 'userName', sortable: true }, 
        { title: $t('email'), key: 'email', sortable: true }, 
        { title: $t('phoneNumber'), key: 'phoneNumber', sortable: true }, 
        { title: $t('roles'), key: 'roles', sortable: true },
        { title: '', key: 'actions', sortable: false }]

    const isAdmin = computed(() => {
        return data.value?.roles?.includes("administrator")
    })

    const page = ref(1)

    const itemsPerPage = ref(10)

    const pagination = ref(null)

    const totalItems = computed(() => pagination.value?.totalUsers  ?? 0)

    const resolvedPageSize = computed(() => itemsPerPage.value === 'all' ? totalItems.value || 10 : Number(itemsPerPage.value))
    
    const users = computed(() => {
        const list = pagination.value?.users ?? []
        const currentUserId = data.value?.userId

        return list.filter(u => u.userId !== currentUserId)
    })

    const itemsPerPageOptions = computed(() => [{ value: 10, title: 10 }, { value: 20, title: 20 }, { value: totalItems.value, title: $t('all') }]);

    // const reloadPage = async () => {
    //     pagination.value = await paginationUser(page.value, resolvedPageSize.value, search.value, filterIsAdmin.value, sortBy.value)
    // }

    const reloadPage = async () => {
        const response = await paginationUser(
            page.value,
            resolvedPageSize.value,
            search.value,
            filterIsAdmin.value,
            sortBy.value
        )

        pagination.value = {
            users: response.productPerPage.map(u => ({
                ...u,
                userId: u.id,
                roles: u.roles ? [u.roles] : []
            })),
            totalUsers: response.numberOfUsers
        }
    }

    const openAddUser = () => {
        dialogMode.value = 'add';
        formUser.value = {
            userId: '',
            userName: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            roles: ''
        };
        dialogUserOpen.value = true;
    }; 

    const openEditUser = (user) => {
        dialogMode.value = 'edit'
        formUser.value = { ...user }
        dialogUserOpen.value = true
    }

    const handleSaveUser = async userData => {
        if (dialogMode.value === 'edit') {
            await updateUser(userData);
        } else {
            await addUser(userData);
        }
        await reloadPage()
        dialogUserOpen.value = false;
    };

    const openExportUsers = () => {
        dialogExport.value = true
    }

    const confirmExportUsers = async () => {
        await getExportUsers()
        dialogExport.value = false
    }

    const openDeleteDialog = userId => {
        userToDelete.value = userId;
        dialogDelete.value = true;
    };
    
    const confirmDelete = async () => {
        await removeUser(userToDelete.value);
        dialogDelete.value = false;
        userToDelete.value = null;
        await reloadPage()
    };

    watch(
        [page, resolvedPageSize],
        async () => {
            await reloadPage()
        },
        { immediate: true }
    )

    watch(
        [search, filterIsAdmin, sortBy],
        async () => {
            page.value = 1
            await reloadPage()
        }
    )

</script>

<style scoped>

</style>