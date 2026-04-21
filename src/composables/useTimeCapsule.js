import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getTimeCapsule, siteDateStatistics } from "@/utils/getTime.js";

export const useTimeCapsule = (startDate) => {
  const capsuleState = ref(getTimeCapsule());
  const timer = ref(null);

  const refreshCapsule = () => {
    capsuleState.value = getTimeCapsule();
  };

  const capsuleList = computed(() =>
    Object.entries(capsuleState.value).map(([key, value]) => ({
      key,
      ...value,
      unit: key === "day" ? "小时" : "天",
    })),
  );

  const siteAge = computed(() => {
    if (!startDate) return "持续运行中";
    return siteDateStatistics(new Date(startDate));
  });

  onMounted(() => {
    refreshCapsule();
    timer.value = window.setInterval(refreshCapsule, 1000);
  });

  onBeforeUnmount(() => {
    window.clearInterval(timer.value);
  });

  return {
    capsuleList,
    siteAge,
  };
};
