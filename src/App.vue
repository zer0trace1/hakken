<template>
  <router-view />
</template>

<script setup>
</script>

<style>
/* Variables CSS globales */
:root {
  --bg-primary: #0d0d0d;
  --bg-secondary: #1a1a1a;
  --bg-card: #151515;
  --text-primary: #ffffff;
  --text-secondary: #999999;
  --border-color: rgba(0, 255, 153, 0.2);
}

/* Reset global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* Clases de tema */
body.light-theme {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-card: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #495057;
  --border-color: rgba(0, 255, 153, 0.3);
}

body.dark-theme {
  --bg-primary: #0d0d0d;
  --bg-secondary: #1a1a1a;
  --bg-card: #151515;
  --text-primary: #ffffff;
  --text-secondary: #999999;
  --border-color: rgba(0, 255, 153, 0.2);
}
</style>