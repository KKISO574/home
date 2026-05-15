import { computed, onMounted, ref } from "vue";
import { getAdcode, getOtherWeather, getWeather } from "@/api";

const fallbackLocation = {
  label: "淮南",
  latitude: 32.62639,
  longitude: 116.99694,
  source: "fallback",
  accuracy: null,
};

const getTemperature = (min, max) => {
  const average = (Number(min) + Number(max)) / 2;
  return Number.isFinite(average) ? Math.round(average) : null;
};

const getRectangleCenter = (rectangle = "") => {
  if (typeof rectangle !== "string") return null;

  const points = rectangle
    .split(";")
    .map((point) => point.split(",").map(Number))
    .filter(([longitude, latitude]) => Number.isFinite(longitude) && Number.isFinite(latitude));

  if (points.length < 2) return null;

  const longitude = points.reduce((sum, point) => sum + point[0], 0) / points.length;
  const latitude = points.reduce((sum, point) => sum + point[1], 0) / points.length;

  return {
    latitude,
    longitude,
  };
};

const getAreaLabel = (adCode = {}) => {
  const city = typeof adCode.city === "string" ? adCode.city : "";
  const province = typeof adCode.province === "string" ? adCode.province : "";
  return city || province || "当前位置";
};

export const useWeather = () => {
  const weatherState = ref({
    city: "",
    weather: "",
    temperature: "",
    winddirection: "",
    windpower: "",
  });
  const locationState = ref({ ...fallbackLocation });

  const mainKey = import.meta.env.VITE_WEATHER_KEY;

  const refreshWeather = async () => {
    try {
      if (!mainKey) {
        const backupResult = await getOtherWeather();
        const data = backupResult.result;
        const city = data?.city?.City || "当前位置";

        weatherState.value = {
          city,
          weather: data?.condition?.day_weather || "天气同步暂不可用",
          temperature: getTemperature(data?.condition?.min_degree, data?.condition?.max_degree),
          winddirection: data?.condition?.day_wind_direction || "",
          windpower: data?.condition?.day_wind_power || "",
        };
        locationState.value = {
          ...fallbackLocation,
          label: city,
          source: "backup",
        };
        return;
      }

      const adCode = await getAdcode(mainKey);
      if (adCode.infocode !== "10000") {
        throw new Error("地区查询失败");
      }

      const ipCenter = getRectangleCenter(adCode.rectangle);
      if (ipCenter) {
        locationState.value = {
          label: getAreaLabel(adCode),
          latitude: ipCenter.latitude,
          longitude: ipCenter.longitude,
          accuracy: null,
          source: "amap-ip",
        };
      }

      const result = await getWeather(mainKey, adCode.adcode);
      const liveData = result.lives?.[0];
      if (!liveData) {
        weatherState.value = {
          city: getAreaLabel(adCode),
          weather: "天气同步暂不可用",
          temperature: "",
          winddirection: "",
          windpower: "",
        };
        return;
      }

      weatherState.value = {
        city: getAreaLabel(adCode),
        weather: liveData.weather,
        temperature: liveData.temperature,
        winddirection: liveData.winddirection,
        windpower: liveData.windpower,
      };
    } catch (error) {
      weatherState.value = {
        city: locationState.value.label || "当前位置",
        weather: "天气同步暂不可用",
        temperature: "",
        winddirection: "",
        windpower: "",
      };
    }
  };

  const weatherLine = computed(() => {
    const { city, weather, temperature, winddirection, windpower } = weatherState.value;
    const segments = [city || "当前位置", weather || "天气同步暂不可用", temperature ? `${temperature}°C` : ""].filter(Boolean);
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
    locationState,
    weatherLine,
    refreshWeather,
  };
};
