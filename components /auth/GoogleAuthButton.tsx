import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";


export function GoogleAuthButton() {
  const router = useRouter();
  const hero = useTranslations("hero");


  return (
      <button
        type="button"
        onClick={() => router.push("/sign-in")}
        className="w-full flex gap-2 justify-center rounded-2xl bg-transparent border-2 border-dashed border-divider-gray py-5 text-text cursor-pointer hover:border-primary transition-all"
      >
        <Image
          src="/google-icon-logo.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="size-5"
        >

        </Image>
        {hero("googleAuth")}
      </button>
  )
}
