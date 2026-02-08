import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="mt-16 sm:mt-24 text-white bg-cyan-700">
      <div className="max-w-screen px-6 sm:px-10 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
          <div className="flex flex-col">
            <Image src={'/LogoWhite.png'} alt="logo" width={150} height={150} />
            <p className="mt-4 text-sm text-cyan-100/90 max-w-sm">
              AmyStore brings your daily essentials to your doorstep with fast,
              reliable delivery and curated local favorites.
            </p>

            <div className="mt-6 rounded-2xl border border-white/20 bg-cyan-600/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">
                Contact Us
              </p>
              <div className="mt-3 flex items-start gap-3 text-sm sm:text-base">
                <Image src={'/fb.svg'} alt="logo" width={20} height={20} />
                <div className="flex flex-col">
                  <p className="font-semibold">Facebook App</p>
                  <p className="text-cyan-100/80">Kenneth Mejia Jumawan</p>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-3 text-sm sm:text-base">
                <Image src={'/phone.svg'} alt="logo" width={20} height={20} />
                <div className="flex flex-col">
                  <p className="font-semibold">Call Us</p>
                  <p className="text-cyan-100/80">+639 52 480 3589</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-100/80">
              Most Popular Categories
            </p>

            <div className="flex flex-wrap gap-3 py-4 border-t border-cyan-300/40 text-sm sm:text-base">
              {[
                'Snacks',
                'Beverages',
                'Canned Goods',
                'Instant Food',
                'Rice',
                'Cooking Essentials',
                'Fresh Produce',
                'Personal Care',
                'Household Items',
                'Sweets & Candies',
                'Health & Wellness',
                'Daily Dishes',
              ].map((item) => (
                <span
                  key={item}
                  className="whitespace-nowrap rounded-full border border-white/20 bg-cyan-600/40 px-3 py-1 text-xs sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-100/80">
              Customer Service
            </p>

            <div className="flex py-4 border-t border-cyan-300/40">
              <ul className="list-inside list-disc space-y-1 text-sm sm:text-base">
                <li>About Us</li>
                <li>Terms & Conditions</li>
                <li>FAQ</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">
              Payment Method
            </p>
            <div className="rounded-2xl border border-white/20 bg-cyan-600/40 p-4 flex flex-col gap-4">
              <Image
                src={'/gcash.png'}
                width={180}
                height={180}
                alt="payment-1"
                className="w-32 sm:w-40 h-auto"
              />
              <Image
                src={'/cash.png'}
                width={180}
                height={180}
                alt="payment-2"
                className="w-32 sm:w-40 h-auto"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center border-t border-white/20 justify-center mt-10">
          <p className="pt-6 text-xs sm:text-sm text-center text-cyan-100/80">
            © {new Date().getFullYear()} AmyStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
