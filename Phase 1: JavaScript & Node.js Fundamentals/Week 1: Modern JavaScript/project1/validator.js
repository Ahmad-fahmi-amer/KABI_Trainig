export function validateStudent({ name, age, major }) {
  if (typeof age !== "number") {
    throw new Error("Age must be a number.");
  }
  if (age < 1) {
    throw new Error("student must be greater than or equal 1");
  }

  if (!name) {
    throw new Error("name is requred");
  }
  if (typeof name !== "string") {
    throw new Error("Name must be a string.");
  }
  if (!major) {
    throw new Error("Major is required.");
  }
}
export function validateUpdateData(newData, oldData) {
  if (!newData.name) {
    newData.name = oldData.name;
  }
  if (newData.age) {
    if (newData.age < 1) {
      throw new Error("student must be greater than or equal 1");
    }
  } else newData.age = oldData.age;
  if (!newData.major) {
    newData.major = oldData.major;
  }
  return newData;
}
