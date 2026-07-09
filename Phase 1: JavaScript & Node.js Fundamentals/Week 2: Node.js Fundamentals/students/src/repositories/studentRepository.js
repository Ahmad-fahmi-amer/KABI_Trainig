import fs from "fs/promises";
import path from "path";

const file = path.join("data", "students.json");

async function read() {
  const data = await fs.readFile(file, "utf8");

  return JSON.parse(data);
}

async function write(data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

export async function findAll() {
  return read();
}

export async function findById(id) {
  const students = await read();

  return students.find((s) => s.id === id);
}

export async function create(student) {
  const students = await read();

  students.push(student);

  await write(students);
}

export async function update(id, data) {
  const students = await read();

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) return null;

  students[index] = { id, ...data };

  await write(students);

  return students[index];
}

export async function remove(id) {
  const students = await read();

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) return false;

  students.splice(index, 1);

  await write(students);

  return true;
}
