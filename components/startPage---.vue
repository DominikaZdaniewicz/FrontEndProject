<template>
    <v-container
        class="mt-12 d-flex flex-column justify-center align-center">
        <v-btn 
            class="w-25 mx-2 my-2"
            :to="localPath('/servers')">
            {{ $t("serversBtn") }}
        </v-btn>
        <v-btn 
            class="w-25 mx-2 my-2"
            :to="localPath('/applications')">
            {{ $t("applicationsBtn") }}
        </v-btn>
        <v-btn 
            class="w-25 mx-2 my-2"
            :to="localPath('/tasks')">
            {{ $t("tasksBtn") }}
        </v-btn>
        <v-btn 
            class="w-25 mx-2 my-2"
            :to="localPath('/basicInfo')">
            {{ $t("basicInfo") }}
        </v-btn> 
    </v-container>
</template>

<script setup>
    const localPath = useLocalePath();

    // definePageMeta({
    //     layout: "start"
    // })

</script>

<style scoped>

  .lang-switch {
    position: absolute;
    right: 17%;
  }

  .link:hover {
    text-decoration: underline;
    cursor: pointer;
    color: white;
    text-decoration: none;
  }

  .link {
    color: white;
    text-decoration: none;
    text-underline-position: below;
  }

</style>