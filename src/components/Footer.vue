<script setup lang="ts">
    const year = new Date().getFullYear();
</script>

<template>
    <span class="w-full bg-primary py-4 flex flex-row justify-center font-tektur text-lg md:text-xl">
        © {{ year }} Sound Box. Все права защищены.
    </span>
</template>
