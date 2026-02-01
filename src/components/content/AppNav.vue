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
        <router-link v-for="route in routes" :key="route.path" :to="route.path">
            <h1 :class="isCurrent(route.path) && isCurrentStyle">{{ route.name }}</h1>
        </router-link>
    </span>

    <router-view class="view" />
</template>
