<template>
    <v-dialog v-model="dialogOpenUsers" max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">{{$t("editText") }} {{$t("account")}}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="mb-2"
                    v-model="loggedUser.username"
                    :label="$t('user')"
                    :error-messages="usernameError"
                ></v-text-field> 
                <v-text-field
                    v-model="loggedUser.firstname"
                    :label="$t('firstName')">
                </v-text-field>
                <v-text-field
                    v-model="loggedUser.lastname"
                    :label="$t('lastName')">
                </v-text-field>
                <v-text-field
                    v-model="loggedUser.email"
                    :label="$t('email')">
                </v-text-field>
                <v-text-field
                    v-model="loggedUser.phoneNumber"
                    :label="$t('phoneNumber')">
                </v-text-field>
                <v-select 
                    v-if="isAdmin"
                    v-model="loggedUser.roles"
                    :items="roles"
                    item-title="name"
                    item-value="value"
                    :label="$t('roles')"
                ></v-select>
                <v-dialog 
                    v-model="dialogChange" 
                    max-width="500">
                    <template #activator="{ props }">
                        <v-btn
                            v-bind="props"
                            prepend-icon="mdi-pencil"
                            variant="text"
                            @click="openChangeDialog()">
                            {{ $t('changePassword') }}
                        </v-btn>
                    </template>
                    <v-card
                        prepend-icon="mdi-pencil" 
                        :text="$t('changePassword')">
                        <h5
                            class="mx-6"> {{ $t('passwordMsg') }} </h5>
                        <template #actions>
                            <v-card-text>
                                <v-text-field
                                    v-model="oldPassword"
                                    :label="$t('oldPassword')"
                                    :error-messages="oldPasswordError"/>
                                <v-text-field
                                    v-model="newPassword"
                                    :label="$t('newPassword')"
                                    :error-messages="newPasswordError"/>
                                <div
                                    class="d-flex justify-end mt-4">
                                    <v-btn @click="dialogChange = false">{{ $t('cancel') }}</v-btn>
                                    <v-btn class="bg-surface-variant" @click="confirmChange">
                                    {{ $t('saveEditText') }}
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </template>
                    </v-card>
                </v-dialog>
            </v-card-text>
            <v-btn 
                class="bg-surface-variant mx-6" 
                @click="saveUser"> 
                {{$t("saveEditText")}} 
            </v-btn>
            <v-btn 
                text 
                class="mx-6 my-4" 
                @click="deleteUser">
                {{ $t('cancel') }}
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useUsers } from '~/composable/useUsers';

    const props = defineProps({
        modelUserValue: Object,
        dialogOpen: Boolean
    })

    const { data } = useAuth();
    const { changeUserPassword, updateUser } = useUsers();

    const emit = defineEmits(['save-user', 'cancel-user', 'update:dialogOpen']);

    const dialogOpenUsers = ref(false);
    const dialogChange = ref(false);

    const loggedUser = ref({ ...props.modelUserValue });

    const roles = [
        { name: 'Administrator', value: 'administrator' },
        { name: 'User', value: 'user' }
    ];

    const usernameError = ref('')
    const oldPasswordError = ref('')
    const newPasswordError = ref('')    
    
    const oldPassword = ref('')
    const newPassword = ref('')

    const openChangeDialog = () => {
        dialogChange.value = true;
    };

    const isAdmin = computed(() => {
        return data.value?.roles?.includes("administrator")
    })

    const confirmChange = async () => {
        try {
            if (!oldPassword.value || !newPassword.value) {
                oldPasswordError.value = !oldPassword.value ? 'Required' : '';
                newPasswordError.value = !newPassword.value ? 'Required' : '';
                return;
            }

            await changeUserPassword(
                loggedUser.value.userId,
                oldPassword.value,
                newPassword.value
            );

            console.log("Hasło zmienione");

            oldPassword.value = '';
            newPassword.value = '';
            dialogChange.value = false;

        } catch (e) {
            console.error("Błąd:", e);
        }
    };

    watch(
        () => props.modelUserValue,
        (val) => {
            if (val) {
            loggedUser.value = { ...val };
            }
        },
        { immediate: true }
    );

    watch(
        () => loggedUser.value.userName,
        (newVal) => {
            if (newVal?.trim()) {
                usernameError.value = ''
            }
        }
    )

    watch(
        () => oldPasswordError.value,
        (newVal) => {
            if (newVal?.trim()) {
                oldPasswordError.value = ''
            }
        }
    )

    watch(
        () => newPasswordError.value,
        (newVal) => {
            if (newVal?.trim()) {
                newPasswordError.value = ''
            }
        }
    )

    watch(
        () => props.dialogOpen,
        (val) => {
            dialogOpenUsers.value = val;
        },
        { immediate: true }
    )

    const saveUser= () => {
        if (!loggedUser.value.username?.trim()) {
            usernameError.value = $t('nameError');
            return 
        }
        emit('save-user', loggedUser.value)
        dialogOpenUsers.value = false;
        usernameError.value = ''
    }

    const deleteUser = () => {
        emit('cancel-user')
        dialogOpenUsers.value = false;
    }

</script>