<template>
  <div class="time-component drop-shadow sm:text-center text-[#fff] text-[24px] sm:text-[48px] md:text-[64px]">
    {{ formattedTime }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const formattedTime = ref('');
let intervalId;

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  formattedTime.value = `${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
</style>