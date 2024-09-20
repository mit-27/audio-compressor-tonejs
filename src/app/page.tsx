import CompressionPlayer from "@/components/CompressionPlayer";
import GithubButton from "@/components/github-button";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <DotPattern className="absolute inset-0 w-full h-full opacity-30" />
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
        <p className="max-w-xl text-balance text-left text-base tracking-tight text-black dark:font-medium dark:text-white md:text-center md:text-lg ">
                Upload your audio file and control the compression settings. Built with <b>Tone.js</b> and <b>Next.js</b>.
        </p>

        <GithubButton/>
        
      
      <CompressionPlayer/>
    </div>
  );
}

export default Home;
