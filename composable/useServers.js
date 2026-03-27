export  function useServers() {

    const backendServers = ref([])

    async function getServers() {
        backendServers.value = await $fetch('/api/Server/all')
        return backendServers.value
    }

    async function addServer(server) {
        const createdServer = await $fetch('/api/Server', {
            method: 'POST',
            body: server
        });
        backendServers.value.push(createdServer);
        return createdServer;
    }

    async function removeServer(id) {
        await $fetch(`/api/Server/${id}`, {
            method: 'DELETE'
        });
        backendServers.value = backendServers.value.filter(s => s.id !== id);
    }

    async function updateServer(server) {
        const updatedServer = await $fetch(`/api/Server/${server.id}`, {
            method: 'PUT',
            body: server
        });

        const index = backendServers.value.findIndex(s => s.id === server.id)

        backendServers.value[index] = updatedServer;
        
        return updatedServer;
    }

    async function getServersSummary() {
        const data = await $fetch('/api/Server/summary')
        return ref(data)
    }
    
    async function getServersBasic() {
        const data = await $fetch('/api/Server/basic')
        return ref(data)
    }

    return {
        backendServers,
        getServers,
        addServer,
        removeServer,
        updateServer,
        getServersSummary,
        getServersBasic
    }
}