-- 1. RLSを有効化
alter table public."Routine" enable row level security;

-- 2. 「自分のデータだけを参照できる」ポリシー
create policy "Users can view their own routines"
on public."Routine" for select
using ( auth.uid() = public."Routine"."userId" );

-- 3. 「自分のデータだけを挿入できる」ポリシー
create policy "Users can insert their own routines"
on public."Routine" for insert
with check ( auth.uid() = public."Routine"."userId" );

-- 4. 「自分のデータだけを更新・削除できる」ポリシー
create policy "Users can update/delete their own routines"
on public."Routine" for all
using ( auth.uid() = public."Routine"."userId" );