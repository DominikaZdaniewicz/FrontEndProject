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

    // async function paginationTask(page, pageSize) {
    //     const dataPagination = await $fetch('/api/Task/pagination', {
    //         method: 'GET',
    //         params: { page, pageSize }
    //     })
    //     return ref(dataPagination)
    // }

    async function paginationTask(page, pageSize, search, filterActive, sortBy) {
        
        const query = {
        page,
        pageSize,
        filterActive,
        sortBy
        }

        if (search) {
        query.search = search
        }

        return await $fetch('/api/Task/pagination', {
            method: 'GET',
            query
        })
    }

    async function paginationBasicTask(page, pageSize, search) {
        
        const query = {
        page,
        pageSize
        }

        if (search) {
        query.search = search
        }

        return await $fetch('/api/Task/paginationBasic', {
            method: 'GET',
            query
        })
    }

    async function getTasksBasic() {
        const data = await $fetch('/api/Task/basic')
        return ref(data)
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

    async function getExportTasks() {
        const blob = await $fetch('/api/Task/export', {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Tasks.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
    }

    async function getExportBasicTasks() {
        const blob = await $fetch('/api/Task/exportBasic', {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'TasksBasic.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
    }

    return {
        backendTasks,
        getTasks,
        addTask,
        removeTask,
        updateTask,
        paginationTask,
        paginationBasicTask,
        getTasksBasic,
        basicTaskData,
        getTaskEdit,
        getExportTasks,
        getExportBasicTasks
    }
}