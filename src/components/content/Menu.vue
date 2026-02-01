<script setup lang="ts">

</script>

<template>
    <span class="w-full bg-primary py-2 flex flex-row justify-around font-tektur text-lg md:text-xl">
        <router-link to="/">
            <h1>Главная</h1>
        </router-link>
        <router-link to="/services">
            <h1>Товары и услуги</h1>
        </router-link>
        <router-link to="/blog">
            <h1>Новости</h1>
        </router-link>
    </span>
</template>
