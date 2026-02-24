import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";

// image import
import visaCardImage from "@/assets/images/all-img/visa-card-bg.png";
import visaCardImage2 from "@/assets/images/logo/visa.svg";
const cardLists = [
  {
    bg: "from-[#1EABEC] to-primary-500 ",
    cardNo: "****  ****  **** 3945",
  },
  {
    bg: "from-[#4C33F7] to-[#801FE0] ",
    cardNo: "****  ****  **** 3945",
  },
  {
    bg: "from-[#FF9838] to-[#008773]",
    cardNo: "****  ****  **** 3945",
  },
];
const CardSlider = () => {
  return (
    <div>
      <Swiper effect={"cards"} grabCursor={true} modules={[EffectCards]}>
        {cardLists.map((item, i) => (
          <SwiperSlide key={i}>
            <div
              className={`${item.bg} relative z-1 h-50 rounded-md bg-linear-to-r p-4 text-white`}
            >
              <div className="overlay absolute top-0 left-0 -z-1 h-full w-full">
                <img
                  src={visaCardImage.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <img src={visaCardImage2.src} alt="" />
              <div className="mt-4.5 mb-4.25 text-lg font-semibold">
                {item.cardNo}
              </div>
              <div className="text-opacity-75 mb-0.5 text-xs">
                Card balance
              </div>
              <div className="text-2xl font-semibold">$10,975</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardSlider;
