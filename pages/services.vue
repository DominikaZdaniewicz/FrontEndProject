<template>
    <v-form class="mt-12">
        <h4 class="my-4">{{ $t("textVies") }}</h4>
        <v-text-field
            v-model="vatNr"
            :label="$t('vatNr')"
            hide-details
            class="field"/>
        <div :class="isValid ? 'text-success' : 'text-danger'" >
            {{ message }}
        </div>
    </v-form>
    <v-form class="mt-12">
        <h4 class="my-4">{{ $t("textRegon") }}</h4>
        <v-text-field
            v-model="regonNr"
            :label="$t('vatNr')"
            hide-details
            class="field width-auto"/>
        <v-btn 
            class="bg-surface-variant py-5 w-50 d-flex justify-center"
            @click="getCompanyData">
            {{ $t("check") }}
        </v-btn>
        <div v-if="message2" class="text-danger">
            {{ message2 }}
        </div>
        <v-card v-if="regonResult" class="mt-4 pa-4">
            <div><strong>{{ $t('company') }}: </strong> {{ regonResult.name }}</div>
            <div><strong>{{ $t('regon') }}: </strong> {{ regonResult.regon }}</div>
            <div><strong>{{ $t('silosId') }}: </strong> {{ regonResult.silosID }}</div>
            <div><strong>{{ $t('type') }}: </strong> {{ regonResult.type }}</div>
            <div><strong>{{ $t('province') }}: </strong> {{ regonResult.province }}</div>
            <div><strong>{{ $t('city') }}: </strong> {{ regonResult.city }}</div>
            <div><strong>{{ $t('commune') }}: </strong> {{ regonResult.commune }}</div>
            <div><strong>{{ $t('district') }}: </strong> {{ regonResult.district }}</div>
            <div><strong>{{ $t('street') }}: </strong> {{ regonResult.street }}</div>
            <div><strong>{{ $t('postalCode') }}: </strong> {{ regonResult.postalCode }}</div>
        </v-card>
    </v-form>
    <v-form class="mt-12">
        <h4 class="my-4">{{ $t("textWhiteList") }}</h4>
        <v-text-field
            v-model="nip"
            :label="$t('nip')"
            hide-details
            class="field"/>
        <v-text-field
            v-model="bankAccountNumber"
            :label="$t('accountNumber')"
            hide-details
            class="field width-auto"/>
        <v-btn 
            class="bg-surface-variant py-5 w-50 d-flex justify-center"
            @click="getWhiteListData">
            {{ $t("check") }}
        </v-btn>
        <div v-if="message3" :class="whiteListResult?.found ? 'text-success mt-4' : 'text-danger mt-4'">
            {{ message3 }}
        </div>
    </v-form>

</template>

<script setup>
import { useServices } from '~/composable/useServices'

    const { getVies, getRegon, getWhiteList } = useServices()

    const vatNr = ref('')
    const regonNr = ref('')
    const isValid = ref(false)
    const regonResult = ref(null)
    const whiteListResult = ref(null)
    const message = ref('')
    const message2 = ref('')
    const message3 = ref('')
    const nip = ref('')
    const bankAccountNumber = ref('')

    const getVatNr = async () => {
        const result = await getVies(vatNr.value)

        isValid.value = result.valid

        message.value = result.valid
            ? $t('validVatNr')
            : $t('invalidVatNr')
    }

    // const getWhiteListData = async () => {
    //     const result = await getWhiteList(nip.value, accountNumber.value)

    //     whiteListResult.value = JSON.parse(result)
    //     message3.value = whiteListResult.value.valid
    //         ? $t('validWhiteList')
    //         : $t('invalidWhiteList')
    // }

    const getWhiteListData = async () => {
        const result = await getWhiteList(
            nip.value,
            bankAccountNumber.value
        )

        whiteListResult.value = result

        message3.value = result.found
            ? $t('validWhiteList')
            : $t('invalidWhiteList')
    }

    const getCompanyData = async () => {
        try {
            const result = await getRegon(regonNr.value)

            regonResult.value = JSON.parse(result)
            message2.value = ''
        } catch (error) {
            regonResult.value = null
            message2.value = $t('errorRegon')
            console.error(error)
        }
    }

    // watch(vatNr, async (newValue) => {
    //     message.value = ''

    //     if (newValue.length !== 12) {
    //         isValid.value = null
    //         return
    //     }

    //     await getVatNr()
    // })

    watch(vatNr, async (newValue) => {
        message.value = ''

        if (newValue.length !== 12) {
            isValid.value = null
            return
        }

        await getVatNr()
    })

    watch(regonNr, async (newValue) => {
        message2.value = ''

        if (newValue.length !== 10) {
            regonResult.value = null
            return
        }
    })

</script>

<style scoped>
/* 
    .text-success::before {
        content: "\F05E0"; /* kod ikony mdi-check-circle 
        font-family: "Material Design Icons";
        margin-right: 8px;
        color: #4CAF50;
    } */

    .text-success {
        color: #4CAF50;
    }
    
    /* .text-danger::before {
        content: "\F05E1"; /* kod ikony mdi-alert-circle 
        font-family: "Material Design Icons";
        margin-right: 8px;
        color: #f44336;
    } 
    */

    .text-danger {
        color: #f44336;
    }

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