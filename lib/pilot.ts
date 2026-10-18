/**
 * Free-pilot safety switch.
 *
 * The pilot is free by default. Payments must be explicitly enabled later by
 * setting FREE_PILOT_MODE=false after the legal and billing review.
 */
export const FREE_PILOT_MODE = process.env.FREE_PILOT_MODE !== "false";
export const PILOT_TRIAL_DAYS = 90;

