import { CSSProperties, FunctionComponent } from 'react';
// Import Swiper React components

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { BadgePercent, Download, Store, Truck } from 'lucide-react';
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';

interface CarouselProps {
  items?: string[];
  style?: CSSProperties;
}

export const Carousel: FunctionComponent<CarouselProps> = ({
  style = {
    height: 'clamp(220px, 45vw, 490px)',
    borderRadius: 'clamp(16px, 2.5vw, 26px)',
  },
  items = ['./dishes.png', './buldak.png', './attire.png'],
}) => {
  return (
    <div className="max-w-screen  gap-4  lg:flex lg:flex-row flex-col mt-6 sm:mt-10 ">
      <Swiper
        pagination={true}
        modules={[Autoplay, Pagination]}
        className="custom-swiper"
        style={style}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {items.map((item, index) => {
          return (
            <SwiperSlide key={`${item}-${index}`}>
              <Image
                src={item}
                alt="carousel-image"
                width={1280}
                height={1000}
                className="h-full w-full object-cover"
                objectPosition="start"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="relative lg:mt-[unset] mt-6 w-full h-fit lg:max-w-[270px] rounded-[26px] border border-[#E7EEF4] bg-gradient-to-br from-[#F7FCFF] via-white to-[#F1F5FF] p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#14A3B8] text-white shadow-sm">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-700">AmyStore</p>
            </div>
          </div>
          <p className="text-[10px] font-semibold tracking-[0.18em] text-[#2F6F7B]">
            TRY OUR APP
          </p>
        </div>

        <div className="mt-4 rounded-[22px] border border-white/40 bg-gradient-to-br from-[#53C9D7] via-[#36B3C9] to-[#2B98B8] p-4 text-white shadow-[0_18px_45px_-28px_rgba(44,150,181,0.8)]">
          <p className="mt-3 text-sm font-semibold leading-snug">
            Get the AmyStore app to enjoy
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#29A3B9] shadow-inner">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">FREE</p>
                <p className="text-sm font-semibold">SHIPPING</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#E45B6B] shadow-inner">
                <BadgePercent className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">EXCLUSIVE</p>
                <p className="text-sm font-semibold">VOUCHERS</p>
              </div>
            </div>
          </div>
        </div>

        <a
          type="button"
          href="https://drive.google.com/uc?export=download&id=1gOwNvtGYbLUzkKNylbYZ5yU1U7I7-c5s
"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#BFE9F1] bg-white px-4 py-3 text-sm font-semibold text-[#2D8CA1] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <Download className="h-4 w-4" />
          Download APK
        </a>
        <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Soon on Google Play &amp; App Store
        </p>
      </div>
    </div>
  );
};
