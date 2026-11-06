<script setup lang="ts">
import { inject } from 'vue';
import { FRAMEWORKS, getFrameworkUrl } from 'shared-types';
import { currentFrameworkKey } from '../../config/framework';
import './FrameworkHeader.css';

const CURRENT_FRAMEWORK = inject(currentFrameworkKey, '');

const currentFrameworkName = FRAMEWORKS.find((f) => f.id === CURRENT_FRAMEWORK)?.name;
// Read once at setup, like the React header which renders once at mount
const { pathname, port } = window.location;
</script>

<template>
  <header class="framework-header">
    <span class="current-framework">{{ currentFrameworkName }}</span>
    <nav class="framework-nav">
      <a
        v-for="framework in FRAMEWORKS"
        :key="framework.id"
        :href="getFrameworkUrl(CURRENT_FRAMEWORK, framework.id, pathname, port)"
        :class="`framework-link ${framework.id === CURRENT_FRAMEWORK ? 'active' : ''}`"
        :style="{ '--framework-color': framework.color }"
        >{{ framework.name }}</a
      >
    </nav>
  </header>
</template>
