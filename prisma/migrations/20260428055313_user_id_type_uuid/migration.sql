-- 外部キー制約を一旦削除
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_userId_fkey";

-- UserテーブルのidをUUIDに変換
ALTER TABLE "User"
    ALTER COLUMN "id" TYPE UUID USING "id"::uuid;

-- RoutineテーブルのuserIdをUUIDに変換
ALTER TABLE "Routine"
    ALTER COLUMN "userId" TYPE UUID USING "userId"::uuid;

-- 外部キー制約を再構築
ALTER TABLE "Routine"
    ADD CONSTRAINT "Routine_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
