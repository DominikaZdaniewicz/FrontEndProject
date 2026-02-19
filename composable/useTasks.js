import { useLocalStorage } from '@vueuse/core'

export function useTasks() {

    const tasks = useLocalStorage('tasks', [])

    function addTask(task) {
        tasks.value.push({
            ...task,
            id: Date.now(),
            createdAt: new Date ().toISOString().split('T')[0],
            updatedAt: '-',
        })
    }

    function removeTask(id) {
        tasks.value = tasks.value.filter(t => t.id !== id)
    }

    function updateTask(updated) {
        const index = tasks.value.findIndex(s => s.id === updated.id)

        tasks.value[index] = {
            ...updated,
            updatedAt: new Date ().toISOString().split('T')[0]
        }
    }

    return {
        tasks,
        addTask,
        removeTask,
        updateTask
    }
}