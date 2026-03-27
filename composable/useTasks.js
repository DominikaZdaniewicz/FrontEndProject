export function useTasks() {

    const backendTasks = ref([])

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

    async function getTasksBasic() {
        const data = await $fetch('/api/Task/basic')
        return ref(data)
    }

    return {
        backendTasks,
        getTasks,
        addTask,
        removeTask,
        updateTask,
        getTasksBasic
    }
}