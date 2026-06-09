import useScrollReveal from "../Hooks/userScrollReveal";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import HeroSection from "../Components/Home/HeroSection";
import WhyChoose from "../Components/Home/WhyChoose";
import HomeCommunity from "../Components/Home/HomeCommunity";
import ReadyToPlay from "../Components/Home/ReadyToPlay";
import BannerSection from "../Components/Home/BannerSection";
import LiveTicker from "../Components/Home/LiveTicker";
import NationwideLiveCounter from "../Components/Home/NationwideLiveCounter";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useScrollReveal("fade-in");

  return (
    <div className="w-full overflow-hidden bg-black">
      <LiveTicker />
      <NationwideLiveCounter />
      <BannerSection />
      <HeroSection />
      <WhyChoose />
      <HomeCommunity />
      <ReadyToPlay />
    </div>
  );
}
