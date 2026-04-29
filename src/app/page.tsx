import HomePresentation from "@/components/presentation/home";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const routines = await prisma.routine.findMany({
    where: {
      userId: user.id,
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
