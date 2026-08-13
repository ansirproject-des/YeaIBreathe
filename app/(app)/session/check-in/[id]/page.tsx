import { Header } from "@/components /layout/Header";
import { LeaveSessionModal } from "@/components /session/LeaveSessionModal";
import { CheckInStep } from "@/components /session/CheckInStep";
import { getTranslations } from "next-intl/server";

type CheckInPageProps = {
  params: Promise<{
    id: string,
  }>,
};

export default async function CheckInPage({params}: CheckInPageProps) {
const { id } = await params;
const session = await getTranslations("session.steps.step2");

  return (
    <>
      <div className="w-full shrink-0">
        <Header
          left={
            <LeaveSessionModal
              title= {session("leave.modalTitle")}
              content={[
                session("leave.message1"),
                session("leave.message2"),
              ]}
              leaveLabel={session("leave.leaveLabel")}
              continueLabel={session("leave.continueLabel")}
              saveUnfinishedSession
            />
          }
          className="justify-center"
          innerClassName="w-full max-w-200"
        />
      </div>

      <CheckInStep sessionId={id} />

    </>
  )
}