<template>
    <h3 class="my-8"> {{ $t('userProfile') }}: {{ currentUser.username }}</h3>
    <div class="d-flex">
        <v-btn
            prepend-icon="mdi-account-edit"
            variant="text"
            class="mr-2"
            :class="{ activeBtn: selectedTab === 'profile' }"
            @click="selectedTab = 'profile'">
            {{ $t('editProfile') }}
        </v-btn>
        <v-btn
            prepend-icon="mdi-email-outline"
            variant="text"
            :class="{ activeBtn: selectedTab === 'email' }"
            @click="selectedTab = 'email'">
            {{ $t('emailList') }}
        </v-btn>
    </div>
    <v-card
        v-if="selectedTab === 'profile'">
        <v-card-text>
            <v-text-field
                class="mt-6"
                v-model="currentUser.username"
                :label="$t('userName')"
                :error-messages="usernameError"
            ></v-text-field> 
            <v-text-field
                v-model="currentUser.firstname"
                :label="$t('firstName')">
            </v-text-field>
            <v-text-field
                v-model="currentUser.lastname"
                :label="$t('lastName')">
            </v-text-field>
            <v-text-field
                v-model="currentUser.email"
                :label="$t('email')">
            </v-text-field>
            <v-text-field
                v-model="currentUser.phoneNumber"
                :label="$t('phoneNumber')">
            </v-text-field>
            <v-select 
                v-if="isAdmin"
                v-model="currentUser.roles"
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
    <v-card
        v-else
        class = "px-6 py-6 d-flex flex-column justify-start align-start">     
        <v-select
            v-model="emailContent"
            hide-details
            class="mr-6"
            width="200"
            :items="emailOptions"
            item-title="title"
            item-value="value"/>
        <v-data-table
            class="rounded-lg mt-8 pl-4 pr-4 small-columns"
            :items="emailContent === 'inbox' ? inboxEmails : outboxEmails"
            :headers="headers"
            :items-per-page-options="[5, 10, 25]"
            v-model:items-per-page="itemsPerPage">
            <template #item.sentAt="{ value }">
                {{ formatDate(value) }}
            </template>
            <template #item.actions="{ item }" class="d-flex justify-end">
                 <div 
                    class="d-flex justify-end align-center">
                    <v-btn 
                        @click.prevent="openEmail(item)"
                        class="text-lowercase"
                        variant="outlined"
                        size="small">
                        {{ $t("seeDetails") }}
                    </v-btn>
                </div>
            </template>
        </v-data-table>
        <v-dialog 
            v-model="dialogOpenEmail" 
            max-width="500">
                <v-card
                    prepend-icon="mdi-email-outline" 
                    :text="selectedEmail.subject">
                    <h5
                        class="mx-6"> {{ selectedEmail.body }} </h5>
                    <template #actions>
                        <v-card-text>
                            <div
                                class="d-flex justify-end mt-4">
                                <v-btn @click="dialogOpenEmail = false">{{ $t('close') }}</v-btn>
                            </div>
                        </v-card-text>
                    </template>
                </v-card>
        </v-dialog>
    </v-card>
</template>

<script setup>
import { useUsers } from '~/composable/useUsers';
import { useEmails } from '~/composable/useEmails';

    const { getEmailToUser, getEmailFromUser } = useEmails();

    const props = defineProps({
        modelUserValue: Object,
        dialogOpen: Boolean
    })

    const { data } = useAuth();
    const { changeUserPassword, updateUser } = useUsers();

    const emit = defineEmits(['save-user', 'cancel-user', 'update:dialogOpen']);

    const dialogChange = ref(false);
    const selectedEmail = ref(null)
    const dialogOpenEmail = ref(false)

    const openEmail = (item) => {
        selectedEmail.value = item
        dialogOpenEmail.value = true
    }    
    const currentUser = ref({ });
    const roles = [
        { name: 'Administrator', value: 'administrator' },
        { name: 'User', value: 'user' }
    ];

    const emailOptions = [
        { value: 'inbox', title: $t('inbox') },
        { value: 'outbox', title: $t('outbox') }
    ];
    const emailContent = ref('inbox');
    
    const itemsPerPage = ref(5);
    
    const inboxEmails = ref([]);
    const outboxEmails = ref([]);

    const formatDate = (dateString) => {
      if (!dateString) return "-"

      return new Date(dateString).toLocaleDateString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
      })
    };

    const headers = [
        { title: $t('emailFrom'), key: 'from', sortable: true }, 
        { title: $t('emailSubject'), key: 'subject', sortable: true }, 
        { title: $t('dateOfSending'), key: 'sentAt', sortable: true },
        { title: '', key: 'actions', sortable: false }]

    const usernameError = ref('')
    const oldPasswordError = ref('')
    const newPasswordError = ref('')    
    
    const oldPassword = ref('')
    const newPassword = ref('')

    const selectedTab = ref('profile');

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
                currentUser.value.userId,
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

    // watch(
    // () => props.modelUserValue,
    //     async (user) => {
    //         console.log("USER:", user);

    //         if (!user?.email) {
    //         console.log("BRAK EMAILA");
    //         return;
    //         }

    //         console.log("EMAIL:", user.email);

    //         const inbox = await getEmailToUser(user.email);
    //         const outbox = await getEmailFromUser(user.email);

    //         console.log("INBOX:", inbox);

    //         inboxEmails.value = inbox;
    //         outboxEmails.value = outbox;
    //     },
    //     { immediate: true }
    // );

    watch(
        () => data.value,
        async (user) => {
            console.log("AUTH USER:", user);

            if (!user) return;

            currentUser.value = user;

            if (!user.email) {
            console.log("BRAK EMAILA");
            return;
            }

            console.log("EMAIL:", user.email);

            inboxEmails.value = await getEmailToUser(user.email);
            outboxEmails.value = await getEmailFromUser(user.email);
        },
        { immediate: true }
    );

    // watch(
    //     () => props.modelUserValue,
    //     (val) => {
    //         if (val) {
    //         currentUser.value = { ...val };
    //         }
    //     },
    //     { immediate: true }
    // );

    // watch(
    //     () => currentUser.value.username,
    //     (newVal) => {
    //         if (newVal?.trim()) {
    //             usernameError.value = ''
    //         }
    //     }
    // )

    watch(oldPassword, (val) => {
        if (val?.trim()) oldPasswordError.value = ''
    })

    watch(newPassword, (val) => {
        if (val?.trim()) newPasswordError.value = ''
    })

    const saveUser= () => {
        if (!currentUser.value.username?.trim()) {
            usernameError.value = $t('nameError');
            return 
        }
        emit('save-user', currentUser.value)
        dialogOpenUsers.value = false;
        usernameError.value = ''
    }

    const deleteUser = () => {
        emit('cancel-user')
        dialogOpenUsers.value = false;
    }

</script>

<style scoped>
    .activeBtn {
        background-color: #212121 !important;
        color: white !important;
        border-radius: 4px 4px 0 0 !important;
    }
</style>