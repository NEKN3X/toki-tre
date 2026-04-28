import { RoutineModel, RoutineStepModel } from "@/generated/prisma/models";

export type RoutineStep = RoutineStepModel;

export type Routine = RoutineModel & {
  steps: RoutineStep[];
};
