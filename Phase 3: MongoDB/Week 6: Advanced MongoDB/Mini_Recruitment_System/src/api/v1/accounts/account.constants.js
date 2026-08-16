export const ACCOUNT_ROLES = Object.freeze({
  CANDIDATE: "CANDIDATE",
  RECRUITER: "RECRUITER",
  RECRUITMENT_ADMIN: "RECRUITMENT_ADMIN",
});

export const ACCOUNT_ROLE_VALUES = Object.freeze(Object.values(ACCOUNT_ROLES));

export const ACCOUNT_STATUSES = Object.freeze({
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
});

export const ACCOUNT_STATUS_VALUES = Object.freeze(
  Object.values(ACCOUNT_STATUSES),
);
