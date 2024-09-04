<script setup lang="ts">
import 'primeicons/primeicons.css';
import cookies from '@/app/plugins/Cookie';
onMounted(() => {
  const home_uuidFromLS = cookies.get('home_uuid');
  const router = useRouter();
  if (!home_uuidFromLS) {
    router.push('/signUp');
  } else {
    router.push(`/${home_uuidFromLS}`);
  }
});
</script>

<template>
  <Suspense>
    <router-view />
    <template #fallback><BaseLoader /></template>
  </Suspense>
</template>

<style scoped></style>
