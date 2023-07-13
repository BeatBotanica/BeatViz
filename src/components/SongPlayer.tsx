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
    <div className="w-full flex flex-col items-center space-y-8">
      <div className="w-full">
        <div className="flex items-center justify-start">
          <label
            htmlFor="file-input"
            className="rounded p-2 border border-gray-300 bg-white text-gray-700 shadow cursor-pointer"
          >
            Choose File
          </label>{" "}
          {selectedFile && <span className="ml-2">{selectedFile.name}</span>}
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
      </div>
      <div className="w-full flex flex-row items-center space-x-4">
        <audio ref={audioRef} />
        {renderPlayButton()}
        <input
          type="range"
          min={0}
          max={audioRef.current?.duration}
          value={currentTime}
          onChange={handleSliderChange}
          className="min-w-[500px] accent-indigo-500 bg-indigo-100 dark:bg-indigo-900"
        />
        <div className="flex items-center rounded-md shadow-sm p-2 bg-[#f9f9f9] dark:bg-[#1a1a1a] cursor-default">
          <span className="mr-2">{formatTime(currentTime)}</span>
          {"/"}
          {audioRef.current && (
            <span className="ml-2">
              {formatTime(audioRef.current.duration)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
