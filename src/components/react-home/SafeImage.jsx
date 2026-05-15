import { useEffect, useState } from "react";

export const SafeImage = ({ src, fallbackSrc, alt = "", onLoad, onError, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [failed, setFailed] = useState(false);
  const { decoding, ...imageProps } = props;

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setFailed(false);
  }, [fallbackSrc, src]);

  if (!currentSrc || failed) return null;

  return (
    <img
      {...imageProps}
      alt={alt}
      src={currentSrc}
      decoding={decoding || "async"}
      onLoad={(event) => {
        setFailed(false);
        onLoad?.(event);
      }}
      onError={(event) => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          return;
        }
        setFailed(true);
        onError?.(event);
      }}
    />
  );
};
