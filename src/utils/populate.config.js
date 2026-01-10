// src/utils/populate.config.js

export const ADDON_POPULATE = {
  path: "addOnGroups",
  match: { isAvailable: true },
  populate: {
    path: "addOns",
    match: { isActive: true },
    select: "name price",
  },
};
