<template>       
    <v-form @submit.prevent="register" 
        v-if="status !== 'authenticated'"
        class="btn">
        <h4 class="mb-8 text-uppercase d-flex flex-column align-center">{{ $t("register") }}</h4>
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
            v-model="phoneNumber"
            :label="$t('phoneNumber')"
            hide-details
            class="field"/>
        <v-text-field
            v-model="email"
            :label="$t('email')"
            hide-details
            class="field"/>
        <v-text-field
            v-model="userName"
            :label="$t('userName')"
            hide-details
            class="field"/>
        <v-text-field
            v-model="password"
            :label="$t('password')"
            hide-details
            name="password"
            autocomplete="new-password"
            autocorrect="off"
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
    const roles = ref('')
    const rolesItems = [
        { label: $t('administrator'), value: 'administrator' },
        { label: $t('user'), value: 'user' }]    
    const phoneNumber = ref('')

    const register = async () => {
        const response = await signUp({
            username: userName.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            redirect: false
        })
        if (!response?.ok) return
    }

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