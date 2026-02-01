import { CSSProperties, FunctionComponent } from 'react';
// Import Swiper React components
import { Box } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';

interface CarouselProps {
  items?: string[];
  style?: CSSProperties;
}

export const Carousel: FunctionComponent<CarouselProps> = ({
  style = {
    height: '426px',
    borderRadius: '26px',
  },
  items = [
    'https://media.istockphoto.com/id/2178465490/photo/buldak-is-korean-fire-chicken-with-cheese.jpg?s=2048x2048&w=is&k=20&c=eOwCJRoRGQziKTPsdLDCe5eKNlkxkBDM2hoiOatOOrM=',
    'https://media.istockphoto.com/id/2162397087/photo/buldak-is-a-popular-korean-spicy-chicken-dish-served-as-a-street-food-or-light-meal-closeup.jpg?s=2048x2048&w=is&k=20&c=4GWARJMonxbU-fE0qYasXNyjmxxwh2UDzh5ppAZ-nOY=',
    'https://media.istockphoto.com/id/2162397087/photo/buldak-is-a-popular-korean-spicy-chicken-dish-served-as-a-street-food-or-light-meal-closeup.jpg?s=2048x2048&w=is&k=20&c=4GWARJMonxbU-fE0qYasXNyjmxxwh2UDzh5ppAZ-nOY=',
    'https://media.istockphoto.com/id/2162397087/photo/buldak-is-a-popular-korean-spicy-chicken-dish-served-as-a-street-food-or-light-meal-closeup.jpg?s=2048x2048&w=is&k=20&c=4GWARJMonxbU-fE0qYasXNyjmxxwh2UDzh5ppAZ-nOY=',
    'https://media.istockphoto.com/id/2178465490/photo/buldak-is-korean-fire-chicken-with-cheese.jpg?s=2048x2048&w=is&k=20&c=eOwCJRoRGQziKTPsdLDCe5eKNlkxkBDM2hoiOatOOrM=',
  ],
}) => {
  return (
    <Box className="max-w-screen" mt="40px">
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
        {items.map((item) => {
          return (
            <SwiperSlide>
              <Image
                src={item}
                alt="carousel-image"
                width={1280}
                height={1000}
                objectPosition="center"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};
