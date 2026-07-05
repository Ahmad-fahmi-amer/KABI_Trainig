import * as repository from "../repositories/studentRepository.js";
import { validateStudent } from "../validators/studentValidator.js";
import crypto from "crypto";

export async function getAll() {
  return repository.findAll();
}

export async function getById(id) {
  return repository.findById(id);
}

export async function create(data) {
  const validation = validateStudent(data);

  if (validation) return { error: validation };

  data.id = crypto.randomUUID();

  await repository.create(data);

  return data;
}

export async function update(id, data) {
  const validation = validateStudent(data);

  if (validation) return { error: validation };

  return repository.update(id, data);
}

export async function remove(id) {
  return repository.remove(id);
}
