<template>
    <v-dialog v-model="dialogOpenUsers" max-width="500px">
        <v-card>
            <v-card-title class="mx-2 mt-4">{{ isEditing ? $t("editText") : $t("addText") }} {{$t("user")}}</v-card-title>
            <v-card-text>
                <v-text-field
                    class="mb-2"
                    v-model="localUser.userName"
                    :label="$t('userName')"
                    :error-messages="usernameError"
                    :append-inner-icon="usernameError.length ? 'mdi-alert-circle' : ''"/>
                <v-text-field
                    v-if="!isEditing"
                    v-model="localUser.password"
                    type="password"
                    :label="$t('password')"
                    :error-messages="passwordError"
                    :append-inner-icon="passwordError.length ? 'mdi-alert-circle' : ''"/>
                <v-text-field
                    v-model="localUser.firstName"
                    :label="$t('firstName')"/>
                <v-text-field
                    v-model="localUser.lastName"
                    :label="$t('lastName')"/>
                <v-text-field
                    v-model="localUser.email"
                    :label="$t('email')"
                    :error-messages="emailError"
                    :append-inner-icon="emailError.length ? 'mdi-alert-circle' : ''">
                </v-text-field>
                <v-text-field
                    v-model="localUser.phoneNumber"
                    :label="$t('phoneNumber')"/>
                <v-select 
                    v-model="localUser.roles"
                    :items="roles"
                    item-title="name"
                    item-value="value"
                    :label="$t('roles')"
                    multiple
                    :menu-props="{ closeOnContentClick: true }"/>
            </v-card-text>
            <v-btn 
                class="bg-surface-variant mx-6" 
                @click="saveUser"> 
                {{ isEditing ? $t("saveEditText") : $t("addText") }} 
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
    const localPath = useLocalePath();

    const props = defineProps({
        modelUserValue: Object,
        dialogOpen: Boolean
    })

    const emit = defineEmits(['save-user', 'cancel-user'])

    const dialogOpenUsers = ref(false);

    const isEditing = computed(() => !!props.modelUserValue?.id)

    const emptyUser = {
        id: '',
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        roles: []
    }

    const roles = [
        { name: 'Administrator', value: 'administrator' },
        { name: 'User', value: 'user' }
    ];

    const localUser = ref({ ...emptyUser })

    const usernameError = ref([])
    const passwordError = ref([])
    const emailError = ref([])

    watch(
        () => props.modelUserValue,
        async (val) => {
                        
            if (val === null) {
                dialogOpenUsers.value = false
                localUser.value = { ...emptyUser }
                return
            }

            dialogOpenUsers.value = !!val;
   
            if (val?.id) {
                localUser.value = { ...emptyUser, ...val }
            } else {
                localUser.value = { ...emptyUser }
            }
        },
        { immediate: true }
    )
    
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
        () => localUser.value.email,
        (newVal) => {
            if (newVal?.trim()) {
                emailError.value = []
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
        if (!localUser.value.userName?.trim()) {
            usernameError.value = [$t('nameError')];
            return 
        }
        if (!localUser.value.password?.trim()) {
            passwordError.value = [$t('passwordError')];
            return 
        }
        if (!localUser.value.email?.trim()) {
            emailError.value = [$t('emailError')];
            return 
        }

        let roles = localUser.value.roles

        if (!roles || roles.length === 0) {
            roles = ['user']
        }

        const payload = {
            ...localUser.value,
            roles
        }

        emit('save-user', payload)
        dialogOpenUsers.value = false;
        usernameError.value = []
        passwordError.value = []
        emailError.value = []
    }

    const deleteUser = () => {
        emit('cancel-user')
        dialogOpenUsers.value = false;
    }

</script>