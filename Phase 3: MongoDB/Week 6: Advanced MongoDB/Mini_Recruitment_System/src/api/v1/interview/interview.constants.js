export const INTERVIEW_STATUSES = Object.freeze({
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
});

export const INTERVIEW_STATUS_VALUES = Object.freeze(
  Object.values(INTERVIEW_STATUSES),
);

export const FINAL_INTERVIEW_STATUSES = Object.freeze([
  INTERVIEW_STATUSES.COMPLETED,
  INTERVIEW_STATUSES.CANCELLED,
  INTERVIEW_STATUSES.NO_SHOW,
]);

export const INTERVIEW_MODES = Object.freeze({
  ON_SITE: "ON_SITE",
  ONLINE: "ONLINE",
});

export const INTERVIEW_MODE_VALUES = Object.freeze(
  Object.values(INTERVIEW_MODES),
);

export const INTERVIEW_OUTCOMES = Object.freeze({
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  NEUTRAL: "NEUTRAL",
});

export const INTERVIEW_OUTCOME_VALUES = Object.freeze(
  Object.values(INTERVIEW_OUTCOMES),
);
