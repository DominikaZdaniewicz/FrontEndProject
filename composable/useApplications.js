export function useApplications() {

    const backendApplications = ref([])

    async function getApplications() {
        backendApplications.value = await $fetch('/api/Application/all')
        return backendApplications.value
    }

    async function addApplication(application) {
        const createdApplication = await $fetch('/api/Application', {
            method: 'POST',
            body: application
        });
        backendApplications.value.push(createdApplication);
        return createdApplication;
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

    async function getApplicationsBasic() {
        const data = await $fetch('/api/Application/basic')
        return ref(data)
    }

    return {
        backendApplications,
        getApplications,
        addApplication,
        removeApplications,
        updateApplications,
        getApplicationsBasic
    }
}