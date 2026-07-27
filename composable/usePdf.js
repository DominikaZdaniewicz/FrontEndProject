export function usePdf() {

    async function getPdf (id)  {
        return await $fetch(`/api/pdf/${id}`, {
            method: 'GET',
            responseType: 'blob'
        })
    }

    return {
        getPdf
    }
}