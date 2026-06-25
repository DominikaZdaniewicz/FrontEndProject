export function useUsers() {

    const backendUsers = ref([])   
    const { data } = useAuth();

    async function getUsers() {
        const users = await $fetch('http://localhost:5056/api/User/all', { credentials: 'include' });

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

    // async function getExportUsers() {
    //     const blob = await $fetch('/api/User/export', {
    //         responseType: 'blob'
    //     })

    //     const url = window.URL.createObjectURL(blob)
    //     const a = document.createElement('a')
    //     a.href = url
    //     a.download = 'User.xlsx'
    //     document.body.appendChild(a)
    //     a.click()
    //     a.remove()

    //     window.URL.revokeObjectURL(url)
    // }

    async function exportXlsx() {
        const res = await fetch("api/User/export-xlsx", {
            method: "POST"
        });

        const data = await res.json();

        return data.fileName;
    };

    async function exportPdf() {
        const res = await fetch("/api/User/export-pdf", {
            method: "POST",
            // headers: {
            // "Authorization": "Bearer " + token
            // }
        });

        const data = await res.json();

        const fileName = data.fileName;

        waitForFile(fileName);
    };

    function waitForFile (fileName) {
        const interval = setInterval(async () => {
            const res = await fetch(`/api/User/download-pdf/${fileName}`, {
            // headers: {
            //     "Authorization": "Bearer " + token
            // }
            });

            if (res.status === 200) {
            clearInterval(interval);

            const blob = await res.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();

            window.URL.revokeObjectURL(url);
            }

        }, 2000);
    };

    // async function postExportUsersPDF() {
    //     const blob = await $fetch('/api/User/export-pdf', {
    //         method: 'POST',
    //         responseType: 'blob'
    //     })

    //     const url = window.URL.createObjectURL(blob)
    //     const a = document.createElement('a')
    //     a.href = url
    //     a.download = 'Users.pdf'
    //     document.body.appendChild(a)
    //     a.click()
    //     a.remove()

    //     window.URL.revokeObjectURL(url)
    // }

    // async function getExportUsersPDF() {
    //     const blob = await $fetch('http://localhost:5056/api/User/export-pdf', {
    //         responseType: 'blob'
    //     })

    //     const url = window.URL.createObjectURL(blob)
    //     const a = document.createElement('a')
    //     a.href = url
    //     a.download = 'Users.pdf'
    //     document.body.appendChild(a)
    //     a.click()
    //     a.remove()

    //     window.URL.revokeObjectURL(url)
    // }

    // async function generatePdf () {
    //     await fetch("https://localhost:5001/export-pdf", {
    //         method: "POST"
    //     });

    //     alert("PDF jest generowany w tle");

    //     setTimeout(async () => {
    //         const response = await fetch("https://localhost:5001/downloadPDF");

    //         if (response.ok) {
    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(blob);

    //         const a = document.createElement("a");
    //         a.href = url;
    //         a.download = "raport.pdf";
    //         a.click();
    //         } else {
    //         alert("PDF jeszcze nie gotowy");
    //         }
    //     }, 5000);
    // };

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
        exportPdf,
        exportXlsx,
        paginationUser
    }
}