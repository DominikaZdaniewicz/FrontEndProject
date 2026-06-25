<template>
  <v-card>
    <v-card-title
        class="ma-4 d-flex align-center">
        <v-icon 
            class="mr-2">
            mdi-file-excel-outline
        </v-icon>
        {{$t('addFile')}}
    </v-card-title>

    <v-form v-model="formValid" class="pa-6">
      <v-row>
        <label
          v-bind="getRootProps()"
          @drop.prevent="uploadFile"
          style="width: 100%">
          <div class="dropzone-container">
            <span class="dropzone-container--text">
              <v-icon>mdi-upload</v-icon>
              {{ t("selectExcelFile") }}
            </span>
            <input
              type="file"
              multiple
              class="hidden"
              @input="uploadFile"
              accept=".xlsx, .xls, .csv, .xml"
              style="display: none"/>
          </div>
        </label>
      </v-row>

      <v-row v-if="addedFiles.length > 0" class="d-flex flex-column">
        <v-card-title>{{ t("fileList") }}</v-card-title>
        <div>
          <div v-for="(att, index) in addedFiles" :key="index">
            <v-select
              v-model="att.fileType"
              :label="att.file.name"
              :items="fileTypes"
              item-title="name"
              item-value="value"
              clearable
              :placeholder="t('fileType')"
              class="pa-2"
              :disabled="fileTypes.length === 0"/>
          </div>
          <!-- !props.isAdmin && -->
          <!-- <v-row
            v-if="addedFiles.some((att) =>
                  att.fileType === 'Server' ||
                  att.fileType === 'Application' ||
                  att.fileType === 'Task')">
            <v-col cols="12">
              <v-autocomplete
                v-model="selectedNetwork"
                :items="networks"
                item-title="name"
                item-value="id"
                :label="t('networkRequired')"
                clearable
                dense
                outlined/>
            </v-col>
          </v-row> -->
<!-- 
          <div 
            class="d-flex justify-end">
            <v-btn
                v-if="$route.params.id !== 'new'"
                :disabled="files.length === 0"
                class="my-4 bg-surface-variant w-25"
                @click="sendfiles">
                {{ $t('sendFile') }}
            </v-btn>
          </div> -->

          <v-row class="d-flex">
            <v-spacer />
            <v-btn
              v-if="route.params.id !== 'new'"
              :disabled="isSendDisabled"
              :loading="uploading"
              class="ma-2 bg-surface-variant"
              @click="sendfiles">
              {{ t("send") }}
            </v-btn>
          </v-row>
        </div>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "#app";
import { useImport } from "~/composable/useImport";
import { useDropzone } from "vue3-dropzone";

  const { saveFile } = useImport();

  const emit = defineEmits(["saved", "error"]);

  const uploading = ref(false);

  const { t } = useI18n();
  const route = useRoute();

  const formValid = ref(true);
  const addedFiles = ref([]);

  const fileTypes = computed(() => {
    if (props.allowedFileTypes.length > 0) {
      return props.allowedFileTypes;
    }
    return [
      { value: 'Server', name: t('serverType') },
      { value: 'Application', name: t('applicationType') },
      { value: 'Task', name: t('taskType') },
    ];
  });

  const uploadFile = (event) => {
    const files = event?.dataTransfer?.files ?? event?.target?.files ?? [];

    const allowedExt = new Set(["xlsx", "xls", "csv", "xml"]);

    const filesToUpload = Array.from(files).filter((f) => {
      const name = f.name.toLowerCase();
      const ext = name.substring(name.lastIndexOf(".") + 1);
      return allowedExt.has(ext);
    });

    const existing = new Set(
      addedFiles.value.map((x) => `${x.file.name}|${x.file.size}`),
    );

    for (const file of filesToUpload) {
      const key = `${file.name}|${file.size}`;
      if (existing.has(key)) continue;

      addedFiles.value.push({
        file,
        fileType: props.defaultFileType ?? null,
      });
    }
    if (
      props.defaultNetworkId

    ) {
      selectedNetwork.value = props.defaultNetworkId;
    }
  };

  const { getRootProps } = useDropzone({ uploadFile });

  const areAllFileTypesSelected = computed(() =>
    addedFiles.value.every((att) => att.fileType),
  );

  const sendfiles = async () => {
    if (uploading.value) return;

    uploading.value = true;

    try {
        const duplicates = []

        for (const item of addedFiles.value) {

            const alreadyExists = props.imports.some(
                x => x.filename === item.file.name
            )
            
            if (alreadyExists) {
                console.log('Ten plik był już importowany');

                $toast.warning(`Plik ${item.file.name} już istnieje`);

                uploading.value = false;
                return;
            }

            console.log("START uploadu");

            const response = await saveFile(
                item.fileType,
                item.file,
                selectedNetwork.value,
            );

            if (!response || !response?.success) {
                throw new Error("Nie udało się zapisać pliku");
            }
        }

        if (duplicates.length) {
            $toast.warning(`Pliki już istnieją: ${duplicates.join(', ')}`)
        }

        addedFiles.value = [];
        emit("saved", { success: true });

    } catch (error) {
        console.error("Upload error", error);
        emit("error", { message: error?.message || "Nie udało się zapisać pliku." });
    } finally {
        uploading.value = false;
    }
  };

  // const sendfiles = async () => {
  //   if (uploading.value) return;

  //   uploading.value = true;
    
  //   try {
  //     for (const item of addedFiles.value) {
  //       const alreadyExists = imports.value.some(
  //           x => x.filename === item.file.name
  //       )

  //       if (alreadyExists) {
  //           console.log('Ten plik był już importowany');
  //           $toast.warning(`Plik ${item.file.name} już istnieje`)
  //           continue
  //       }

  //       console.log("START uploadu");

  //       const response = await saveFile(
  //         item.fileType,
  //         item.file,
  //         selectedNetwork.value,
  //       );

  //       console.log("SEND:", {
  //         fileType: item.fileType,
  //         file: item.file.name,
  //         network: selectedNetwork.value
  //       });

  //       console.log("RESPONSE:", response);

  //       if (!response || !response?.success) {
  //         let details = "";
  //         try {
  //           details = await response?.text();
  //         } catch {}
  //           throw new Error(
  //           `Nie udało się zapisać pliku (${response?.status}). ${details || response?.statusText}`,
  //         );
  //       }
  //     }

  //     addedFiles.value = [];
  //     emit("saved", { success: true });
  //   } catch (error) {
  //     console.error("Upload error", error);
  //     emit("error", { message: error?.message || "Nie udało się zapisać pliku." });
  //   } finally {
  //     uploading.value = false;
  //   }
  // };

  const props = defineProps({
    networks: {
      type: Array,
      // required: true,
      default: () => [],
    },
    defaultFileType: {
      type: String,
      default: null,
    },
    defaultNetworkId: {
      type: String,
      default: null,
    },
    imports: {
        type: Array,
        default: () => []
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    allowedFileTypes: { type: Array, default: () => [] },
  });

  const selectedNetwork = ref(null);

  const isSendDisabled = computed(() => {
    return (
      uploading.value ||
      !areAllFileTypesSelected.value
      // addedFiles.value.some(
      //   (att) =>
      //     (att.fileType === "Server" ||
      //       att.fileType === "Application" ||
      //       att.fileType === "Task") 
            //!selectedNetwork.value,
      // )
    );
  });
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
