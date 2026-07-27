export function useServices() {

    async function getVies(vatId) {
        return await $fetch(`http://localhost:5056/vies/check/${vatId}`) 
    }

    async function getRegon(regon) {
        return await $fetch(`http://localhost:5056/regon/regon-check?vatId=${regon}`)
    }

    // async function getWhiteList(nip, bankAccountNumber) {
    //     return await $fetch(
    //         `http://localhost:5056/vatwhitelist/check-whitelist?vatId=${nip}&bankAccountNumber=${bankAccountNumber}`
    //     )
    // }

    async function getWhiteList(nip, bankAccountNumber) {
        return await $fetch(
            'http://localhost:5056/vatwhitelist/check-whitelist',
            {
                method: 'GET',
                query: {
                    vatId: nip,
                    bankAccountNumber
                }
            }
        )
    }

    return {
        getVies,
        getRegon,
        getWhiteList
    }
}