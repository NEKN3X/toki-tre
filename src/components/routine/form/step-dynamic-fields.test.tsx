import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import z from "zod";
import { StepDynamicFields } from "./step-dynamic-fields";

const testSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string(),
      icon: z.string(),
      type: z.enum(["TEXT", "VIDEO"]),
      description: z.string().optional(),
      videoUrl: z.string().optional(),
    }),
  ),
});

type TestFormData = z.infer<typeof testSchema>;

// ── Helpers ──

function renderStepFields(index = 0, defaultType: "TEXT" | "VIDEO" = "TEXT") {
  const defaultValues: TestFormData = {
    steps: [
      {
        title: "白湯を飲む",
        icon: "🍵",
        type: defaultType,
        description: defaultType === "TEXT" ? "ゆっくりと" : "",
        videoUrl:
          defaultType === "VIDEO" ? "https://www.youtube.com/watch?v=test" : "",
      },
    ],
  };

  function TestForm() {
    const form = useForm<TestFormData>({
      resolver: zodResolver(testSchema),
      defaultValues,
    });

    return (
      <form>
        <StepDynamicFields control={form.control} index={index} />
      </form>
    );
  }

  return render(<TestForm />);
}

// ── Tests ──

describe("StepDynamicFields", () => {
  it("TEXT タイプのとき説明フィールドが表示される", () => {
    renderStepFields(0, "TEXT");
    expect(screen.getByPlaceholderText("意識するポイントなど")).toBeVisible();
  });

  it("TEXT タイプのとき動画URLフィールドは非表示", () => {
    renderStepFields(0, "TEXT");
    const input = screen.getByPlaceholderText(
      "https://www.youtube.com/watch?v=...",
    );
    expect(input).not.toBeVisible();
  });

  it("VIDEO タイプのとき動画URLフィールドが表示される", () => {
    renderStepFields(0, "VIDEO");
    expect(
      screen.getByPlaceholderText("https://www.youtube.com/watch?v=..."),
    ).toBeVisible();
  });

  it("VIDEO タイプのとき説明フィールドは非表示", () => {
    renderStepFields(0, "VIDEO");
    const input = screen.getByPlaceholderText("意識するポイントなど");
    expect(input).not.toBeVisible();
  });
});
