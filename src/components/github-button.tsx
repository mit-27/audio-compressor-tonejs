"use client"

import PulsatingButton from "./magicui/pulsating-button"

const GithubButton = () => {
  return (
    <PulsatingButton onClick={() => window.open('https://github.com/mit-27/audio-compressor-tonejs', '_blank')} pulseColor="gray" color="black" className="text-white bg-black m-5">Visit Github</PulsatingButton>

  )
}

export default GithubButton