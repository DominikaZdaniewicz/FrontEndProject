<template>
    <v-container
        class="d-flex flex-column justify-center align-center">
        <v-btn 
            class="mx-2 mb-4 bg-surface-variant btn"
            :to="localPath('/auth/login')">
            {{ $t("signInBtn") }}
        </v-btn>
        <!-- <v-btn 
            class="w-25 mx-2 my-2"
            :to="localPath('/auth/register')">
            {{ $t("signUpBtn") }}
        </v-btn> -->
        <a 
            href="/auth/register"
            class="link">
            {{ $t("signUpBtn") }}
        </a>
    </v-container>   
</template>

<script setup>

    const localPath = useLocalePath();

    definePageMeta({
        layout: "start"
    })

</script>

<style scoped>

  .link:hover {
    text-decoration: underline;
    cursor: pointer;
    color: white;
    text-decoration: none;
  }

  .link {
    color: white;
    text-decoration: underline;
  }

  .btn {
    width: 15%;
  }

</style>


