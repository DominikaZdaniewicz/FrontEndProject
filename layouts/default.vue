<template>
    <v-app-bar>
        <v-app-bar-title>
            <h3
                class="text-decoration-none text-white">
                {{ $t("title") }}
            </h3> 
        </v-app-bar-title>       
        <add-edit-user
            :mode="dialogMode"
            :model-user-value="formUser"
            @save-user="handleSaveUser"
            @cancel-user="formUser = null"/>
        <edit-logged-user
            v-if="loggedUser"
            :mode="dialogMode"
            :model-user-value="loggedUser"
            :dialogOpen="dialogUserOpen"
            @update:dialogOpen="val => dialogUserOpen = val"
            @save-user="handleSaveLoggedUser"
            @cancel-user="() => 
            {
                loggedUser = null;
                dialogUserOpen = false;
            }"
            />
        <div 
            class="d-flex justify-end align-center log-out">
            <v-btn 
                prepend-icon="mdi-logout"
                @click.prevent="logout"
                type="submit"
                class="ml-4 bg-surface-variant">
                {{ $t("signOutBtn") }}
            </v-btn>
        </div>
    </v-app-bar>
    <v-main>
        <v-container
            class="w-66 my-2">
            <div class="d-flex align-center justify-space-between mb-4">
                <v-tabs
                    class="d-flex align-center">
                    <v-btn variant="text" :to="localPath('/servers')">{{ $t("serversBtn") }}</v-btn>
                    <v-btn variant="text" :to="localPath('/applications')">{{ $t("applicationsBtn") }}</v-btn>
                    <v-btn variant="text" :to="localPath('/tasks')">{{ $t("tasksBtn") }}</v-btn>
                    <v-btn variant="text" :to="localPath('/basicInfo')" cliked = false>{{ $t("basicInfo") }}</v-btn>
                </v-tabs>
                <div>
                    <v-btn
                        v-if="isAdmin"
                        icon
                        :width="40"
                        :height="40"
                        to="/users">
                        <v-icon size="20">mdi-account-group-outline</v-icon>
                    </v-btn>
                    <v-btn
                        icon
                        :width="40"
                        :height="40"
                        @click="openEditLoggedUser(loggedUser)"
                        class="ml-4">
                        <v-icon size="20">mdi-account-cog-outline</v-icon>
                    </v-btn>
                </div>
            </div>
                <v-spacer />
            <NuxtPage/>
            <LangSwitch class="mt-8 d-flex justify-end "/>
        </v-container>
        
    </v-main>
</template>

<script setup>
import { useUsers } from '~/composable/useUsers';

    const localPath = useLocalePath();

    const { signOut, data } = useAuth();
    
    const { updateUser, getLoggedUser } = useUsers();

    const handleSaveUser = async (userData) => {
        await updateUser(userData);
        dialogUserOpen.value = false;
    };

    const handleSaveLoggedUser = async (userData) => {
        await updateUser(userData);
        dialogUserOpen.value = false;
    };
    
    const logout = async () => {
        await signOut({
            callbackUrl: localPath('/auth/login')
        })
    }
    
    const isAdmin = computed(() => {
        return data.value?.roles?.includes("administrator")
    })

    const dialogMode = ref('add');
    const dialogUserOpen = ref(false);
    const formUser = ref(null);
    const loggedUser = ref(null);

    const openEditLoggedUser = async () => {   
        dialogMode.value = 'edit';

        loggedUser.value = null;

        const res = await getLoggedUser();
        loggedUser.value = { ...(res.data || res) };

        dialogUserOpen.value = true;
    };

</script>

<style>

    .v-data-table-header__content {
        font-weight: 600;
        color: #ffffff;
        letter-spacing: 1px;   
    }

    .v-data-table__th {
        border-bottom: 1px solid rgb(255, 255, 255) !important;
    }

    .v-data-table__td {
        width: 20%;
    }

    .v-toolbar {
        position: relative;
    }

    .v-toolbar-title {
        position: absolute;
        left: 17%;
    }

    .lang-switch {
        position: absolute;
        right: 18%;
        margin-bottom: 6px;
    }
    
    .log-out {
        position: absolute;
        right: 18%;
    }    

</style>