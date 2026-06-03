<template>
    <v-form @submit.prevent="login" 
        class="btn">
        <h4 class="mb-4 text-uppercase d-flex flex-column align-center">{{ $t('login') }}</h4>
        <a v-if="errorMsg" class="text-red mb-4 text-uppercase">{{ $t('loginFailed') }}</a>
        <v-text-field
            v-model="userName"
            :label="$t('userName')"
            hide-details
            class="field mt-4"
            :error-messages="userNameError"/>
        <v-text-field
            v-model="password"
            :label="$t('password')"
            type="password"
            name="password"
            autocomplete="new-password"
            autocorrect="off"
            hide-details
            class="field"
            :error-messages="passwordError"/>
        <router-link 
            :to="localPath('/auth/forgotPassword')" 
            class="link">
            {{ $t("forgotPassword") }}
        </router-link>
        <div
            class="mt-8 d-flex justify-center">
            <v-btn 
                type="submit"
                class="bg-surface-variant py-5 w-50 d-flex justify-center">
                {{ $t("signInBtn") }}
            </v-btn>
            <router-link 
                :to="localPath('/auth/register')" 
                class="w-50 link d-flex justify-center align-center">
                {{ $t("signUpBtn") }}
            </router-link> 
        </div>
    </v-form>
</template>

<script setup>
    const localPath = useLocalePath();

    const { signIn, status } = useAuth()

    const router = useRouter()
    
    const userName = ref('')
    const password = ref('')

    const userNameError = ref('')
    const passwordError = ref('')

    const errorMsg = ref(false)

    const login = async () => {
        try {
            await signIn({
                username: userName.value.trim(),
                password: password.value.trim(),
            })
        } catch (err) {
            if (status.value !== 'authenticated') {
                errorMsg.value = true
            }
        }
    }
        
    watch(status, async (val) => {
        if (val === 'authenticated') {
            await router.push('/servers')
        }
    })

    watch(
        () => userName.value,
        (newVal) => {
            if (newVal?.trim()) {
                errorMsg.value = false
                userNameError.value = ''
            }
        }
    )

    watch(
        () => password.value,
        (newVal) => {
            if (newVal?.trim()) {
                errorMsg.value = false
                passwordError.value = ''
            }
        }
    )

    definePageMeta({
        layout: "small"
    })

</script>

<style scoped>

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


