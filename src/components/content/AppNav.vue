<script setup lang="ts">
import { useRoute } from "vue-router";
import { routes as appRoutes } from '../../router';

const _routes = appRoutes.filter((route) => route.meta?.nav);
const route = useRoute();
const isCurrent = (path: string) => route.path === path;
const isCurrentStyle = "text-link underline";
</script>

<template>
    <span class="w-full bg-primary py-2 flex flex-row justify-between">
        <router-link class="flex-1" v-for="route in _routes" :key="route.path" :to="route.path" :aria-current="isCurrent(route.path) ? 'page' : undefined">
            <span class="h-like text-black text-center w-full hover:text-link" :class="isCurrent(route.path) && isCurrentStyle">{{ route.name }}</span>
        </router-link>
    </span>

    <router-view class="view" />
</template>
