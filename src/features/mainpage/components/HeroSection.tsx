import HeroImage from '@/src/assets/main-hero.svg';

export default function HeroSection() {
  return (
    <section className="relative mx-auto">
      <div className="w-full h-[500px] rounded-3xl shadow-[0px_4px_24px_0px_rgba(156,180,202,0.20)] overflow-hidden">
        <HeroImage
          aria-label="메인 히어로 이미지"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full scale-105"
        />
        <div className="absolute -inset-[1px] bg-gradient-to-b from-black/0 to-black/50 rounded-3xl" />
      </div>
      <div className="absolute top-2/3 left-0 right-0 flex justify-center">
        <div className="flex flex-col items-center">
          <span className="text-h1 text-white font-bold">
            함께 배우면 즐거운 스트릿 댄스
          </span>
          <p className="text-h4 text-white font-bold">
            1월의 인기 체험 BEST 🔥
          </p>
        </div>
      </div>
    </section>
  )
}
