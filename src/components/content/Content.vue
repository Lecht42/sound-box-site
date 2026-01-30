<script setup lang="ts">
import Menu from './Menu.vue';


</script>

<template>
    <div class="w-full h-full min-h-screen bg-secondary rounded-lg overflow-clip flex flex-col items-center justify-start">
        <Menu />
        <router-view />
    </div>
</template>
