export default defineNuxtRouteMiddleware(async (to) => {

    const publicPages = [
        '/auth/login',
        '/auth/register',
        '/unauthorized'
    ]

    if (publicPages.includes(to.path)) {
        return
    }

    const { status } = useAuth()

    if (status.value !== 'authenticated') {
        return navigateTo('/unauthorized')
    }
})