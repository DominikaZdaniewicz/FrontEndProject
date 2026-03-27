export async function useOwners() {

    const backendOwners = ref([])

    async function getOwners() {
        backendOwners.value = await $fetch('/api/Owner')
        return backendOwners
    }

    return {
        getOwners
    }
}