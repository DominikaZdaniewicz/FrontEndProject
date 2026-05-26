export function useApplications() {

    const backendApplications = ref([])
    const basicApplicationData = ref([])
    const basicApplicationToTaskData = ref([])

    async function getApplications() {
        backendApplications.value = await $fetch('/api/Application/all')
        return backendApplications.value
    }

    async function addApplication(application) {
        return await $fetch('/api/Application', {
            method: 'POST',
            body: application
        });
    }

    async function removeApplications(id) {
        await $fetch(`/api/Application/${id}`, {
            method: 'DELETE'
        });
        backendApplications.value = backendApplications.value.filter(a => a.id !== id);
    }

    async function updateApplications(application) {
        const updatedApplication = await $fetch(`/api/Application/${application.id}`, {
            method: 'PUT',
            body: application
        });
        
        const index = backendApplications.value.findIndex(s => s.id === application.id)

        backendApplications.value[index] = updatedApplication;
        return updatedApplication;
    }

    async function paginationApplication(page, pageSize, search, filterEmpty, filterNotEmpty, filterActive, sortBy) {
        
        return await $fetch('/api/Application/pagination', {
            method: 'POST',
            body: 
            {
                page,
                pageSize,
                search,
                filterEmpty,
                filterNotEmpty,
                filterActive,
                sortBy
            }
        })
    }

    async function paginationBasicApplication(page, pageSize, search, sortByBasic) {
        
        return await $fetch('/api/Application/paginationBasic', {
            method: 'POST',
            body: 
            {
                page,
                pageSize,
                search,
                sortBy: sortByBasic
            }
        })
    }

    async function getApplicationDetails(id) {
        return await $fetch(`/api/Application/detail/${id}`)
    }

    async function getApplicationsBasic() {
        const res = await $fetch('/api/Application/basic')

        basicApplicationData.value = Array.isArray(res)
        ? res
        : res?.data ?? []
    }

    async function getApplicationsToTask() {
        const res = await $fetch('/api/Application/toTask')

        basicApplicationToTaskData.value = Array.isArray(res)
        ? res
        : res?.data ?? []
    }

    async function getApplicationEdit(id) {
        return await $fetch(`/api/Application/${id}`)
    }

    async function getExportApplications() {
        const blob = await $fetch('/api/Application/export', {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Applications.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
    }

    async function getExportBasicApplications() {
        const blob = await $fetch('/api/Application/exportBasic', {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'ApplicationsBasic.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
    }

    async function importApplications(file) {
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        await $fetch('/api/Application/import', {
            method: 'POST',
            body: formData
        })
    }

    return {
        backendApplications,
        getApplications,
        addApplication,
        removeApplications,
        updateApplications,
        paginationApplication,
        paginationBasicApplication,
        getApplicationDetails,
        getApplicationsBasic,
        basicApplicationData,
        getApplicationEdit,
        getApplicationsToTask,
        basicApplicationToTaskData,
        getExportApplications,
        getExportBasicApplications,
        importApplications
    }
}