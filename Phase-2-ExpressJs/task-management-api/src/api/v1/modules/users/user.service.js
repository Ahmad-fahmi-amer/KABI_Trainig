import userRepository from "./user.repository.js";

async function findAll() {
  return await userRepository.findAll();
}
async function findById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("user not found");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }
  return user;
}
async function findByEmail(email) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("user not found");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }
  return user;
}
async function create(data) {
  const users = await userRepository.findAll();

  const emailExist = await userRepository.findByEmail(data.email);

  if (emailExist) {
    const error = new Error("email was used");
    error.statusCode = 400;
    error.expose = true;
    throw error;
  }
  const nextId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const user = {
    id: nextId,
    ...data,
  };

  return await userRepository.create(user);
}
async function update(id, data) {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("user not found");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }
  const emailExist = await userRepository.findByEmail(data.email);

  if (emailExist) {
    const error = new Error("email was used");
    error.statusCode = 400;
    error.expose = true;
    throw error;
  }
  return await userRepository.update(id, data);
}
async function remove(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("user not found");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }
  return await userRepository.remove(id);
}
const userService = {
  remove,
  update,
  findAll,
  findByEmail,
  findById,
  create,
};
export default userService;
