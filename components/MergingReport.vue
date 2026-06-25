<template>
  <v-dialog v-model="visible" max-width="900">
    <v-card v-if="item.dictionariesMergeReport" class="dense-card">
      <v-card-title>{{$t('file')}} {{ item.filename }} </v-card-title>
      <v-card-text>
        <v-alert
          v-if="item.dictionariesMergeReport.allOk"
          type="success"
          variant="outlined"
          border="start"
          density="compact"
          >{{$t('dictionarySuccess')}}
        </v-alert>
        <v-alert
          v-if="
            !item.dictionariesMergeReport.allOk &&
            !item.dictionariesMergeReport.shouldEndProcessing
          "
          type="warning"
          variant="outlined"
          border="start"
          density="compact"
          >{{$t('dictionaryWarning')}}
        </v-alert>
        <v-alert
          v-if="item.dictionariesMergeReport.shouldEndProcessing"
          type="error"
          variant="outlined"
          border="start"
          density="compact"
          >{{$t('dictionaryError')}}
        </v-alert>

        <v-divider class="mb-1"></v-divider>
        <h4>{{$t('seeDetails')}}</h4>
        <ul v-if="actualMerges.length > 0">
          <li
            v-for="d in actualMerges"
            :key="d.dictionaryName"
            class="dict-item"
          >
            <div>
              <strong>{{$t('dictionary')}} "{{ d.dictionaryName }}"</strong>:
            </div>
            <div v-for="(is, i) in d.issues" :key="i" class="ml-3">
              - {{ is.description }}: {{ is.value }}
            </div>
          </li>
        </ul>
        <ul v-else>
          <li>{{$t('dictionaryMsg')}}</li>
        </ul>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="visible = false">{{$t('ok')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  const props = defineProps({
    item: { type: Object, required: true },
    modelValue: { type: Boolean, required: true },
  })

  const emit = defineEmits(['update:modelValue'])

  const visible = ref(false)

  const actualMerges = computed(() => {
    return props.item?.dictionariesMergeReport?.dictionariesMergingResults?.filter(
      (x) => x.issues && x.issues.length > 0
    ) || []
  })

  watch(
    () => props.modelValue,
    (v) => {
      visible.value = v
    }
  )

  watch(visible, (v) => {
    emit('update:modelValue', v)
  })
</script>

<style lang="scss" scoped>
.dense-card .v-card__text {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
.problem-item {
  height: 24px;
  border: 1px solid #ddd;
  margin: 2px 2px 2px 0;
  padding: 2px 4px;
}
</style>
