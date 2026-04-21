import { onMounted, reactive } from "vue";
import { getHitokoto } from "@/api";

export const useHitokoto = () => {
  const quote = reactive({
    text: "正在同步今日讯号。",
    from: "今日摘录",
  });

  const refreshQuote = async () => {
    try {
      const result = await getHitokoto();
      quote.text = result.hitokoto || "正在同步今日讯号。";
      quote.from = result.from || "今日摘录";
    } catch (error) {
      console.error("一言获取失败:", error);
      quote.text = "接口暂时没有回应，但空间仍然在线。";
      quote.from = "今日摘录";
    }
  };

  onMounted(() => {
    refreshQuote();
  });

  return {
    quote,
    refreshQuote,
  };
};
