-- 1. RLSを有効化
alter table public."Action" enable row level security;

-- 2. 「親ルーティンの所有者だけ」が参照できる
create policy "Users can view actions of their own routines"
on public."Action" for select
using (
  exists (
    select 1 from public."Routine"
    where public."Routine".id = public."Action"."routineId"
    and public."Routine"."userId" = auth.uid()
  )
);

-- 3. 「親ルーティンの所有者だけ」が挿入できる
create policy "Users can insert actions into their own routines"
on public."Action" for insert
with check (
  exists (
    select 1 from public."Routine"
    where public."Routine".id = "routineId"
    and public."Routine"."userId" = auth.uid()
  )
);

-- 4. 更新・削除も同様
create policy "Users can modify actions of their own routines"
on public."Action" for all
using (
  exists (
    select 1 from public."Routine"
    where public."Routine".id = public."Action"."routineId"
    and public."Routine"."userId" = auth.uid()
  )
);