import { Settings } from "../models/Settings.model.js";

/**
 * Initializes essential user workspace settings if not present.
 * NOTE: Does NOT insert fabricated ads, mock campaigns, or fake ad accounts.
 */
export const seedInitialUserData = async (user) => {
  try {
    const existingSettings = await Settings.findOne({ userId: user._id });
    if (!existingSettings) {
      await Settings.create({
        userId: user._id,
        attributionModel: "data_driven",
        refreshRate: "14ms",
        webhookUrl: "https://api.brand.com/v1/ados-webhooks",
        minRoasAlert: 2.8,
        autoPauseFatigue: true,
        emailAlerts: true,
        slackAlerts: true,
      });
    }
  } catch (error) {
    console.error("Warning: Error initializing starter user settings:", error.message);
  }
};
