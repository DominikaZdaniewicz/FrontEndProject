<template>
    <v-form @submit.prevent="resetPassword" 
        class="btn">
        <!-- <h4 class="mb-2 text-uppercase d-flex flex-column align-center">{{ $t('forgotPassword') }}</h4> -->
        <a class="mb-8 d-flex flex-column align-center">{{ $t("forgotPasswordMsg") }}</a>
        <v-text-field
            v-model="email"
            :label="$t('email')"
            hide-details
            class="field"/>
        <!-- <v-text-field
            v-model="password"
            :label="$t('newPassword')"
            type="password"
            name="password"
            autocomplete="new-password"
            autocorrect="off"
            hide-details
            class="field"/>
        <v-text-field
            v-model="confirmPassword"
            :label="$t('confirmPassword')"
            type="password"
            name="confirmPassword"
            autocomplete="new-password"
            autocorrect="off"
            hide-details
            class="field"/> -->
        <div
            class="mt-8 d-flex justify-center">
            <v-btn 
                type="submit"
                class="bg-surface-variant py-5 w-50 d-flex justify-center">
                {{ $t("send") }}
            </v-btn>
            <router-link 
                :to="localPath('/auth/login')" 
                class="w-50 link d-flex justify-center align-center">
                {{ $t("back") }}
            </router-link> 
        </div>
    </v-form>
</template>

<script setup>
    const localPath = useLocalePath();

    const { signIn, status } = useAuth()

    const router = useRouter()
    
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')

    const resetPassword = async () => {
        try {
            
            console.log("Resetting password for:", email.value)
        } catch (err) {
            console.error("RESET PASSWORD ERROR:", err)
        }
    }

    // const login = async () => {
    //     try {
    //         await signIn({
    //             username: email.value,
    //             password: password.value
    //         })
    //     } catch (err) {
    //         console.error("LOGIN ERROR:", err)
    //     }
    // }
        
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


