-- 1. auth.users に行が挿入された時に実行される関数を作成
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public."User" (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- 2. トリガーを設定
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();