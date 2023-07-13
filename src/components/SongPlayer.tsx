import { useState, useRef, ChangeEvent } from "react";

/**
 * @returns A component that allows the user to select a file and play it.
 */
export default function SongPlayer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const handlePlay = () => {
    audioRef.current?.play();
  };

  const handlePause = () => {
    audioRef.current?.pause();
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <audio
        ref={audioRef}
        src={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
      />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
}
