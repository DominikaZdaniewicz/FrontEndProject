import { useLocalStorage } from '@vueuse/core'
import applicationsData from '~/assets/data/applications.json'


export function useApplications() {

    const applications = useLocalStorage('applications', applicationsData)

    function addApplications(application) {
        applications.value.push({
            ...application,
            id: Date.now(),
            createdAt: new Date ().toISOString().split('T')[0],
            updatedAt: '-',
        })
    }

    function removeApplications(id) {
        applications.value = applications.value.filter(a => a.id !== id)
    }

    function updateApplications(updated) {
        const index = applications.value.findIndex(s => s.id === updated.id)

        applications.value[index] = {
            ...updated,
            updatedAt: new Date ().toISOString().split('T')[0]
        }
    }

    return {
        applications,
        addApplications,
        removeApplications,
        updateApplications
    }
}