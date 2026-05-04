export function useOwners() {

    const owners = ref([])

    async function getOwners() {
        owners.value = await $fetch('/api/Owner') 
        return owners
    }

    async function getExportBasicOwners() {
        const blob = await $fetch('/api/Owner/exportBasic', {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'OwnersBasic.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
    }

    async function paginationBasicOwner(page, pageSize, search) {
        
        const query = {
        page,
        pageSize
        }

        if (search) {
        query.search = search
        }

        return await $fetch('/api/Owner/paginationBasic', {
            method: 'GET',
            query
        })
    }

    return {
        owners,
        getOwners,
        getExportBasicOwners,
        paginationBasicOwner
    }
}