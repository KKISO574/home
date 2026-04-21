import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getCurrentTime } from "@/utils/getTime.js";

export const useClock = () => {
  const currentTime = ref(getCurrentTime());
  const timer = ref(null);

  const tick = () => {
    currentTime.value = getCurrentTime();
  };

  const dateLine = computed(
    () =>
      `${currentTime.value.year}.${currentTime.value.month}.${currentTime.value.day} ${currentTime.value.weekday}`,
  );

  const timeLine = computed(
    () => `${currentTime.value.hour}:${currentTime.value.minute}:${currentTime.value.second}`,
  );

  const hourValue = computed(() => Number(currentTime.value.hour || 0));

  onMounted(() => {
    tick();
    timer.value = window.setInterval(tick, 1000);
  });

  onBeforeUnmount(() => {
    window.clearInterval(timer.value);
  });

  return {
    currentTime,
    dateLine,
    timeLine,
    hourValue,
  };
};
