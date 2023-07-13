import { useState, useRef, ChangeEvent, useEffect } from "react";
import { formatTime } from "../utils/formatTime";
import { FaPlay, FaPause } from "react-icons/fa";

/**
 * @returns A component that allows the user to select a file and play it.
 */
export default function SongPlayer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoaded = useRef(false); // Track whether the audio is loaded
  const [isPlaying, setIsPlaying] = useState(false); // Track whether the audio is playing

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(event.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    audioRef.current?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !selectedFile) return;

    audioRef.current.src = URL.createObjectURL(selectedFile);

    // Reset the current time when the audio is loaded
    const handleLoadedMetadata = () => {
      setCurrentTime(0);
      isLoaded.current = true;
    };

    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audioRef.current?.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    };
  }, [selectedFile]);

  useEffect(() => {
    // Play the audio after it's loaded if it was already playing
    if (isLoaded.current) {
      handlePlay();
    }
  }, [isLoaded]);

  useEffect(() => {
    // Set playing to false when the audio ends
    if (currentTime === audioRef.current?.duration) setIsPlaying(false);
  }, [audioRef.current, currentTime]);

  const renderPlayButton = () => {
    if (!isPlaying) {
      return (
        <button onClick={handlePlay}>
          <FaPlay />
        </button>
      );
    } else {
      return (
        <button onClick={handlePause}>
          <FaPause />
        </button>
      );
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <audio ref={audioRef} />
      {renderPlayButton()}
      <span>{formatTime(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={audioRef.current?.duration}
        value={currentTime}
        onChange={handleSliderChange}
      />
      {audioRef.current && <span>{formatTime(audioRef.current.duration)}</span>}
    </div>
  );
}
