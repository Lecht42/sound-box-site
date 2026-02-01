<script setup lang="ts">
import { useRoute } from "vue-router";
import {router} from '../../router';

const routes = router.getRoutes();
const route = useRoute();
const isCurrent = (path: string) => route.path === path;
const isCurrentStyle = "text-link underline";
</script>

<template>
    <span class="w-full bg-primary py-2 flex flex-row justify-around font-tektur text-lg md:text-xl">
        <router-link :to="routes[0].path">
            <h1 :class="isCurrent(routes[0].path) && isCurrentStyle">Главная</h1>
        </router-link>
        <router-link :to="routes[1].path">
            <h1 :class="isCurrent(routes[1].path) && isCurrentStyle">Товары и услуги</h1>
        </router-link>
        <router-link :to="routes[2].path">
            <h1 :class="isCurrent(routes[2].path) && isCurrentStyle">Новости</h1>
        </router-link>
    </span>
</template>
