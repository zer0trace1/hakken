<template>
  <div style="padding:24px;">Procesando login...</div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { handleAuthCallback } from "@/auth/oidc";

const router = useRouter();

onMounted(async () => {
  try {
    const user = await handleAuthCallback();
    const returnTo = (user && user.state) ? user.state : "/dashboard";
    router.replace(returnTo);
  } catch (e) {
    console.error("Auth callback error:", e);
    router.replace("/");
  }
});
</script>
