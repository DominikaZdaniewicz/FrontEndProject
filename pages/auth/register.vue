<template>       
    <v-form @submit.prevent="register" 
        v-if="status !== 'authenticated'"
        class="btn">
        <h4 class="mb-8 text-uppercase d-flex flex-column align-center">{{ $t("register") }}</h4>
        <v-text-field
            v-model="userName"
            :label="$t('userName') + '*'"
            class="field"
            hide-details
            :error-messages="usernameError"
            :append-inner-icon="usernameError.length ? 'mdi-alert-circle' : ''"/>
        <v-text-field
            v-model="password"
            :label="$t('password') + '*'"
            name="password"
            autocomplete="new-password"
            autocorrect="off"
            class="field"
            hide-details
            :error-messages="passwordError"
            :append-inner-icon="passwordError.length ? 'mdi-alert-circle' : ''"/>
        <v-text-field
            v-model="firstName"
            :label="$t('firstName')"
            hide-details
            class="field"/>
        <v-text-field
            v-model="lastName"
            :label="$t('lastName')"
            hide-details
            class="field"/>
        <v-text-field
            v-model="email"
            :label="$t('email') + '*'"
            hide-details
            class="field"
            :error-messages="emailError"
            :append-inner-icon="emailError.length ? 'mdi-alert-circle' : ''"/>
        <v-text-field
            v-model="phoneNumber"
            :label="$t('phoneNumber')"
            hide-details
            class="field"/>
        <div
            class="mt-8 d-flex justify-center">
            <v-btn 
                type="submit"
                class="bg-surface-variant py-5 w-50 d-flex justify-center">
                {{ $t("signUpBtn") }}
            </v-btn>
            <router-link 
                :to="localPath('/auth/login')" 
                class="w-50 link d-flex justify-center align-center">
                {{ $t("signInBtn") }}
            </router-link> 
        </div>
    </v-form>
    <start-page
        v-else>
    </start-page>
</template>

<script setup>
    const localPath = useLocalePath();

    const { signUp, status, setPassword } = useAuth();

    const userName = ref('')
    const password = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')

    const usernameError = ref([])
    const passwordError = ref([])
    const emailError = ref([])
 
    const phoneNumber = ref('')

    const register = async () => {
        usernameError.value = []
        passwordError.value = []
        emailError.value = []

        if (!userName.value.trim()) {
            usernameError.value = [$t('nameError')];
            return 
        }
        if (!password.value.trim()) {
            passwordError.value = [$t('passwordError')];
            return 
        }
        if (!email.value.trim()) {
            emailError.value = [$t('emailError')];
            return 
        }

        const response = await signUp({
            username: userName.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            roles: ['user']
         }, {
            redirect: false
        })
        if (!response?.ok) return
    }

        watch(
        () => userName.value,
        (newVal) => {
            if (newVal?.trim()) {
                usernameError.value = []
            }
        }
    )
    watch(
        () => password.value,
        (newVal) => {
            if (newVal?.trim()) {
                passwordError.value = []
            }
        }
    )
    watch(
        () => email.value,
        (newVal) => {
            if (newVal?.trim()) {
                emailError.value = []
            }
        }
    )

    definePageMeta({
        layout: "small"
    })

</script>

<style scoped>

    .lang-switch {
        position: absolute;
        right: 17%;
    }

    .link {
        text-decoration: underline;
        cursor: pointer;
        color: white;
    }

    .link:hover {
        text-decoration: none;
    }

    .btn {
        width: 30%;
    }

    .field {
        margin-bottom: 15px;
        border-radius: 8px;
        border: 1px rgba(255, 255, 255, 0.384) solid;
    }

</style>