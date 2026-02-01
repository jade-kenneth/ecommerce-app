import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="flex flex-col p-20 mt-24 text-white bg-cyan-700">
      <div className="flex mb-10 max-w-screen justify-between w-full">
        <div className="flex flex-col">
          <Image src={'/LogoWhite.png'} alt="logo" width={150} height={150} />

          <p className="mt-8 font-bold mb-5 text-xl">Contact Us</p>
          <div className="flex items-start font-semibold mb-5 gap-3">
            <Image src={'/fb.svg'} alt="logo" width={20} height={20} />
            <div className="flex flex-col">
              <p className="text-base">Facebook App</p>
              <p className="text-base">Kenneth Mejia Jumawan</p>
            </div>
          </div>
          <div className="flex items-start font-semibold gap-3">
            <Image src={'/phone.svg'} alt="logo" width={20} height={20} />
            <div className="flex flex-col">
              <p className="text-base">Call Us</p>
              <p className="text-base">+639 52 480 3589</p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xl">Most Popular Categories</p>

          <div className="flex py-5 border-t-[3px] border-cyan-400 gap-5">
            <ul className="list-inside list-disc">
              <li>Snacks</li>
              <li>Beverages</li>
              <li>Canned Goods</li>
              <li>Instant Food</li>
              <li>Rice</li>
              <li>Cooking Essentials</li>
            </ul>
            <ul className="list-inside list-disc">
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
          <p className="mb-4 text-xl">Customer Service</p>

          <div className="flex py-5 border-t-[3px] border-cyan-400 gap-5">
            <ul className="list-inside list-disc">
              <li>About Us</li>
              <li>Terms & Conditions</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-xl">Payment Method</p>
          <Image src={'/gcash.png'} width={180} height={180} alt="payment-1" />
          <Image src={'/cash.png'} width={180} height={180} alt="payment-2" />
        </div>
      </div>

      <div className="flex items-center max-w-screen border-t border-white/20 justify-center">
        <p className="mt-8">
          © {new Date().getFullYear()} AmyStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
