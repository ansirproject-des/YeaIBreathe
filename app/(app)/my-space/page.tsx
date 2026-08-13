import { Header } from "@/components /layout/Header";
import { BackButton } from "@/components /session/BackButton";
import { ArrowLeft, } from "lucide-react";

import { getCurrentDbUser } from "@/lib/user/user";
import { getTranslations } from "next-intl/server";
import { CreatePostModal } from "@/components /myspace/content/posts/createPost/CreatePostModal";
import { getPosts } from "@/lib/post/post";
import { MySpaceTabs } from "@/components /myspace/MySpaceTabs";
import { NotificationsModal } from "@/components /myspace/NotificationsModal";
import Image from "next/image";



export default async function MySpacePage() {
  const user = await getCurrentDbUser();
  const posts = await getPosts();
  //const mySpace = await getTranslations("mySpace");
  const common = await getTranslations("common");
  const followersCount = user._count.followers;

  return (
    <>
      <div className="w-full shrink-0">
        <Header
          left={
            <BackButton
              href="/home"
              loadingChildren={
                <>
                  <p className="text-sm">{common("loading.label")}</p>
                  <p className="text-base">{common("loading.returning")}</p>
                </>
              }
            >
              <ArrowLeft className="w-5 h-5" />
            </BackButton>
          }
          center={
    <Image
      src="/mySpaceLogo.png"
      alt="My Space Logo"
      width={72}
      height={72}
    />
  }
          right={
            <div className="flex items-center">
              <CreatePostModal />
              <NotificationsModal/>
            </div>
          }
          className="justify-center"
          innerClassName="w-full max-w-200"
        />
      </div>

      <main className="w-full flex-1 min-h-0 overflow-y-auto hide-scrollbar pb-8">
        <MySpaceTabs user={user} posts={posts} followersCount={followersCount} />
      </main>

    </>
  );
}
