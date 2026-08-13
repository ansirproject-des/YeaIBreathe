import InstagramIcon from "@/public/icons/Instagram.svg";
import TelegramIcon from "@/public/icons/Telegram.svg";
import WhatsAppIcon from "@/public/icons/WhatsApp.svg";
import FacebookIcon from "@/public/icons/Facebook.svg";
import MessengerIcon from "@/public/icons/Messenger.svg";
import TwitterIcon from "@/public/icons/Twitter(X).svg";
import { StaticImageData } from "next/image";

export type ShareData = {
  url: string;
  title?: string;
};

export type SocialIcon = {
  id: string;
  icon: StaticImageData;
  action?: "native";
  shareUrl?: (data: ShareData) => string;
};

export const socialIcons: SocialIcon[] = [
  {
    id: "instagram",
    icon: InstagramIcon,
    action: "native",
  },

  {
    id: "telegram",
    icon: TelegramIcon,
    shareUrl: ({ url, title }) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        title ?? "Check this out!"
      )}`,
  },

  {
    id: "whatsapp",
    icon: WhatsAppIcon,
    shareUrl: ({ url, title }) =>
      `https://wa.me/?text=${encodeURIComponent(
        `${title ?? "Check this out!"}\n${url}`
      )}`,
  },

  {
    id: "facebook",
    icon: FacebookIcon,
    shareUrl: ({ url }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },

  {
    id: "messenger",
    icon: MessengerIcon,
    action: "native",
  },

  {
    id: "twitter",
    icon: TwitterIcon,
    shareUrl: ({ url, title }) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title ?? "Check this out!")}`,
  },
] as const;