import { useCallback, useEffect, useMemo, useState } from "react";
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
  return Number.isFinite(average) ? Math.round(average) : "";
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

const createFallbackWeather = (label = "当前位置") => ({
  city: label,
  weather: "岛屿天气暂不可用",
  temperature: "",
  winddirection: "",
  windpower: "",
});

export const useWeather = () => {
  const [weatherState, setWeatherState] = useState(() => createFallbackWeather("天气同步中"));
  const [locationState, setLocationState] = useState({ ...fallbackLocation });
  const [loading, setLoading] = useState(true);

  const refreshWeather = useCallback(async () => {
    setLoading(true);
    try {
      const mainKey = import.meta.env.VITE_WEATHER_KEY;

      if (!mainKey) {
        const backupResult = await getOtherWeather();
        const data = backupResult?.result;
        const city = data?.city?.City || fallbackLocation.label;

        setWeatherState({
          city,
          weather: data?.condition?.day_weather || "天气同步中",
          temperature: getTemperature(data?.condition?.min_degree, data?.condition?.max_degree),
          winddirection: data?.condition?.day_wind_direction || "",
          windpower: data?.condition?.day_wind_power || "",
        });
        setLocationState({
          ...fallbackLocation,
          label: city,
          source: "backup",
        });
        return;
      }

      const adCode = await getAdcode(mainKey);
      if (adCode?.infocode !== "10000") {
        throw new Error("地区查询失败");
      }

      const areaLabel = getAreaLabel(adCode);
      const ipCenter = getRectangleCenter(adCode.rectangle);
      if (ipCenter) {
        setLocationState({
          label: areaLabel,
          latitude: ipCenter.latitude,
          longitude: ipCenter.longitude,
          accuracy: null,
          source: "amap-ip",
        });
      }

      const result = await getWeather(mainKey, adCode.adcode);
      const liveData = result?.lives?.[0];
      if (!liveData) {
        setWeatherState(createFallbackWeather(areaLabel));
        return;
      }

      setWeatherState({
        city: areaLabel,
        weather: liveData.weather || "天气同步中",
        temperature: liveData.temperature || "",
        winddirection: liveData.winddirection || "",
        windpower: liveData.windpower || "",
      });
    } catch (error) {
      setWeatherState(createFallbackWeather(locationState.label || fallbackLocation.label));
    } finally {
      setLoading(false);
    }
  }, [locationState.label]);

  useEffect(() => {
    refreshWeather();
  }, [refreshWeather]);

  const weatherLine = useMemo(() => {
    const { city, weather, temperature, winddirection, windpower } = weatherState;
    if (loading && (!city || city === "天气同步中")) return "天气同步中";

    const segments = [city || "当前位置", weather || "岛屿天气暂不可用", temperature ? `${temperature}°C` : ""].filter(
      Boolean,
    );

    if (winddirection) {
      const directionText = winddirection.endsWith("风") ? winddirection : `${winddirection}风`;
      segments.push(directionText);
    }
    if (windpower) {
      segments.push(`${windpower}级`);
    }
    return segments.join(" / ");
  }, [loading, weatherState]);

  return {
    weatherState,
    locationState,
    weatherLine,
    loading,
    refreshWeather,
  };
};
