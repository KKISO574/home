import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

const dayText = {
  day: "今日",
  week: "本周",
  month: "本月",
  year: "本年",
};

const getTimeCapsule = () => {
  const now = dayjs();

  const getDifference = (unit) => {
    const start = now.startOf(unit);
    const end = now.endOf(unit);
    const total = end.diff(start, unit === "day" ? "hour" : "day") + 1;
    let passed = now.diff(start, unit === "day" ? "hour" : "day");

    if (unit === "week") {
      passed = (passed + 6) % 7;
    }

    const remaining = Math.max(total - passed, 0);
    const percentage = total ? (passed / total) * 100 : 0;

    return {
      name: dayText[unit],
      total,
      passed,
      remaining,
      percentage: Number(percentage.toFixed(2)),
    };
  };

  return {
    day: getDifference("day"),
    week: getDifference("week"),
    month: getDifference("month"),
    year: getDifference("year"),
  };
};

const siteDateStatistics = (startDate) => {
  if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
    return "持续运行中";
  }

  const currentDate = new Date();
  let years = currentDate.getFullYear() - startDate.getFullYear();
  let months = currentDate.getMonth() - startDate.getMonth();
  let days = currentDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `本站已经运行 ${Math.max(years, 0)} 年 ${Math.max(months, 0)} 月 ${Math.max(days, 0)} 天`;
};

export const useTimeCapsule = (startDate) => {
  const [capsuleState, setCapsuleState] = useState(getTimeCapsule);

  useEffect(() => {
    const timer = window.setInterval(() => setCapsuleState(getTimeCapsule()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const capsuleList = useMemo(
    () =>
      Object.entries(capsuleState).map(([key, value]) => ({
        key,
        ...value,
        unit: key === "day" ? "小时" : "天",
      })),
    [capsuleState],
  );

  const siteAge = useMemo(() => {
    if (!startDate) return "持续运行中";
    return siteDateStatistics(new Date(startDate));
  }, [startDate]);

  return {
    capsuleList,
    siteAge,
  };
};
