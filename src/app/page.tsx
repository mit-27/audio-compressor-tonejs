import CompressionPlayer from "@/components/CompressionPlayer";
import GithubButton from "@/components/github-button";
import HeroSection from "@/components/hero-section";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <DotPattern className="absolute inset-0 w-full h-full opacity-30" />
      <HeroSection/>      
      <CompressionPlayer/>
    </div>
  );
}

export default Home;
