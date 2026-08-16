import mongoose from "mongoose";

export async function runInTransaction(operation) {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      result = await operation(session);
    });

    return result;
  } finally {
    await session.endSession();
  }
}
