export const JOB_STATUSES = Object.freeze({
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
});
export const JOB_STATUSES_VALUES = Object.freeze(Object.values(JOB_STATUSES));
export const EMPLOYMENT_TYPES = Object.freeze({
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACT",
  INTERNSHIP: "INTERNSHIP",
});

export const EMPLOYMENT_TYPE_VALUES = Object.freeze(
  Object.values(EMPLOYMENT_TYPES),
);

export const WORKPLACE_TYPES = Object.freeze({
  ON_SITE: "ON_SITE",
  HYBRID: "HYBRID",
  REMOTE: "REMOTE",
});

export const WORKPLACE_TYPE_VALUES = Object.freeze(
  Object.values(WORKPLACE_TYPES),
);

export const EXPERIENCE_LEVELS = Object.freeze({
  ENTRY: "ENTRY",
  MID: "MID",
  SENIOR: "SENIOR",
  LEAD: "LEAD",
});

export const EXPERIENCE_LEVEL_VALUES = Object.freeze(
  Object.values(EXPERIENCE_LEVELS),
);
