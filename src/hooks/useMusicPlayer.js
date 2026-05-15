import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPlayerList } from "@/api";

const defaultTrack = {
  name: "等待歌单",
  artist: "音乐同步中",
  url: "",
  cover: "",
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const formatDuration = (value) => {
  if (!Number.isFinite(value) || value <= 0) return "00:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const useMusicPlayer = () => {
  const audioRef = useRef(null);
  const playlistLengthRef = useRef(0);
  const shouldPlayOnTrackChangeRef = useRef(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedTime, setLoadedTime] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentTrack = playlist[currentIndex] || defaultTrack;
  const canControl = Boolean(currentTrack?.url && playlist.length && !error);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.7;
    audioRef.current = audio;

    const updateTime = () => {
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);

      const ranges = audio.buffered;
      if (ranges.length && Number.isFinite(audio.duration)) {
        setLoadedTime(ranges.end(ranges.length - 1));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      const listLength = playlistLengthRef.current;
      if (listLength) {
        shouldPlayOnTrackChangeRef.current = true;
        setCurrentIndex((index) => (index + 1) % listLength);
      }
    };

    const handleError = () => {
      setIsPlaying(false);
      setError("当前歌曲暂时无法播放");
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("progress", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("durationchange", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("progress", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    playlistLengthRef.current = playlist.length;
  }, [playlist.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    let mounted = true;

    const loadPlaylist = async () => {
      const server = import.meta.env.VITE_SONG_SERVER;
      const type = import.meta.env.VITE_SONG_TYPE;
      const id = import.meta.env.VITE_SONG_ID;

      if (!server || !type || !id || !import.meta.env.VITE_SONG_API) {
        setPlaylist([]);
        setError("歌单配置未填写");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await getPlayerList(server, type, id);
        if (!mounted) return;

        const nextPlaylist = Array.isArray(result)
          ? result.filter((track) => track?.url).slice(0, 50)
          : [];

        if (!nextPlaylist.length) {
          setPlaylist([]);
          setError("歌单暂时无法装载");
          return;
        }

        setPlaylist(nextPlaylist);
        setCurrentIndex(0);
        setError("");
      } catch (requestError) {
        if (!mounted) return;
        setPlaylist([]);
        setError("歌单暂时无法装载");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPlaylist();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.url) return;

    const shouldPlay = isPlaying || shouldPlayOnTrackChangeRef.current;
    shouldPlayOnTrackChangeRef.current = false;
    audio.pause();
    audio.src = currentTrack.url;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setLoadedTime(0);
    setError("");

    if (shouldPlay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setError("浏览器需要先点击播放");
        });
    }
  }, [currentIndex, currentTrack?.url]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !canControl) return;
    try {
      if (!audio.src) {
        audio.src = currentTrack.url;
      }
      await audio.play();
      setIsPlaying(true);
      setError("");
    } catch (playError) {
      setIsPlaying(false);
      setError("浏览器需要先点击播放");
    }
  }, [canControl, currentTrack.url]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    play();
  }, [isPlaying, pause, play]);

  const changeTrack = useCallback(
    (direction) => {
      if (!playlist.length) return;
      shouldPlayOnTrackChangeRef.current = isPlaying;
      setCurrentIndex((index) => (index + direction + playlist.length) % playlist.length);
    },
    [isPlaying, playlist.length],
  );

  const playTrack = useCallback(
    (index) => {
      if (!playlist[index]) return;
      shouldPlayOnTrackChangeRef.current = true;
      setCurrentIndex(index);
      if (index === currentIndex) {
        play();
      }
    },
    [currentIndex, play, playlist],
  );

  const seekToPercent = useCallback(
    (percent) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = clamp(percent, 0, 100) * 0.01 * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration],
  );

  const setVolume = useCallback((nextVolume) => {
    const safeVolume = clamp(Number(nextVolume), 0, 1);
    setVolumeState(safeVolume);
    if (audioRef.current) {
      audioRef.current.volume = safeVolume;
    }
  }, []);

  const progress = useMemo(() => {
    if (!duration) return 0;
    return clamp((currentTime / duration) * 100, 0, 100);
  }, [currentTime, duration]);

  const loadedProgress = useMemo(() => {
    if (!duration) return 0;
    return clamp((loadedTime / duration) * 100, 0, 100);
  }, [duration, loadedTime]);

  return {
    playlist,
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    loading,
    error,
    canControl,
    progress,
    loadedProgress,
    play,
    pause,
    togglePlayback,
    changeTrack,
    playTrack,
    seekToPercent,
    setVolume,
  };
};
