export function validateStudent(student) {
  if (!student.name) return "Name is required";

  if (typeof student.name !== "string") return "Name must be string";

  if (student.name.length < 3) return "Name must be at least 3 characters";

  if (student.age === undefined) return "Age is required";

  if (typeof student.age !== "number") return "Age must be number";

  if (student.age < 18) return "Age must be at least 18";

  if (!student.major) return "Major is required";

  if (typeof student.major !== "string") return "Major must be string";

  return null;
}
