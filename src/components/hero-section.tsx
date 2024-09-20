import { cn } from '@/lib/utils'
import GithubButton from './github-button'
const HeroSection = () => {
  return (
    <>
    <h1
        className={cn(
          "text-black dark:text-white",
          "relative mx-0 max-w-[43.5rem]  pt-5  md:mx-auto md:px-4 md:py-2",
          "text-left tracking-tighter text-balance md:text-center font-semibold",
          "md:text-6xl lg:text-5xl sm:text-5xl text-3xl",
        )}
      >
        Audio Compression Control Panel  
      </h1>
      <p className="max-w-xl mx-auto text-balance text-center text-base tracking-tight text-black dark:font-medium dark:text-white md:text-lg">
        Upload your audio file and control the compression settings. Built with <b>Tone.js</b> and <b>Next.js</b>.
      </p>
      <GithubButton/>

    </>
  )
}

export default HeroSection