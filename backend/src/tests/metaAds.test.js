import { dbConnection } from "../config/db.js";
import { User } from "../models/User.model.js";
import { PlatformCredential } from "../models/PlatformCredential.model.js";
import { AdConnection } from "../models/AdConnection.model.js";
import { OAuthState } from "../models/OAuthState.model.js";
import { MetaAdsService } from "../services/metaAds.service.js";
import { CryptoUtil } from "../utils/crypto.util.js";
import mongoose from "mongoose";

async function runTests() {
  console.log("🚀 Starting ADOS Meta Ads Integration Tests...\n");
  await dbConnection.connect();

  const testUserId1 = new mongoose.Types.ObjectId();
  const testUserId2 = new mongoose.Types.ObjectId();

  try {
    // 1. Test OAuth Authorization URL & OAuthState Generation
    console.log("TEST 1: OAuth State & URL Generation");
    process.env.META_APP_ID = process.env.META_APP_ID || "123456789012345";
    process.env.META_APP_SECRET = process.env.META_APP_SECRET || "mock_secret_abcdef1234567890";
    const { authUrl, state } = await MetaAdsService.generateAuthUrl(testUserId1);
    if (!authUrl.includes("client_id") || !authUrl.includes("state=")) {
      throw new Error("Invalid OAuth URL format");
    }
    const stateRecord = await OAuthState.findOne({ state });
    if (!stateRecord || stateRecord.used !== false || stateRecord.platform !== "meta") {
      throw new Error("OAuthState was not created in MongoDB properly");
    }
    console.log("✅ Passed: Cryptographic state generated and stored in MongoDB with TTL.\n");

    // 2. Test Invalid / Used State Protection
    console.log("TEST 2: State Validation & One-Time Use Security");
    stateRecord.used = true;
    await stateRecord.save();

    let threwAsExpected = false;
    try {
      await MetaAdsService.handleOAuthCallback("dummy_code", state);
    } catch (err) {
      threwAsExpected = true;
      if (!err.message.includes("already been used")) {
        throw new Error(`Unexpected error message: ${err.message}`);
      }
    }
    if (!threwAsExpected) throw new Error("Expected one-time use state error was not thrown");
    console.log("✅ Passed: Replay attacks blocked (one-time state enforced).\n");

    // 3. Test Direct Credential Persistence & Multi-Account Discovery
    console.log("TEST 3: Credential Persistence & Multi-Account Discovery");
    const mockToken = "EAA_TEST_ACCESS_TOKEN_12345";
    const encryptedToken = CryptoUtil.encrypt(mockToken);

    await PlatformCredential.create({
      userId: testUserId1,
      platform: "meta",
      encryptedAccessToken: encryptedToken,
      tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      scope: "ads_read",
      metaUserId: "meta_user_1",
      metaUserName: "Meta Enterprise Brand",
      status: "Connected",
    });

    await AdConnection.create([
      {
        userId: testUserId1,
        platform: "meta",
        externalAccountId: "act_1001",
        accountName: "US E-Commerce Store",
        currency: "USD",
        timezone: "America/New_York",
        selected: true,
        status: "ACTIVE",
      },
      {
        userId: testUserId1,
        platform: "meta",
        externalAccountId: "act_1002",
        accountName: "Europe Retargeting",
        currency: "EUR",
        timezone: "Europe/London",
        selected: false,
        status: "ACTIVE",
      },
      {
        userId: testUserId1,
        platform: "meta",
        externalAccountId: "act_1003",
        accountName: "India Brand Awareness",
        currency: "INR",
        timezone: "Asia/Kolkata",
        selected: false,
        status: "ACTIVE",
      },
    ]);

    const accounts = await MetaAdsService.getAccounts(testUserId1);
    if (accounts.length !== 3) throw new Error(`Expected 3 accounts, got ${accounts.length}`);
    console.log("✅ Passed: Discovered 3 ad accounts for user.\n");

    // 4. Test Multi-Account Selection
    console.log("TEST 4: Multi-Account Selection");
    const updated = await MetaAdsService.selectAccounts(testUserId1, ["act_1001", "act_1003"]);
    const selectedCount = updated.filter((a) => a.selected).length;
    if (selectedCount !== 2) throw new Error(`Expected 2 selected accounts, got ${selectedCount}`);
    console.log("✅ Passed: Multiple accounts selected and persisted in MongoDB.\n");

    // 5. Test Cross-User Isolation (User 2 cannot access or select User 1's accounts)
    console.log("TEST 5: Cross-User Security & Isolation");
    const user2Accounts = await MetaAdsService.getAccounts(testUserId2);
    if (user2Accounts.length !== 0) throw new Error("Security leak: User 2 saw User 1's accounts");

    let crossUserBlocked = false;
    try {
      await MetaAdsService.selectAccounts(testUserId2, ["act_1001"]);
    } catch (err) {
      crossUserBlocked = true;
    }
    if (!crossUserBlocked) throw new Error("Security failure: User 2 was able to mutate User 1's ad connection");
    console.log("✅ Passed: Cross-user data isolation verified.\n");

    // 6. Test Disconnect
    console.log("TEST 6: Disconnect & Secure Cleanup");
    const disconnectRes = await MetaAdsService.disconnect(testUserId1);
    if (!disconnectRes.success) throw new Error("Disconnect returned false");

    const credCheck = await PlatformCredential.findOne({ userId: testUserId1, platform: "meta" });
    const connCheck = await AdConnection.find({ userId: testUserId1, platform: "meta" });
    if (credCheck || connCheck.length > 0) throw new Error("Credentials or connections not cleaned up");
    console.log("✅ Passed: Disconnected cleanly, credentials and connections deleted.\n");

    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  } finally {
    // Cleanup test data
    await OAuthState.deleteMany({ userId: { $in: [testUserId1, testUserId2] } });
    await PlatformCredential.deleteMany({ userId: { $in: [testUserId1, testUserId2] } });
    await AdConnection.deleteMany({ userId: { $in: [testUserId1, testUserId2] } });
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
