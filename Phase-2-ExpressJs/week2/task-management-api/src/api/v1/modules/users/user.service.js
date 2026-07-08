import { email } from "zod";
import { ConflictError, NotFoundError } from "../../../../errors/index.js";
import userRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import ROLES from "../../../../constants/roles.js";

async function getAllUsers() {
  return await userRepository.findAll();
}
async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("user not found");
  }
  return user;
}
async function findUserById(id) {
  const user = (await userRepository.findById(id)) || null;
  return user;
}
async function getUserByEmail(email) {
  const user = (await userRepository.findByEmail(email)) || null;
  return user;
}
async function createUser(data) {
  const { name, email, password } = data;
  const users = await userRepository.findAll();

  const emailExist = await userRepository.findByEmail(email);

  if (emailExist) {
    throw new ConflictError("email was used");
  }
  const nextId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const hashedPassword = await hashPassword(password);
  const user = {
    ...data,
    id: nextId,
    password: hashedPassword,
    isActive: data.isActive ?? true,
    role: data.role ?? ROLES.USER,
  };

  return await userRepository.create(user);
}
async function updateUser(id, data) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("user not found");
  }
  if (data.email) {
    const emailExist = await userRepository.findByEmail(data.email);
    if (emailExist && data.email !== user.email) {
      throw new ConflictError("email was used");
    }
  }

  return await userRepository.update(id, data);
}
async function deleteUser(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("user not found");
  }
  return await userRepository.remove(id);
}
async function hashPassword(password) {
  // return await bcrypt.hash(password, 10);
  return password;
}
async function comparePassword(pass1, pass2) {
  // if (!(await bcrypt.compare(pass1, pass2))) {
  //   throw new NotFoundError("invalid email or password");
  // }
  if (pass1 !== pass2) {
    throw new NotFoundError("invalid credentials");
  }
}
async function changePassword(id, { currentPassword, newPassword }) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("user not found");
  }
  await comparePassword(user.password, currentPassword);

  const hashedPassword = await hashPassword(newPassword);
  const updated = {
    password: hashedPassword,
    passwordChangedAt: new Date(),
  };
  return await userRepository.update(id, updated);
}
async function updateMetaData(id, data) {
  await userRepository.updateMetadata(id, data);
}
const userService = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  comparePassword,
  changePassword,
  updateMetaData,
  findUserById,
};
export default userService;
