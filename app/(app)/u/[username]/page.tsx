import { Header } from "@/components /layout/Header";
import { ContentTabs } from "@/components /myspace/content/ContentTabs";
import { ProfileCredits } from "@/components /myspace/credits/ProfileCredits";
import { BackButton } from "@/components /session/BackButton";
import { getUserByUsername } from "@/lib/user/user";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username } = await params;
  const common = await getTranslations("common");
  const user = await getUserByUsername(username);

  if(!user) {
    notFound();
  }


  return (
    <>
    <div className="w-full shrink-0">
        <Header
          left={
            <BackButton
              href="/my-space"
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
          right={
            <div className="flex items-center">
              {/*<IconButton variant="text"><Earth className="w-5 h-5"/></IconButton>*/}
              {/*<Button variant="primary" className="flex gap-2" size="sm"><Earth className="w-4 h-4" /> Explore</Button>*/}
            </div>
          }
          className="justify-center"
          innerClassName="w-full max-w-200"
        />
      </div>
    

          <main className="w-full flex-1 min-h-0 overflow-y-auto hide-scrollbar pb-8">
            <div className="w-full">
                        <div
                          className="w-full max-w-170 mx-auto flex flex-col mt-1 mb-8 sm:mt-8 gap-8">
                          <ProfileCredits user={user} postsCount={user.postsCount} followersCount={user.followersCount}
                          isOwner={user.isOwner} isFollowing={user.isFollowing}
                          />
                
                          <ContentTabs user={user} isFollowing={user.isFollowing} isOwner={user.isOwner} isPublicProfile={true} />
                        </div>
                      </div>
          </main>
    </>

)}