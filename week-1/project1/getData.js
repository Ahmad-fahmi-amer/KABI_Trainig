export async function getCreateData(rl) {
  console.log("enter your name");
  const name = await rl.question("name :");

  console.log("enter your age");
  const age = await rl.question("age :");

  console.log("enter your major");
  const major = await rl.question("major :");

  const user = { name, age: parseInt(age, 10), major };
  return user;
}
export async function getId(rl) {
  console.log("enter user id");

  const id = rl.question("id:");
  return parseInt(id);
}
export async function getUpdateData(rl) {
  const id = await getId(rl);
  console.log(
    "enter a new value to update or press enter (without data) to skip",
  );
  const user = await getCreateData(rl);
  return { id, ...user };
}
