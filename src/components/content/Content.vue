<script setup lang="ts">
import Contacts from './Contacts.vue';
import AppNav from './AppNav.vue';
</script>

<template>
    <div
        class="w-full h-full bg-secondary rounded-lg overflow-clip flex flex-col items-center justify-start space-y-7">
        <AppNav />
        <Contacts />
    </div>
</template>
