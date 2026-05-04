export  function useServers() {

    const backendServers = ref([])
    const basicServerData = ref([])

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

    async function paginationServer(page, pageSize, search, filterEmpty, filterNotEmpty, filterActive, sortBy) {
        
        const query = {
            page,
            pageSize,
            filterEmpty,
            filterNotEmpty,
            filterActive,
            sortBy
        }

        if (search) {
        query.search = search
        }

        return await $fetch('/api/Server/pagination', {
            method: 'GET',
            query
        })
    }

    async function paginationBasicServer(page, pageSize, search) {
        
        const query = {
            page,
            pageSize,
        }

        if (search) {
        query.search = search
        }

        return await $fetch('/api/Server/paginationBasic', {
            method: 'GET',
            query
        })
    }

    async function getServersSummary() {
        return await $fetch('/api/Server/summary')
    }    

    async function getServerDetails(id) {
        return await $fetch(`/api/Server/detail/${id}`)
    }

    async function getServersBasic() {
        const res = await $fetch('/api/Server/basic')

        basicServerData.value = Array.isArray(res)
        ? res
        : res?.data ?? []
    }

    async function getServerEdit(id) {
        return await $fetch(`/api/Server/${id}`)
    }

    async function getExportServers() {
        const blob = await $fetch('/api/Server/export', {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Servers.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
    }

    async function getExportBasicServers() {
        const blob = await $fetch('/api/Server/exportBasic', {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'ServersBasic.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
    }


    return {
        getServers,
        addServer,
        removeServer,
        updateServer,
        paginationServer,
        paginationBasicServer,
        getServersSummary,
        getServerDetails,
        getServersBasic,
        basicServerData,
        getServerEdit,
        getExportServers,
        getExportBasicServers
    }
}