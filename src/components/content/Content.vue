<script setup lang="ts">
import Contacts from './Contacts.vue';
import Menu from './AppNav.vue';
</script>

<template>
    <div class="w-full h-full min-h-screen bg-secondary rounded-lg overflow-clip flex flex-col items-center justify-start">
        <Menu />

        <Contacts />
    </div>
</template>
