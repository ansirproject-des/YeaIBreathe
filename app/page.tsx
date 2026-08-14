import { AnimatedStoryText } from "@/components /home/AnimatedStoryText"
import { Header } from "@/components /layout/Header"
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EmailSignInForm } from "@/components /auth/EmailSignInForm";
import { getTranslations } from "next-intl/server";


export default async function WelcomePage() {
  const user = await currentUser();
  const hero = await getTranslations("hero");

  if (user) {
    redirect("/home");
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center overflow-hidden">

      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bg4.svg"
          alt=""
          fill
          priority
          className="object-cover object-left sm:object-center"
        />
      </div>
      <div className="w-full shrink-0">
        <Header
          left={

              <Image
                src={"/logo.svg"}
                alt="App Logo"
                width={160}
                height={160}
                className="mx-4 mt-2"
              />
          }
          className="justify-center"
          innerClassName="w-full"
        />
      </div>

      <main className="w-full flex-1 flex items-start lg:items-center justify-center overflow-y-auto px-5 hide-scrollbar">
        <div className="h-fit w-full lg:w-fit mx-auto flex flex-col lg:flex-row bg-surface rounded-4xl lg:rounded-[36px] items-center justify-center p-3 pb-6 mt-4 lg:p-5 lg:pr-12 gap-12">
          <div
            className="
            w-full
            lg:w-140
            rounded-3xl
            lg:rounded-[30px]
            bg-[linear-gradient(90deg,#8A98B7_0%,transparent_25%,transparent_75%,#CFCFCF_100%),linear-gradient(180deg,#C8C7C7_0%,#F2F1EF_15%,#F2F1EF_75%,#FFC8A3_100%)]
            bg-size-[200%_200%,200%_200%]
            animate-gradient
            p-1
            lg:px-1
            lg:py-1
            shrink-0
          "
          >
            <div
              className="
              min-h-80
              lg:min-h-110
              rounded-[20px]
              lg:rounded-3xl
              bg-surface
              p-6
              lg:p-9
            "
            >
              <AnimatedStoryText />
            </div>
          </div>

          <EmailSignInForm />
        </div>
      </main>

      <footer className="w-full shrink-0 px-5 overflow-hidden">
        <div className="w-full mx-auto mb-8 my-4 flex flex-col items-start">
          <p className="text-sm text-primary">
            {hero("message")}
          </p>
        </div>
      </footer>
    </div>
  );
}