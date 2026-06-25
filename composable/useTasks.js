export function useTasks() {

    const backendTasks = ref([])
    const basicTaskData = ref([])

    async function getTasks() {
        backendTasks.value = await $fetch('/api/Task/all')
        return backendTasks.value
    }

    async function addTask(task) {
        const createdTask = await $fetch('/api/Task', {
            method: 'POST',
            body: task
        });
        backendTasks.value.push(createdTask);
        return createdTask;
    }

    async function removeTask(id) {
        await $fetch(`/api/Task/${id}`, {
            method: 'DELETE'
        });
        backendTasks.value = backendTasks.value.filter(t => t.id !== id);
    }

    async function updateTask(task) {
        const updatedTask = await $fetch(`/api/Task/${task.id}`, {
            method: 'PUT',
            body: task
        });
        const index = backendTasks.value.findIndex(s => s.id === task.id)

        if (index !== -1) {
            backendTasks.value[index] = updatedTask;
        } else {
            backendTasks.value.push(updatedTask);
        }

        return updatedTask;
    }

    async function paginationTask(page, pageSize, search, filterActive, sortBy) {
        
        return await $fetch('/api/Task/pagination', {
            method: 'POST',
            body: 
            {
                page,
                pageSize,
                search,
                filterActive,
                sortBy
            }
        })
    }

    async function paginationBasicTask(page, pageSize, search, sortByBasic) {
        
        return await $fetch('/api/Task/paginationBasic', {
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

    async function getTasksBasic() {
        const res = await $fetch('/api/Task/basic')

        basicTaskData.value = Array.isArray(res)
        ? res
        : res?.data ?? []
    }

    async function getTaskEdit(id) {
        return await $fetch(`/api/Task/${id}`)
    }

    async function exportXlsx() {
        const data = await fetch("api/Task/export-xlsx", {
            method: "POST"
        });

        waitForFileGeneric(`/api/Task/download-xlsx/${data.fileName}`, data.fileName );
    };

    async function exportBasicXlsx() {
        const data = await fetch("api/Task/export-basic-xlsx", {
            method: "POST"
        });

        waitForFileGeneric(`/api/Task/download-basic-xlsx/${data.fileName}`, data.fileName );
    };


    async function exportPdf() {
        const data = await fetch("api/Task/export-pdf", {
            method: "POST"
        });

        waitForFileGeneric(`/api/Task/download-pdf/${data.fileName}`, data.fileName );
    };

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

    // async function importTasks(file) {
    //     if (!file) return

    //     const formData = new FormData()
    //     formData.append('file', file)

    //     const response = await $fetch('/api/ImportData/internal/Main', {
    //         method: 'POST',
    //         body: formData
    //     })

    //     return response
    // }

    async function getImportRawData(importId, options = {}) {
        const response = await $fetch(`/api/ImportData/${importId}/rawData`, {
            method: "POST",
            body: {
            page: options.page || 1,
            pageSize: options.pageSize || 10,
            filter: {
                phrase: options.phrase || ""
            }
            }
        })

        return response
    }

    return {
        backendTasks,
        basicTaskData, 
        getTasks,
        addTask,
        removeTask,
        updateTask,
        paginationTask,
        paginationBasicTask,
        getTasksBasic,
        getTaskEdit,
        exportXlsx,
        exportBasicXlsx,
        exportPdf,
        waitForFileGeneric,
        getImportRawData,
        // importTasks
    }
}
