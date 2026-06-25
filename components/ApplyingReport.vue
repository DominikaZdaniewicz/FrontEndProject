<template>
  <v-dialog v-model="visible" max-width="500">
    <v-card v-if="item.applyImportReport" class="dense-card">
      <v-card-title>{{$t('file')}} {{ item.filename }} </v-card-title>
      <v-card-text>
        <v-alert
          v-if="item.applyImportReport.allOk"
          type="success"
          variant="outlined"
          border="start"
          density="compact"
          >{{$t('dataConsolidationSuccess')}}
        </v-alert>
        <v-alert
          v-if="
            !item.applyImportReport.allOk &&
            !item.applyImportReport.shouldEndProcessing
          "
          type="warning"
          variant="outlined"
          border="start"
          density="compact"
          >{{$t('dataConsolidationWarning', {
            itemsInserted: item.applyImportReport.itemsInserted,
            totalItems: item.applyImportReport.totalItems
          })
          }}
        </v-alert>
        <v-alert
          v-if="item.applyImportReport.shouldEndProcessing"
          type="error"
          variant="outlined"
          border="start"
          density="compact"
          >{{$t('dataConsolidationError')}}
        </v-alert>

        <div
          v-if="
            item.applyImportReport.errors &&
            item.applyImportReport.errors.length > 0
          "
        >
          <v-divider class="mb-1"></v-divider>
          <h4>{{$t('seeDetails')}}</h4>
          <div v-for="(error, i) in item.applyImportReport.errors" :key="i">
            {{ error }}
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="visible = false">Ok</v-btn>
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
    return props.item?.applyImportReport?.dictionariesMergingResults?.filter(
      (x) => x.itemsInserted > 0
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
