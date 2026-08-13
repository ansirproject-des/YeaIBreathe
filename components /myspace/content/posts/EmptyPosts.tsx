import { useTranslations } from "next-intl";


type PostsStateProps = {
  titleKey?: string,
  messageKey?: string,
}

export function PostsState({
  titleKey = "No posts yet",
  messageKey = "Create your first post",
}: PostsStateProps) {

  

  return (
    <div className="w-full py-8 flex flex-col items-center text-center gap-0.5">
      <p className="text-text font-semibold">{titleKey}</p>
      <p className="max-w-60 text-sm text-text-muted">
        {messageKey}
      </p>
    </div>
  );
}