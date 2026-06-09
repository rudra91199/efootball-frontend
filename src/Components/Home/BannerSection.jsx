import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Autoplay, Scrollbar } from "swiper/modules";
import ClassicoLiveCounter from "./Banners/ClassicoLiveCounter";
import ChampionsBanner from "./Banners/ChampionsBanner";
import NationwideLiveCounter from "./NationwideLiveCounter";
import CombatLogBanner from "./Banners/CombatLogBanner"; // IMPORTED
import { useAuthStore } from "../../store/authStore";

const BannerSection = () => {
  const {user} = useAuthStore();
  return (
    <section className={`${user ? 'relative' : 'hidden'} h-[85dvh] sm:h-[600px] lg:h-[700px] bg-[#05050a] border-b border-white/5 overflow-hidden flex items-center justify-center`}>
      <Swiper
        scrollbar={{ hide: false }}
        modules={[Scrollbar, Autoplay]}
        autoplay={{ delay: 10000, disableOnInteraction: true }}
        className="w-full h-full relative z-20"
      >
        {/* Slide 1: Recent Match Results (The new component) */}
        <SwiperSlide className="w-full h-full flex items-center justify-center px-4 sm:px-8">
          <CombatLogBanner />
        </SwiperSlide>

        {/* <SwiperSlide className="w-full h-full flex items-center justify-center px-4 sm:px-8">
          <ChampionsBanner />
        </SwiperSlide>

        <SwiperSlide className="w-full h-full flex items-center justify-center px-4 sm:px-8">
          <ClassicoLiveCounter />
        </SwiperSlide> */}
      </Swiper>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `,
        }}
      />
    </section>
  );
};

export default BannerSection;
