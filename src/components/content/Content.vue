<script setup lang="ts">
import Contacts from './Contacts.vue';
import Menu from './Menu.vue';
</script>

<template>
    <div class="w-full h-full min-h-screen bg-secondary rounded-lg overflow-clip flex flex-col items-center justify-start">
        <Menu />
        <div class="w-full p-4 md:p-12">
            <router-view />
        </div>
    </div>
    <Contacts />
</template>
