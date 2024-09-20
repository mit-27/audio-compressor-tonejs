"use client"

import PulsatingButton from "./magicui/pulsating-button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

const GithubButton = () => {
  return (
    <PulsatingButton 
      onClick={() => window.open('https://github.com/mit-27/audio-compressor-tonejs', '_blank')} 
      pulseColor="gray" 
      color="black" 
      className="text-white bg-black m-5"
    >
      <div className="flex items-center justify-center gap-2">
        <GitHubLogoIcon className="w-5 h-5" />
        <span>Star on Github</span>
      </div>
    </PulsatingButton>
  )
}

export default GithubButton