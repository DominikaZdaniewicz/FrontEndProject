export function useImport() {
  return {
    getList: (filters) =>
      $fetch('/api/Imports', {
        method: "POST",
        body: filters,
      }),

    restartImport: (id) =>
      $fetch(`/api/ImportData/${id}/restartImport`, {
        method: "PUT",
      }),

    getImportResult: (id) =>
      $fetch(`/api/Imports/${id}`),

    getRawData: (id, payload) =>
      $fetch(`/api/ImportData/${id}/rawData`, {
        method: "POST",
        body: payload,
      }),

    startProcessing: (id) =>
      $fetch(`/api/ImportData/${id}/startProcessing`, {
        method: "PUT",
      }),

    rawImport: (id) =>
      $fetch(`/api/ImportData/${id}/rawImport`, {
        method: "PUT",
      }),

    getListForNetwork: (filters) =>
      $fetch("/api/Imports/servicePrices", {
        method: "POST",
        body: filters,
      }),

    saveFile: (type, file, networkId) => {
      const formData = new FormData()
      formData.append("file", file)
      if (networkId) formData.append("networkId", networkId)

      return $fetch(`/api/Imports/internal/${type}`, {
        method: "POST",
        body: formData,
      })
    },

    updateImport: (item) =>
      $fetch("/api/Imports", {
        method: "PUT",
        body: item,
      }),
  }
}