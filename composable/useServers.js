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
                
        return await $fetch('/api/Server/pagination', {
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

    async function paginationBasicServer(page, pageSize, search, sortByBasic) {
        
        return await $fetch('/api/Server/paginationBasic', {
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

    async function exportBasicXlsx() {
        const data = await $fetch('/api/Server/export-basic-xlsx', {
            method: 'POST'
        });

        waitForFileGeneric(`/api/Server/download-basic-xlsx/${data.fileName}`, data.fileName );
    }
    
    async function exportXlsx() {
        const data = await $fetch('/api/Server/export-xlsx', {
            method: 'POST'
        });

        waitForFileGeneric(`/api/Server/download-xlsx/${data.fileName}`, data.fileName );
    }
        
    async function exportPdf() {
        const data = await $fetch('/api/Server/export-pdf', {
            method: 'POST'
        });

        waitForFileGeneric(
            `/api/Server/download-pdf/${data.fileName}`,
            data.fileName
        );
    }

    function waitForFileGeneric(url, fileName) {
        let attempts = 0;
        const maxAttempts = 30;

        const interval = setInterval(async () => {
            attempts++;

            const res = await fetch(url);

            if (res.status === 200) {
                clearInterval(interval);

                const blob = await res.blob();
                const downloadUrl = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();

                window.URL.revokeObjectURL(downloadUrl);
            }

            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.error("Timeout waiting for file:", fileName);
            }

        }, 2000);
    }

    // async function importServers(file) {
    //     if (!file) return

    //     const formData = new FormData()
    //     formData.append('file', file)

    //     await $fetch('/api/Server/import', {
    //         method: 'POST',
    //         body: formData
    //     })
    // }

    return {
        backendServers,
        basicServerData,
        getServers,
        addServer,
        removeServer,
        updateServer,
        paginationServer,
        paginationBasicServer,
        getServersSummary,
        getServerDetails,
        getServersBasic,  
        getServerEdit,
        exportBasicXlsx,
        exportXlsx,
        exportPdf,
        waitForFileGeneric,
        // importServers        
    }
}