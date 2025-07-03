const API_URL = "/api/users/trainer/plans";

export const fetchPlans = async (type = "training") => {
  const res = await fetch(`${API_URL}?type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
};

export const createPlan = async (plan, type = "training") => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create plan");
  }
  return res.json();
};

export const fetchPlanDetails = async (planId, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}?type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch plan details");
  return res.json();
};
