export function useUsers() {

    const backendUsers = ref([])   
    const { data } = useAuth();
    
    // function getAuthHeaders() {
        
    //     const token = data.value?.accessToken;

    //     console.log("TOKEN:", token);

    //     return token
    //         ? { Authorization: `Bearer ${token}` }
    //         : {};
    // }

    async function getUsers() {
        const users = await $fetch('http://localhost:5056/auth/users', { credentials: 'include' });

        backendUsers.value = users;
        return backendUsers;
    }

    async function getLoggedUser() {
        return await $fetch(`http://localhost:5056/auth/users/current`, {
            credentials: 'include'
        });
    }

    async function getUser(user) {
        return await $fetch(`http://localhost:5056/auth/user/${user.userId}`, { credentials: 'include' });
    }

    async function addUser(user) {
        const createdUser = await $fetch('http://localhost:5056/auth/users', {
            method: 'POST',
            body: user,
            credentials: 'include'
        });

        backendUsers.value.push(createdUser);
        return createdUser;
    }

    async function changeUserPassword(userId, oldPassword, newPassword) {
        const createPassword = await $fetch(`http://localhost:5056/auth/users/${userId}/change-password`, {
            method: 'POST',
            body: {
                oldPassword,
                newPassword
            },
            credentials: 'include'
        });
    }

    async function updateUser(user) {
        const updatedUser = await $fetch(`http://localhost:5056/auth/users/${user.userId}`, {
            method: 'PUT',
            body: user,
            credentials: 'include'
        });

        const index = backendUsers.value.findIndex(u => u.id === user.userId);

        if (index !== -1) {
            backendUsers.value[index] = updatedUser;
        } else {
            backendUsers.value.push(updatedUser);
        }

        return updatedUser;
    }

    async function removeUser(userId) {
        await $fetch(`http://localhost:5056/auth/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        backendUsers.value = backendUsers.value.filter(u => u.id !== userId);
    }

    async function getExportUsers() {
        const blob = await $fetch('/api/User/export', {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'User.xlsx'
        document.body.appendChild(a)
        a.click()
        a.remove()

        window.URL.revokeObjectURL(url)
    }

    async function paginationUser(page, pageSize, search, filterIsAdmin, sortBy) {
        return await $fetch('/api/User/pagination', {
            method: 'POST',
            body: 
            {
                page,
                pageSize,
                search,
                filterIsAdmin,
                sortBy
            }
        })
    }

    return {
        backendUsers,
        getUsers,
        getUser,
        getLoggedUser,
        addUser,
        changeUserPassword,
        updateUser,
        removeUser,
        getExportUsers,
        paginationUser
    }
}