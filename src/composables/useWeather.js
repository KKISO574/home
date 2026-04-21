import { computed, onMounted, ref } from "vue";
import { getAdcode, getOtherWeather, getWeather } from "@/api";

const getTemperature = (min, max) => {
  const average = (Number(min) + Number(max)) / 2;
  return Number.isFinite(average) ? Math.round(average) : null;
};

export const useWeather = () => {
  const weatherState = ref({
    city: "",
    weather: "",
    temperature: "",
    winddirection: "",
    windpower: "",
  });

  const mainKey = import.meta.env.VITE_WEATHER_KEY;

  const refreshWeather = async () => {
    try {
      if (!mainKey) {
        const backupResult = await getOtherWeather();
        const data = backupResult.result;

        weatherState.value = {
          city: data.city.City || "未知地区",
          weather: data.condition.day_weather || "天气未知",
          temperature: getTemperature(data.condition.min_degree, data.condition.max_degree),
          winddirection: data.condition.day_wind_direction || "",
          windpower: data.condition.day_wind_power || "",
        };
        return;
      }

      const adCode = await getAdcode(mainKey);
      if (adCode.infocode !== "10000") {
        throw new Error("地区查询失败");
      }

      const result = await getWeather(mainKey, adCode.adcode);
      const liveData = result.lives?.[0];
      if (!liveData) {
        throw new Error("天气数据为空");
      }

      weatherState.value = {
        city: adCode.city,
        weather: liveData.weather,
        temperature: liveData.temperature,
        winddirection: liveData.winddirection,
        windpower: liveData.windpower,
      };
    } catch (error) {
      console.error("天气信息获取失败:", error);
      weatherState.value = {
        city: "当前网络",
        weather: "天气接口暂不可用",
        temperature: "",
        winddirection: "",
        windpower: "",
      };
    }
  };

  const weatherLine = computed(() => {
    const { city, weather, temperature, winddirection, windpower } = weatherState.value;
    const segments = [city, weather, temperature ? `${temperature}°C` : ""].filter(Boolean);
    if (winddirection) {
      const directionText = winddirection.endsWith("风") ? winddirection : `${winddirection}风`;
      segments.push(directionText);
    }
    if (windpower) {
      segments.push(`${windpower}级`);
    }
    return segments.join(" / ");
  });

  onMounted(() => {
    refreshWeather();
  });

  return {
    weatherState,
    weatherLine,
    refreshWeather,
  };
};
