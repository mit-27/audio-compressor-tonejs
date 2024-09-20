"use client"

import { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { Play, Pause, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Slider } from "@/components/ui/slider"
import { ControlType } from '@/types/controlType'
import CompressionPropertyHandler from './CompressionPropertyHandler'
import { LoadingSpinner } from './ui/loading-spinner'
import { BorderBeam } from './magicui/border-beam'

const CompressionPlayer = () => {
  const [file, setFile] = useState<File | null>(null)
  const [compresionProperty, setCompreesionProperty] = useState<ControlType>({
    threshold: -100,
    attack: 0,
    knee: 0,
    ratio: 1,
    release: 0
  })
  const playerRef = useRef<Tone.Player | null>(null)
  const compressorRef = useRef<Tone.Compressor | null>(null)
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [duration, setDuration] = useState<number>(0)
  const [scheduleRepeatID, setScheduleRepeatID] = useState<number | null>(null)

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        setIsFileUploading(true)
        const buffer = await Tone.getContext().decodeAudioData(e.target?.result as ArrayBuffer)
        setDuration(buffer.duration)
        // Create compressor
        compressorRef.current = new Tone.Compressor(compresionProperty).toDestination()
        
        // Create player and connect to compressor
        playerRef.current = new Tone.Player(buffer).connect(compressorRef.current)
        
        // Sync with Tone.Transport
        Tone.getTransport().loop = false
        Tone.getTransport().seconds = 0 // Reset transport time
        setIsActive(true)
        setIsFileUploading(false)
      }
      reader.readAsArrayBuffer(file)
      
    }
    else
    {
      setIsActive(false)
    }
  }, [file])

  useEffect(() => {
    if (isPlaying) {
        const scheduleRepeatID = Tone.getTransport().scheduleRepeat(() => {
            if (playerRef.current) {
              if (Tone.getTransport().seconds >= duration) {
                stopAndReset()
              }
              else
              {
                setProgress((Tone.getTransport().seconds / duration) * 100) 
              }
            }
          }, 0.1)
          setScheduleRepeatID(scheduleRepeatID)
    }

    return () => {
      if (scheduleRepeatID) {
        Tone.getTransport().clear(scheduleRepeatID)
      }
    }
  }, [isPlaying, duration])



  const stopAndReset = () => {
    if (playerRef.current) {
        if (scheduleRepeatID) {
            Tone.getTransport().clear(scheduleRepeatID)
            setScheduleRepeatID(null)
        }
      playerRef.current.stop()
      Tone.getTransport().stop()
      Tone.getTransport().seconds = 0
      setProgress(0)
      setIsPlaying(false)
    }
  }

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (!isPlaying) {
        const currentTime = (progress / 100) * duration
        // Start player from the current position
        playerRef.current.start("+0", currentTime) 
        // Sync Transport with player
        Tone.getTransport().start("+0", currentTime) 
        setIsPlaying(true)
      } else {
        playerRef.current.stop() // Stop the player
        Tone.getTransport().pause() // Pause the transport
        setIsPlaying(false)
      }
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (playerRef.current && duration) {
      const newTime = (value[0] * duration) / 100

      playerRef.current.seek(newTime) 
      Tone.getTransport().seconds = newTime 
      setProgress(value[0])

      if (isPlaying) {
        playerRef.current.start("+0", newTime) 
        Tone.getTransport().start("+0", newTime) 
      }
    }
  }

  const onChangeCompressionProperty = (property: string, value: number) => {
    setCompreesionProperty(prevState => ({
      ...prevState,
      [property]: value
    }));

    if (compressorRef.current) {
      switch (property) {
        case 'threshold':
          console.log(value)
          compressorRef.current.threshold.value = value
          break
        case 'attack':
          compressorRef.current.attack.value = value
          break
        case 'knee':
          compressorRef.current.knee.value = value
          break
        case 'ratio':
          compressorRef.current.ratio.value = value
          break
        case 'release':
          compressorRef.current.release.value = value
          break
        default:
          break
      }
    }
  }; 

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile && uploadedFile.type === 'audio/mpeg') {
      setFile(uploadedFile)
      setFileName(uploadedFile.name)
    } else {
      alert('Please upload an MP3 file')
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div className="p-8 w-full z-20 max-w-2xl bg-white  rounded-xl shadow-md space-y-6">
      <div className='flex items-baseline justify-center space-x-4'> 

          <Button onClick={togglePlayPause} variant={'outline'} disabled={!isActive}>
            {isPlaying ? <Pause size={20}/> : <Play size={20}/>}
          </Button>

        <div className='flex flex-col flex-grow items-center gap-2'>
          <Slider 
          className='flex-grow'
            value={[progress]} 
            max={100} 
            step={0.1} 
            onValueChange={handleSliderChange}
            disabled={!isActive}
          />
          <div>
            {formatTime((progress / 100) * duration)} / {formatTime(duration)}
          </div>
        </div>

        <div className="relative w-32">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <Button onClick={triggerFileInput} variant={'ringHover'} className="w-full relative z-0 cursor-pointer" disabled={isFileUploading}>
            {isFileUploading ? <LoadingSpinner/> : (
              fileName ? 'Change File' : 'Upload Audio'
            )}
          </Button>
        </div>

      </div>

      {fileName && (
        <p className="text-sm text-gray-600">Selected file: {fileName}</p>
      )}

      <p className='text-lg font-bold'>Compressor Control Panel</p>
      
      <div className='flex flex-col gap-5'>
        {Object.entries(compresionProperty).map((key, index) => (
          <div key={index}>
          <CompressionPropertyHandler
          propertyName={key[0]}
          value={key[1]}
          onChange = {onChangeCompressionProperty}
          disabled={!isActive}
          />
          </div>
        ))}
      </div>

    </div>
  )
}

export default CompressionPlayer
