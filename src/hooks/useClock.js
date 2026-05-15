import { useEffect, useMemo, useState } from "react";

const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

const pad = (value) => String(value).padStart(2, "0");

const createClock = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: pad(now.getMonth() + 1),
    day: pad(now.getDate()),
    hour: pad(now.getHours()),
    minute: pad(now.getMinutes()),
    second: pad(now.getSeconds()),
    weekday: weekdays[now.getDay()],
    hourValue: now.getHours(),
  };
};

export const useClock = () => {
  const [clock, setClock] = useState(createClock);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(createClock()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(
    () => ({
      ...clock,
      dateLine: `${clock.year}.${clock.month}.${clock.day} ${clock.weekday}`,
      timeLine: `${clock.hour}:${clock.minute}:${clock.second}`,
    }),
    [clock],
  );
};
