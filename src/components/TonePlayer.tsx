"use client"

import { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Button } from './ui/button'
import { Slider } from "@/components/ui/slider"

const T4 = () => {
  const [file, setFile] = useState<File | null>(null)
  const playerRef = useRef<Tone.Player | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [scheduleRepeatID, setScheduleRepeatID] = useState<number | null>(null);
//   const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    let intervalID : number|null = null
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const buffer = await Tone.getContext().decodeAudioData(e.target?.result as ArrayBuffer)
        setDuration(buffer.duration)
        playerRef.current = new Tone.Player(buffer).toDestination();
        // playerRef.current.sync();
        // playerRef.current.start(0).stop(duration);
        // Sync with Tone.Transport
        Tone.getTransport().loop = false;
        Tone.getTransport().seconds = 0; // Reset transport time
        
      }
      reader.readAsArrayBuffer(file)
    }

  }, [file])

  useEffect(() => {

    if (isPlaying) {
        setScheduleRepeatID(Tone.getTransport().scheduleRepeat(() => {
            if (playerRef.current) {
              console.log(Tone.getTransport().seconds)
              if (Tone.getTransport().seconds >= duration) {
                stopAndReset()
              }
              else
              {
                setProgress((Tone.getTransport().seconds / duration) * 100); // Update progress with transport time
              }
              console.log(`Duration: ${duration}`)
            }
          }, 0.1)); // Update every 100ms
    }

    // Cleanup function
    return () => {
    //   if (intervalRef.current) {
    //     clearInterval(intervalRef.current)
    //   }
    }
  }, [isPlaying, duration])

  const stopAndReset = () => {
    if (playerRef.current) {
        if (scheduleRepeatID) {
            Tone.getTransport().clear(scheduleRepeatID);
            setScheduleRepeatID(null);
        }
      playerRef.current.stop();
      Tone.getTransport().stop();
      Tone.getTransport().seconds = 0;
      setProgress(0);
      setIsPlaying(false);
    }
  }

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (!isPlaying) {
        const currentTime = (progress / 100) * duration;
        playerRef.current.start("+0", currentTime); // Start player from the current position
        Tone.getTransport().start("+0", currentTime); // Sync Transport with player

        setIsPlaying(true);
      } else {
        playerRef.current.stop(); // Stop the player
        Tone.getTransport().pause(); // Pause the transport
        setIsPlaying(false);
      }
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (playerRef.current && duration) {
      const newTime = (value[0] * duration) / 100;

      playerRef.current.seek(newTime); // Seek the player to the new time
      Tone.getTransport().seconds = newTime; // Sync transport time with the slider
      setProgress(value[0]);

      if (isPlaying) {
        playerRef.current.start("+0", newTime); // Start the player from the new position
        Tone.getTransport().start("+0", newTime); // Sync Transport with the new time
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile && uploadedFile.type === 'audio/mpeg') {
      setFile(uploadedFile)
    } else {
      alert('Please upload an MP3 file')
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        accept=".mp3"
        onChange={handleFileUpload}
        className="border border-gray-300 p-2 rounded"
      />
      <Slider 
        value={[progress]} 
        max={100} 
        step={0.1} 
        onValueChange={handleSliderChange}
        disabled={!playerRef.current}
      />

      <div>
        {formatTime((progress / 100) * duration)} / {formatTime(duration)}
      </div>

      {file && (
        <Button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      )}
    </div>
  )
}

export default T4;
