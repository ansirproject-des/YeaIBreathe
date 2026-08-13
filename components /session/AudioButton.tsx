"use client";

import { useEffect, useRef, useState } from "react";
import { AudioLines, VolumeX } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { Popover } from "../ui/Popover";

type AudioButtonProps = {
  disabled: boolean;
};

export default function AudioButton({
  disabled,
}: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/breathingBg.mp3");
    audioRef.current.volume = 0.5;

    return () => {
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleSound = async () => {
    if (disabled) return;
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };

  const button = (
    <IconButton
      onClick={toggleSound}
      disabled={disabled}
    >
      {isPlaying ? (
        <AudioLines className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </IconButton>
  );

  return disabled ? (
    button
  ) : (
    <>
    <div className="hidden sm:block">
    <Popover
      body="Turn on sound"
      placement="bottom"
      variant="compact"
      align="end"
    >
      {button}
    </Popover>
    </div>

    <div className="sm:hidden">
      {button}
    </div>
    </>
  );
}