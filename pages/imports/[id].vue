<template>
  <div>
    <v-card flat>
      <v-card-title>{{ $t('fileRawData') }}</v-card-title>
      <v-card-text>
        <v-data-table
          :items="items"
          :headers="headers"
          :options="options"
          :loading="loading"
          :server-items-length="totalItems"
          @update:options="onOptionsUpdate">
          <template #top>
            <v-text-field
            v-model="filter.phrase"
              :prepend-inner-icon="
                typing ? 'mdi-progress-pencil' : 'mdi-magnify'
              "
              dense
              rounded
              outlined
              density="compact"
              variant="outlined"
              @click.stop
              @keyup.prevent
              @input="debouncedSearch"
            ></v-text-field>
          </template>
          <!-- <template 
            v-for="h in headers" 
            :key="h.key"
            #[`item.${h.key}`]="{ item }">
            {{ item[h.key] }}
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
  // definePageMeta({
  //   middleware: 'check-roles',
  //   auth: {}
  // })
import { useImport } from '~/composable/useImport';

  const { getRawData } = useImport();

  const route = useRoute()

  const loading = ref(false)
  const items = ref([])
  const headers = ref([])
  const totalItems = ref(0)

  const filter = ref({
    phrase: ''
  })

  const typing = ref(false)
  const debounce = ref(null)

  const options = reactive({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
  });

  const payload = computed(() => ({
    ...options,
    filter: filter.value
  }))

  const fetchData = async () => {
    loading.value = true

    try {
      const response = await getRawData(
        route.params.id,
        payload.value
      )
      console.log(response)
     
      // headers.value = (response?.headers || []).map(h => ({ title: h, key: h }))
      // headers.value = (response?.headers || []).map((h) => ([ {title: h.text ?? h.value, key: h.value.charAt(0).toLowerCase() + h.value.slice(1), }]));
      // headers.value = response.headers.map((h) => ({title: h.text ?? h.value, key: h.value.charAt(0).toLowerCase() + h.value.slice(1), }));
      headers.value = (response?.headers || []).map(h => ({ title: h.text ?? h.value, key: h.value.charAt(0).toLowerCase() + h.value.slice(1) }));


      if (!response?.items) throw new Error('No data')

      // headers.value = response?.headers || []
      items.value = response?.items.items || []
      totalItems.value = response?.items.total || 0

      console.log("headers:", headers.value)
      console.log("items:", items.value)
      console.log("total:", totalItems.value)

    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // onMounted(() => {
  //   fetchData()
  // })

  const debouncedSearch = () => {
    typing.value = true

    clearTimeout(debounce.value)

    debounce.value = setTimeout(() => {
      typing.value = false
      fetchData()
    }, useRuntimeConfig().public.debouncingTimeout)
  }

  function onOptionsUpdate(newOptions) {
    Object.assign(options, newOptions);
    fetchData();
  }
</script>

<style lang="scss" scoped></style>
