export const TASK_STATUS = Object.freeze({
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
});

export const TASK_PRIORITY = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
});

export const TASK_STATUS_VALUES = Object.freeze(Object.values(TASK_STATUS));
export const TASK_PRIORITY_VALUES = Object.freeze(Object.values(TASK_PRIORITY));

export const TASK_TRANSITIONS = Object.freeze({
  [TASK_STATUS.NEW]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.CANCELLED],
  [TASK_STATUS.IN_PROGRESS]: [
    TASK_STATUS.COMPLETED,
    TASK_STATUS.CANCELLED,
  ],
  [TASK_STATUS.COMPLETED]: [],
  [TASK_STATUS.CANCELLED]: [],
});
