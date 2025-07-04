export const PLAN_TYPES = Object.freeze([
  Object.freeze({ id: "training", label: "Training" }),
  Object.freeze({ id: "nutrition", label: "Nutrition" }),
]);

export const PLAN_TYPES_BY_ID = Object.freeze(
  PLAN_TYPES.reduce((acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  }, {})
);
