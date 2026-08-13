import HomeClient from "@/components /home/HomeClient";
import { getCurrentDbUser } from "@/lib/user/user";


export default async function HomePage() {
  const user = await getCurrentDbUser();
  return (
    <HomeClient user={user}/>
  )
}