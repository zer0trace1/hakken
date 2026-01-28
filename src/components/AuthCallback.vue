<template>
  <div style="padding: 24px;">
    <h2>Procesando login...</h2>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { handleAuthCallback } from "@/auth/oidc";

const router = useRouter();

onMounted(async () => {
  try {
    const user = await handleAuthCallback();
    // user.state es lo que pusimos en signIn()
    const returnTo = user?.state || "/dashboard";
    router.replace(returnTo);
  } catch (e) {
    console.error("Error en callback OIDC:", e);
    router.replace("/");
  }
});
</script>