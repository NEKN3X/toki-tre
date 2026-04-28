import { ActionModel, RoutineModel } from "@/generated/prisma/models";

export type Action = ActionModel;

export type Routine = RoutineModel & {
  actions: Action[];
};
