import { useLocalStorage } from '@vueuse/core'

export function useServers() {

    const servers = useLocalStorage('servers', [])

    function addServer(server) {
        servers.value.push({
            ...server,
            id: Date.now(),
            createdAt: new Date ().toISOString().split('T')[0],
            updatedAt: '-',
        })
    }

    function removeServer(id) {
        servers.value = servers.value.filter(s => s.id !== id)
    }

    function updateServer(updated) {
        const index = servers.value.findIndex(s => s.id === updated.id)

        servers.value[index] = {
            ...updated,
            updatedAt: new Date ().toISOString().split('T')[0]
        }
    }

    return {
        servers,
        addServer,
        removeServer,
        updateServer
    }
}