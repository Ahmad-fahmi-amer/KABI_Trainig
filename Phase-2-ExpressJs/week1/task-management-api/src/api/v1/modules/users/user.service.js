import { ConflictError, NotFoundError } from "../../../../errors/index.js";
import userRepository from "./user.repository.js";

async function findAll() {
  return await userRepository.findAll();
}
async function findById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("user not found");
  }
  return user;
}
async function findByEmail(email) {
  const user = (await userRepository.findByEmail(email)) || null;
  return user;
}
async function create(data) {
  const users = await userRepository.findAll();

  const emailExist = await userRepository.findByEmail(data.email);

  if (emailExist) {
    throw new ConflictError("email was used");
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
    throw new NotFoundError("user not found");
  }
  const emailExist = await userRepository.findByEmail(data.email);

  if (emailExist && data.email !== user.email) {
    throw new ConflictError("email was used");
  }
  return await userRepository.update(id, data);
}
async function remove(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("user not found");
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
