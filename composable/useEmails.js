export function useEmails() {

    const backendEmails = ref([]);

    async function sendEmailToTask(taskId, subject, body) {
        try {
            const response = await fetch(`http://localhost:5056/api/emails/${taskId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject,
                    body
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("BACKEND ERROR:", errorText);
                throw new Error(errorText);
            }

            return await response.text();

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async function sendEmail(userEmail, email, username, subject, body) {
        try {
            const response = await fetch(`http://localhost:5056/api/emails`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    userEmail,
                    email, 
                    username,
                    subject,
                    body,   
                    sentAt: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("BACKEND ERROR:", errorText);
                throw new Error(errorText);
            }

            const result = await response.json();

            backendEmails.value.push({
                username: username,
                from: userEmail,
                to: email,
                subject: subject,
                body: body,
                sentAt: new Date().toISOString()
            });

            return result;

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async function getEmails() {
        const response = await fetch("http://localhost:5056/api/emails");

        if (!response.ok) {
            throw new Error("Błąd pobierania");
        }

        const data = await response.json();

        backendEmails.value = data || []; 
    }

    async function getEmailToUser(email) {
        const response = await fetch(`http://localhost:5056/api/emails/inbox/${email}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Błąd pobierania");
        }

        const data = await response.json();

        backendEmails.value = data || []; 
        return backendEmails.value;
    }

    async function getEmailFromUser(email) {
        const response = await fetch(`http://localhost:5056/api/emails/outbox/${email}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Błąd pobierania");
        }

        const data = await response.json();

        backendEmails.value = data || []; 
        return backendEmails.value;
    }

    return {
        backendEmails,
        sendEmailToTask,
        sendEmail,
        getEmails,
        getEmailToUser,
        getEmailFromUser
    }
}
