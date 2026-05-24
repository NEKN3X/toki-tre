import HomePresentation from "@/components/presentation/home";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<RoutineGridSkeleton />}>
      <RoutineGrid userId={user.id} />
    </Suspense>
  );
}

async function RoutineGrid({ userId }: { userId: string }) {
  const routines = await prisma.routine.findMany({
    where: {
      userId,
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

function RoutineGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-5 flex-1" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-2 h-9 rounded-md" />
        </div>
      ))}
    </div>
  );
}
