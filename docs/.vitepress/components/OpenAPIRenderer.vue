<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter } = useData()

const resolvedSpec = computed(() => frontmatter.value.openapiResolvedRefs)
</script>

<template>
  <div class="openapi-docs">
    <div v-if="resolvedSpec" v-html="resolvedSpec" />
    <div v-else class="loading">
      Loading API documentation...
    </div>
  </div>
</template>

<style scoped>
.openapi-docs {
  margin-top: 2rem;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
}
</style>
