<template>
    <v-dialog v-model="dialogOpenEmailUsers" max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">{{ $t('emailUser') }}</v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="localUser.userName"
                    :label="$t('userName')"
                    readonly
                    variant="plain"
                ></v-text-field>
                <v-text-field
                    v-model="localUser.email"
                    :label="$t('email')"
                    readonly
                    variant="plain"/>
                <v-text-field
                    v-model="emailSubject"
                    :label="$t('emailSubject')"
                    :error-messages="emailSubjectError">
                </v-text-field>
                <v-textarea
                    v-model="emailBody"
                    :label="$t('emailBody')"
                    :error-messages="emailBodyError">
                </v-textarea>
            </v-card-text>
            <v-btn 
                class="bg-surface-variant mx-6" 
                @click="handleSendEmail"> 
                {{ $t('send') }} 
            </v-btn>
            <v-dialog v-model="sendEmailDialog" max-width="500">
            <v-card
                prepend-icon="mdi-export"
                :text="$t('exportMsg')">
                <template #actions>
                    <v-spacer />
                    <v-btn
                        @click="sendEmailDialog = false">
                        {{ $t('no') }}
                    </v-btn>
                    <v-btn
                        class="bg-surface-variant"
                        @click="handleSendEmail">
                        {{ $t('yes') }}
                    </v-btn>
                </template>
            </v-card>
        </v-dialog>
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
import { useEmails } from '~/composable/useEmails';
import { useUsers } from '~/composable/useUsers';

    const { data } = useAuth();
    const { sendEmailToTask } = useEmails();
    const { getUser } = useUsers();

    const localPath = useLocalePath();

    const props = defineProps({
        modelUserValue: Object,
        dialogOpen: Boolean,
        taskId: String
    })

    const emit = defineEmits(['save-user', 'cancel-user'])

    const dialogOpenEmailUsers = ref(false);

    const isEditing = computed(() => !!props.modelUserValue?.id)

    // const emptyUser = {
    //     id: '',
    //     userName: '',
    //     firstName: '',
    //     lastName: '',
    //     email: '',
    //     phoneNumber: '',
    //     roles: []
    // }

    const roles = [
        { name: 'Administrator', value: 'administrator' },
        { name: 'User', value: 'user' }
    ];

    const localUser = ref({})

    const usernameError = ref([])
    const passwordError = ref([])

    const sendEmailDialog = ref(false)
    const emailBody = ref('')   
    const emailSubject = ref('')
    const emailBodyError = ref('')
    const emailSubjectError = ref('')

    const handleSendEmail = async () => {
        try {
            if (!emailSubject.value.trim()) {
                emailSubjectError.value = "Subject required"
                return
            }

            if (!emailBody.value.trim()) {
                emailBodyError.value = "Body required"
                return
            }

            await sendEmailToTask(
                props.taskId,
                emailSubject.value,
                emailBody.value
            )

            dialogOpenEmailUsers.value = false

            sendEmailDialog.value = false
            emailSubject.value = ''
            emailBody.value = ''

            console.log("Email sent")

        } catch (error) {
            console.error("Send failed", error)
        }
    };

    // const sendEmail = () => {
    //     if (!emailSubject.value?.trim()) {
    //         // emailSubjectError.value = [$t('emailSubjectError')];
    //         return 
    //     }
    //     if (!emailBody.value?.trim()) {
    //         // emailBodyError.value = [$t('emailBodyError')];
    //         return 
    //     }

    //     const payload = {
    //         userId: localUser.value.id,
    //         subject: emailSubject.value,
    //         body: emailBody.value
    //     }

    //     // emit('save-user', payload)
    //     sendEmailDialog.value = false;
    //     emailBody.value = ''
    //     emailSubject.value = '' 
    // }

    watch(
        () => props.modelUserValue,
        (val) => {

            if (!val) {
                localUser.value = { ...data.value } 
                dialogOpenEmailUsers.value = false
                return
            }

            localUser.value = { ...val }

            dialogOpenEmailUsers.value = true
        },
        { immediate: true }
    )


    // watch(
    //     () => props.modelUserValue,
    //     async (val) => {
                        
    //         if (val === null) {
    //             dialogOpenEmailUsers.value = false
    //             localUser.value = { ...emptyUser }
    //             return
    //         }

    //         dialogOpenEmailUsers.value = !!val;
   
    //         if (val?.id) {
    //             localUser.value = { ...emptyUser, ...val }
    //         } else {
    //             localUser.value = { ...emptyUser }
    //         }
    //     },
    //     { immediate: true }
    // )
    
    watch(
        () => localUser.value.userName,
        (newVal) => {
            if (newVal?.trim()) {
                usernameError.value = []
            }
        }
    )
    watch(
        () => localUser.value.password,
        (newVal) => {
            if (newVal?.trim()) {
                passwordError.value = []
            }
        }
    )
        
    watch(
        () => props.dialogOpen,
        (val) => {
            dialogOpenEmailUsers.value = val;
        },
        { immediate: true }
    )

    const deleteUser = () => {
        emit('cancel-user')
        dialogOpenEmailUsers.value = false;
    }

</script>