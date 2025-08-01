// Utility to calculate age from a date of birth string or Date object
export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return "N/A";
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return "N/A";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}
