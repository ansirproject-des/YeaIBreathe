import Image from "next/image";
import Imagee from "@/public/images/image.png"

export type Step = {
  id: number,
  content: React.ReactNode,
};

export const steps: Step[] = [
  {
    id: 1,
    content: (
      <div className="w-full flex flex-col gap-8 mt-8 items-center">
        <div>
          <Image
            src={Imagee}
            alt="Image"
            width={200}
            height={200}
          /></div>
          <div className="w-full flex flex-col gap-8">
        <div className="w-full flex flex-col gap-2">
          <p className="w-full text-center text-2xl font-bold">Welcome to YeIBreathe</p>
          <div className="w-full flex flex-col">
            <p className="w-full text-center text-text-descr">
              We spend thousands of hours learning to work.
            </p>
            <p className="w-full text-center text-text-descr">
              Almost none learning <span className="text-text font-bold">to rest.</span>
            </p>
          </div>
         
        </div>
        <p className="w-full text-center text-text-descr">Starting from this screen lets learn how to do that.</p>
        </div>
         
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="w-full flex flex-col gap-8 items-center">

      </div>
    )
   
  },
];