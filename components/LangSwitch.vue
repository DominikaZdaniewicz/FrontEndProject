<template>
  <v-select
    v-model="language"
    :label= "$t('language')"
    :items="locales"
    item-title="name"
    item-value="code"
    variant="solo"
    style="max-height: 100px"
    hide-details
  ></v-select>
</template>

<script setup>
import { useLocale } from 'vuetify'
  const { locales, locale, setLocale } = useI18n();

  const { current } = useLocale()

  const language = computed({
      get: () => locale.value,
      set: (selectedLang) => {
          setLocale(selectedLang);
          current.value = selectedLang;
      },
})

</script>

<style>

</style>