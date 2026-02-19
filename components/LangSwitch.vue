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

const { locales, locale, setLocale } = useI18n();

const language = computed({
    get: () => locale.value,
    set: (value) => {
        setLocale(value);
    },
})

</script>

<style>

</style>