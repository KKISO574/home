import { useEffect, useState } from "react";
import { Button, Card, Divider, Icon, Loading } from "animal-island-ui";
import { SafeImage } from "@/components/react-home/SafeImage.jsx";
import { formatDuration, useMusicPlayer } from "@/hooks/useMusicPlayer.js";

const playlistSkeletonItems = Array.from({ length: 6 }, (_, index) => index);

export const IslandMusic = () => {
  const [coverReady, setCoverReady] = useState(false);
  const player = useMusicPlayer();
  const {
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
    canNavigate,
    progress,
    loadedProgress,
    togglePlayback,
    changeTrack,
    playTrack,
    seekToPercent,
    setVolume,
  } = player;

  useEffect(() => {
    setCoverReady(false);
  }, [currentTrack.cover]);

  useEffect(() => {
    const activeItem = document.querySelector(".playlist-item.active");
    if (!activeItem) return;

    activeItem.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [currentIndex]);

  return (
    <section className="island-section" id="music">
      <div className="section-container">
        <div className="section-heading">
          <Icon name="icon-critterpedia" size={30} bounce />
          <div>
            <span className="eyebrow">Now Playing</span>
            <h2>海边音乐台</h2>
          </div>
        </div>

        <div className="music-grid">
          <Card className="music-player-card" type="title">
            <div className="music-main">
              <div className={coverReady ? "cover-shell cover-loaded" : "cover-shell"}>
                <div className="cover-placeholder" aria-hidden="true">
                  <span className="island-disc">
                    <Icon name="icon-miles" size={62} />
                  </span>
                </div>
                {currentTrack.cover ? (
                  <SafeImage
                    src={currentTrack.cover}
                    alt={currentTrack.name}
                    loading="eager"
                    fetchPriority="low"
                    onLoad={() => setCoverReady(true)}
                    onError={() => setCoverReady(false)}
                  />
                ) : null}
              </div>

              <div className="music-copy">
                <span className="eyebrow">{isPlaying ? "播放中" : "待机中"}</span>
                <h3>{currentTrack.name || "等待歌单"}</h3>
                <p>{currentTrack.artist || "音乐同步中"}</p>
                <div className="music-state">
                  {loading && !playlist.length ? (
                    <>
                      <Loading />
                      <span>歌单同步中</span>
                    </>
                  ) : (
                    <span>{error || (loading ? "歌单后台同步中" : `${playlist.length} 首歌已装载`)}</span>
                  )}
                </div>
              </div>
            </div>

            <Divider type="wave-yellow" />

            <div className="timeline-area">
              <div className="timeline-label">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
              <div className="range-shell">
                <span className="loaded-bar" style={{ width: `${loadedProgress}%` }} />
                <span className="played-bar" style={{ width: `${progress}%` }} />
                <input
                  aria-label="播放进度"
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  disabled={!canControl || !duration}
                  onChange={(event) => seekToPercent(Number(event.target.value))}
                />
              </div>
            </div>

            <div className="player-controls">
              <Button type="default" disabled={!canNavigate} onClick={() => changeTrack(-1)}>
                上一首
              </Button>
              <Button type="primary" size="large" disabled={!canControl} onClick={togglePlayback}>
                {isPlaying ? "暂停" : "播放"}
              </Button>
              <Button type="default" disabled={!canNavigate} onClick={() => changeTrack(1)}>
                下一首
              </Button>
            </div>

            <label className="volume-control">
              <span>音量</span>
              <input
                aria-label="音量"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
              />
              <strong>{Math.round(volume * 100)}%</strong>
            </label>
          </Card>

          <Card className="playlist-card" type="dashed">
            <div className="playlist-head">
              <span>歌单列表</span>
              <strong>{playlist.length || 0} 首</strong>
            </div>
            <div className="playlist-list">
              {playlist.length ? (
                playlist.map((track, index) => (
                  <button
                    className={index === currentIndex ? "playlist-item active" : "playlist-item"}
                    key={`${track.name}-${track.artist}-${index}`}
                    type="button"
                    onClick={() => playTrack(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{track.name}</strong>
                    <small>{track.artist || "Unknown Artist"}</small>
                  </button>
                ))
              ) : (
                <>
                  {loading ? (
                    <div className="playlist-skeleton" aria-label="歌单同步中">
                      {playlistSkeletonItems.map((item) => (
                        <span className="playlist-skeleton-row" key={item}>
                          <i />
                          <b />
                          <em />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="playlist-empty">{error || "暂无歌曲"}</div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
