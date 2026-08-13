import { MoveRight, Wind } from "lucide-react";
import { Backdrop } from "../ui/Backdrop";
import { BackdropButton } from "../ui/BackdropButton";
import { useTranslations } from "next-intl";

type SessionCompletedBackdropProps = {
  onFinish: () => void;
  onGoToMySpace: () => void;
};

export function SessionCompletedBackdrop({
  onFinish,
  onGoToMySpace,
}: SessionCompletedBackdropProps) {
  const session = useTranslations("session.steps.step2.completed")
  return (
    <Backdrop>
      <p className="flex items-center justify-center gap-2 text-2xl font-bold text-surface">
        <span>{session("title")}</span>
        <Wind className="w-7 h-7" />
      </p>

      <p className="max-w-72 text-surface/80">
        {session("subtitle")}
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <BackdropButton
          variant="primary"
          onClick={onFinish}
        >
          {session("finish")}
        </BackdropButton>

        <BackdropButton
          variant="secondary"
          className="gap-2"
          onClick={onGoToMySpace}
        >
          {session("goMySpace")}
          <MoveRight className="w-5 h-5" />
        </BackdropButton>
      </div>
    </Backdrop>
  );
}