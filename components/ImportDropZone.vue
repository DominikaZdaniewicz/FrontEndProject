<template>
  <div style="width: 100%">
    <label v-bind="getRootProps()" @drop.prevent="uploadFile">
      <div class="dropzone-container">
        <span class="dropzone-container--text">
          <v-icon>mdi-upload</v-icon>
          {{ t("selectFile") }}
        </span>
        <input
          type="file"
          multiple
          class="hidden"
          @input="uploadFile"
          accept=".xlsx"
        />
      </div>
    </label>
  </div>
</template>

<script setup>
import { useDropzone } from "vue3-dropzone";
// import { useI18n } from "vue-i18n";

const emit = defineEmits(["upload"]);
const { t } = useI18n();

const uploadFile = (event) => {
  let filesToUpload;
  if (event.dataTransfer) {
    filesToUpload = [...event.dataTransfer.files];
  } else {
    filesToUpload = [...event.target.files];
  }

  emit("upload", filesToUpload);
};

const { getRootProps } = useDropzone({ uploadFile });
</script>

<style scoped lang="scss">
.dropzone-container {
  width: 100%;
  height: 80px;
  position: relative;
  border: 2px dashed #ccc;
  background-color: #f3f3f3;
  border-radius: 10px;
  transition: 0.3s;
  cursor: pointer;

  &--text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    color: #ccc;
  }

  &:hover {
    border-color: #555;
  }
}
</style>
