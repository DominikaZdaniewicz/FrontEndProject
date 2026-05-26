<template>
    <v-form @submit.prevent="login" 
        class="btn">
        <h4 class="mb-8 text-uppercase d-flex flex-column align-center">{{ $t('login') }}</h4>
        <v-text-field
            v-model="userName"
            :label="$t('userName')"
            hide-details
            class="field"/>
        <v-text-field
            v-model="password"
            :label="$t('password')"
            type="password"
            hide-details
            class="field"/>
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

    const login = async () => {
        return await signIn({
            username: userName.value,
            password: password.value,
            redirect: false
        })
    }
        
    watch(status, async (val) => {
        if (val === 'authenticated') {
            await router.push('/servers')
        }
    })

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


