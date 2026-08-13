import { sessionTechs } from "@/data/sessionTechs";
import { BreathingSessionLayout } from "@/components /session/BreathingSessionLayout";

type BreathingPageProps = {
  searchParams: Promise<{
    mood?: string,
    tech?: string,
  }>
}

export default async function Breathing({searchParams}: BreathingPageProps) {
  const { mood, tech } = await searchParams;

  const config = 
  tech === "breathing_478"
    ? sessionTechs.breathing_478
    : sessionTechs.box_4444;

  
  return (
      <BreathingSessionLayout mood={mood} tech={tech} config={config} />
  );
}