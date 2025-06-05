<script setup>
import { ref } from 'vue'

const iframeSrc = ref('/dist/index.html')
const iframeLoaded = ref(false)

const onIframeLoad = () => {
  iframeLoaded.value = true
  console.log('Iframe content loaded successfully')
}

const onIframeError = () => {
  console.error('Error loading iframe content')
}
</script>

<template>
  <div class="app-container">
    <iframe 
      :src="iframeSrc"
      @load="onIframeLoad"
      @error="onIframeError"
      frameborder="0"
      width="100%"
      height="100%"
      class="content-iframe"
      title="Dist Content"
    ></iframe>
    
    <!-- Loading indicator -->
    <div v-if="!iframeLoaded" class="loading">
      Loading content...
    </div>
  </div>
</template>

<style>
.app-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: relative;
}

.content-iframe {
  border: none;
  outline: none;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #666;
}
</style>
