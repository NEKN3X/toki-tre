import HomePresentation from "@/components/presentation/home";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const routines = await prisma.routine.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      steps: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return <HomePresentation routines={routines} />;
}
