import { prisma } from "@/lib/db";
import Form from "next/form";

export default function Home() {
  // Server Action
  async function createUser(formData: FormData) {
    "use server";

    const email = formData.get("email");

    try {
      // ユーザー作成処理
      await prisma.user.create({
        data: {
          email: email as string,
        },
      });

      console.log("ユーザー作成に成功しました");
    } catch (error) {
      console.error("ユーザー作成に失敗しました, " + error);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
      <Form action={createUser} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          ユーザーを作成
        </button>
      </Form>
    </div>
  );
}
