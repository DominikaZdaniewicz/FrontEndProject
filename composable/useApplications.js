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
        
        const query = {
        page,
        pageSize,
        filterEmpty,
        filterNotEmpty,
        filterActive
        }

        if (search) {
        query.search = search
        }

        if (Array.isArray(sortBy)) {
            sortBy.forEach((s, index) => {
                query[`sortBy[${index}].key`] = s.key
                query[`sortBy[${index}].order`] = s.order
            })
        }

        return await $fetch('/api/Application/pagination', {
            method: 'GET',
            query
        })
    }

    async function paginationBasicApplication(page, pageSize, search) {
        
        const query = {
        page,
        pageSize
        }

        if (search) {
        query.search = search
        }

        return await $fetch('/api/Application/paginationBasic', {
            method: 'GET',
            query
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
        getExportBasicApplications
    }
}