<template>
  <v-dialog v-model="visible" max-width="500">
    <v-card v-if="item.rawImportReport" class="dense-card">
      <v-card-title>{{ $t('file') }} {{ item.filename }} </v-card-title>
      <v-card-text>
        <v-alert
          v-if="item.rawImportReport.allOk"        
          type="success"
          variant="outlined"
          border="start"
          density="compact"
          >{{ $t('importSuccessMsg') }}
        </v-alert>
        <v-alert
          v-if="
            !item.rawImportReport.allOk &&
            !item.rawImportReport.shouldEndProcessing
          "
          type="warning"
          variant="outlined"
          border="start"
          density="compact"
          >{{ $t('importWaringMsg') }}
        </v-alert>
        <v-alert
          v-if="item.rawImportReport.shouldEndProcessing"
          variant="outlined"
          border="start"
          density="compact"
          type="error"
          >{{ $t('importErrorMsg') }}
        </v-alert>

        <v-divider class="mb-1"></v-divider>
        <h4>{{ $t('seeDetails') }}</h4>

        <div class="success--text">
          {{ $t('fileData') }} {{ item.rawImportReport.itemsInFile }}
        </div>
        <div class="success--text">
          {{ $t('importData') }} {{ item.rawImportReport.itemsImported }}
        </div>
        <div
          v-if="
            item.rawImportReport.itemsInFile >
            item.rawImportReport.itemsImported
          "
          class="warning--text"
        >
          {{ $t('rejectedData') }}
          {{
            item.rawImportReport.itemsInFile -
            item.rawImportReport.itemsImported
          }}
        </div>
      </v-card-text>
      <v-card-text v-if="item.rawImportReport.issues.length">
        <h4>{{ $t('issues') }} ({{ item.rawImportReport.issues.length }}):</h4>
        <v-virtual-scroll
          :bench="0"
          :items="item.rawImportReport.issues"
          height="200"
          item-height="32"
          class="pa-2"
        >
          <template v-slot:default="{ item, index }">
            <div class="problem-item text-truncate text-caption">
              {{ index + 1 }}.
              {{
                item.row && item.column ? `[${item.row},${item.column}]` : ''
              }}
              {{ item.description }}
            </div>
          </template>
        </v-virtual-scroll>
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

  watch(
    () => props.modelValue,
    (v) => {
      visible.value = v
    }
  )

  watch(
    visible,
    (v) => {
      emit('update:modelValue', v)
    }
  )
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
