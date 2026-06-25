<template>
  <div v-if="item" class="d-flex justify-start import-statuses">
    <div>
      <div v-if="stage1 != null">
        <v-btn icon tile small @click.stop="showRawImportReport = true">
          <v-icon
            v-if="!stage1.shouldEndProcessing"
            :color="stage1.allOk ? 'success' : 'warning'">
            mdi-check-network-outline
          </v-icon>
          <v-icon v-else color="error">
            mdi-close-network-outline
          </v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-icon tile small color="grey lighten-2" class="import-status-inactive">
          mdi-network-outline
        </v-icon>
      </div>
    </div>
    <!-- size="small" density="compact" -->
    <div>
      <div v-if="stage2 != null">
        <v-btn icon tile small @click.stop="showMergingReport = true">
          <v-icon
            v-if="!stage2.shouldEndProcessing"
            :color="stage2.allOk ? 'success' : 'warning'">
            mdi-check-network-outline
          </v-icon>
          <v-icon v-else color="error">
            mdi-close-network-outline
          </v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-icon color="grey lighten-2" class="import-status-inactive">
          mdi-network-outline
        </v-icon>
      </div>
    </div>

    <div>
      <div v-if="stage3 != null">
        <v-btn icon tile small @click.stop="showApplyingReport = true">
          <v-icon
            v-if="!stage3.shouldEndProcessing"
            :color="stage3.allOk ? 'success' : 'warning'">
            mdi-check-network-outline
          </v-icon>
          <v-icon v-else color="error">
            mdi-close-network-outline
          </v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-icon color="grey lighten-2" class="import-status-inactive">
          mdi-network-outline
        </v-icon>
      </div>
    </div>
    <raw-import-report
      v-model="showRawImportReport"
      :item="item"
    ></raw-import-report>
    <merging-report
      v-model="showMergingReport"
      :item="item"
    ></merging-report>
    <applying-report
      v-model="showApplyingReport"
      :item="item"
    ></applying-report>
  </div>
</template>

<script setup>
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })

  const showRawImportReport = ref(false)
  const showMergingReport = ref(false)
  const showApplyingReport = ref(false)

  const stage1 = computed(() => props.item?.rawImportReport)
  const stage2 = computed(() => props.item?.dictionariesMergeReport)
  const stage3 = computed(() => props.item?.applyImportReport)
</script>

<style lang="scss" scoped>
.import-status-inactive {
  margin: 2px 0 0 0;
  padding: 0;
}
</style>
