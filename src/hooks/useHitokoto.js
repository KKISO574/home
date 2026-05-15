import { useCallback, useEffect, useState } from "react";
import { getHitokoto } from "@/api";

const fallbackQuote = {
  text: "正在同步今日摘录。",
  from: "今日摘录",
};

export const useHitokoto = () => {
  const [quote, setQuote] = useState(fallbackQuote);
  const [loading, setLoading] = useState(false);

  const refreshQuote = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getHitokoto();
      setQuote({
        text: result?.hitokoto || "今天也适合慢慢整理自己的小岛。",
        from: result?.from || "今日摘录",
      });
    } catch (error) {
      setQuote({
        text: "暂时没有新的摘录，先听一会儿海风。",
        from: "今日摘录",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshQuote();
  }, [refreshQuote]);

  return {
    quote,
    loading,
    refreshQuote,
  };
};
