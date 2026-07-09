import { users } from "../../../../../data/users.data.js";
function findAll() {
  return users;
}
function findById(id) {
  const user = users.find((user) => user.id === id) || null;
  return user;
}

function findByEmail(email) {
  const user = users.find((user) => user.email === email) || null;
  return user;
}

function create(user) {
  users.push(user);
  return user;
}

function update(id, updates) {
  const user = users.find((user) => user.id === id);

  if (!user) {
    return null;
  }

  Object.assign(user, updates);

  return user;
}
function remove(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  return users.splice(index, 1)[0];
}
const userRepository = {
  findAll,
  findById,
  findByEmail,
  update,
  create,
  remove,
};
export default userRepository;
