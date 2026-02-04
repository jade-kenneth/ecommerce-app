import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="mt-16 sm:mt-24 text-white bg-cyan-700">
      <div className="max-w-screen py-12 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
          <div className="flex flex-col">
            <Image src={'/LogoWhite.png'} alt="logo" width={150} height={150} />

            <p className="mt-6 sm:mt-8 font-bold mb-4 text-lg sm:text-xl">
              Contact Us
            </p>
            <div className="flex items-start font-semibold mb-4 gap-3 text-sm sm:text-base">
              <Image src={'/fb.svg'} alt="logo" width={20} height={20} />
              <div className="flex flex-col">
                <p>Facebook App</p>
                <p>Kenneth Mejia Jumawan</p>
              </div>
            </div>
            <div className="flex items-start font-semibold gap-3 text-sm sm:text-base">
              <Image src={'/phone.svg'} alt="logo" width={20} height={20} />
              <div className="flex flex-col">
                <p>Call Us</p>
                <p>+639 52 480 3589</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-lg sm:text-xl">Most Popular Categories</p>

            <div className="grid grid-cols-2 gap-6 py-4 border-t-[3px] border-cyan-400 text-sm sm:text-base">
              <ul className="list-inside list-disc space-y-1">
                <li>Snacks</li>
                <li>Beverages</li>
                <li>Canned Goods</li>
                <li>Instant Food</li>
                <li>Rice</li>
                <li>Cooking Essentials</li>
              </ul>
              <ul className="list-inside list-disc space-y-1">
                <li>Fresh Produce</li>
                <li>Personal Care</li>
                <li>Household Items</li>
                <li>Sweets & Candies</li>
                <li>Health & Wellness</li>
                <li>Daily Dishes</li>
              </ul>
            </div>
          </div>
          <div>
            <p className="mb-3 text-lg sm:text-xl">Customer Service</p>

            <div className="flex py-4 border-t-[3px] border-cyan-400">
              <ul className="list-inside list-disc space-y-1 text-sm sm:text-base">
                <li>About Us</li>
                <li>Terms & Conditions</li>
                <li>FAQ</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-lg sm:text-xl">Payment Method</p>
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

        <div className="flex items-center border-t border-white/20 justify-center mt-10">
          <p className="pt-6 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} AmyStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
