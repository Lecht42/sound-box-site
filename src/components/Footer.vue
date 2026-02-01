<script setup lang="ts">
    const year = new Date().getFullYear();
</script>

<template>
    <footer class="w-full bg-primary py-4 flex flex-row justify-center font-tektur text-center text-lg md:text-xl">
        © {{ year }} Sound Box. Все права защищены.
    </footer>
</template>
