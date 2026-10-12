import { Ad } from "../models/Ad.model.js";
import { ConnectedAccount } from "../models/ConnectedAccount.model.js";
import { TeamMember } from "../models/TeamMember.model.js";
import { Settings } from "../models/Settings.model.js";

export const seedInitialUserData = async (user) => {
  try {
    const existingAdsCount = await Ad.countDocuments({ userId: user._id });
    if (existingAdsCount === 0) {
      await Ad.insertMany([
        {
          userId: user._id,
          name: "Summer_Scale_UGC_Reel_V1",
          campaign: "Meta_Advantage_Scale_US_Broad",
          platform: "meta",
          format: "Video (9:16)",
          thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&auto=format&fit=crop&q=60",
          status: "active",
          spend: "₹8,420",
          impressions: "640,000",
          clicks: "28,400",
          ctr: "4.43%",
          cpa: "₹3.80",
          roas: "4.92x",
          conversions: "2,215",
          budget: 2500,
          pacingPercent: 88,
          pacingColor: "bg-[#0f766e]",
          category: "Meta Ads",
        },
        {
          userId: user._id,
          name: "PMax_Asset_BestSellers_Carousel",
          campaign: "Google_PMax_Top_Sellers_AssetGroup",
          platform: "google",
          format: "Multi-Asset (Responsive)",
          thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
          status: "active",
          spend: "₹12,300",
          impressions: "720,000",
          clicks: "34,200",
          ctr: "4.75%",
          cpa: "₹5.20",
          roas: "4.60x",
          conversions: "2,365",
          budget: 3500,
          pacingPercent: 62,
          pacingColor: "bg-emerald-600",
          category: "Google PMax",
        },
        {
          userId: user._id,
          name: "LinkedIn_B2B_Executive_Demo_01",
          campaign: "LinkedIn_B2B_DecisionMakers_Q4",
          platform: "linkedin",
          format: "Sponsored InFeed (1:1)",
          thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
          status: "active",
          spend: "₹6,150",
          impressions: "590,000",
          clicks: "19,800",
          ctr: "3.35%",
          cpa: "₹6.10",
          roas: "3.95x",
          conversions: "1,008",
          budget: 1800,
          pacingPercent: 91,
          pacingColor: "bg-[#0f766e]",
          category: "LinkedIn Sponsored",
        },
        {
          userId: user._id,
          name: "Shorts_Direct_Promo_15Sec",
          campaign: "YouTube_Shorts_Direct_Conversion",
          platform: "youtube",
          format: "Shorts Video (9:16)",
          thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60",
          status: "paused",
          spend: "₹3,890",
          impressions: "290,000",
          clicks: "9,400",
          ctr: "3.24%",
          cpa: "₹8.90",
          roas: "3.40x",
          conversions: "437",
          budget: 1000,
          pacingPercent: 45,
          pacingColor: "bg-amber-600",
          category: "YouTube Shorts",
        },
        {
          userId: user._id,
          name: "Amazon_Sponsored_HeroPack_Video",
          campaign: "Amazon_Sponsored_Brands_HeroPack",
          platform: "amazon",
          format: "In-Search Video (16:9)",
          thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
          status: "active",
          spend: "₹5,200",
          impressions: "410,000",
          clicks: "14,100",
          ctr: "3.44%",
          cpa: "₹5.45",
          roas: "4.20x",
          conversions: "954",
          budget: 1500,
          pacingPercent: 79,
          pacingColor: "bg-[#0f766e]",
          category: "Amazon DSP",
        },
      ]);
    }

    const existingAccounts = await ConnectedAccount.countDocuments({ userId: user._id });
    if (existingAccounts === 0) {
      await ConnectedAccount.insertMany([
        {
          userId: user._id,
          name: "Meta Ads (BM_29401)",
          accountId: "act_849201948",
          platform: "meta",
          status: "Healthy",
          lastSync: "32 seconds ago",
          activeCampaigns: 6,
          iconBg: "bg-blue-600",
          currency: "INR (₹)",
          spendCap: "₹25,000/mo",
        },
        {
          userId: user._id,
          name: "Google Ads MCC (Search & PMax)",
          accountId: "492-019-3829",
          platform: "google",
          status: "Healthy",
          lastSync: "1 minute ago",
          activeCampaigns: 8,
          iconBg: "bg-emerald-600",
          currency: "INR (₹)",
          spendCap: "₹35,000/mo",
        },
        {
          userId: user._id,
          name: "LinkedIn Campaign Manager",
          accountId: "li_corp_840192",
          platform: "linkedin",
          status: "Healthy",
          lastSync: "4 minutes ago",
          activeCampaigns: 4,
          iconBg: "bg-blue-700",
          currency: "INR (₹)",
          spendCap: "₹15,000/mo",
        },
        {
          userId: user._id,
          name: "TikTok For Business (Global)",
          accountId: "tt_adv_994821",
          platform: "tiktok",
          status: "Healthy",
          lastSync: "12 minutes ago",
          activeCampaigns: 5,
          iconBg: "bg-neutral-900",
          currency: "INR (₹)",
          spendCap: "₹20,000/mo",
        },
      ]);
    }

    const existingTeam = await TeamMember.countDocuments({ userId: user._id });
    if (existingTeam === 0) {
      await TeamMember.insertMany([
        {
          userId: user._id,
          name: user.name || "Workspace Admin",
          email: user.email,
          role: "Admin",
          status: "Active",
          avatar: user.avatar || null,
          lastActive: "Just now",
        },
        {
          userId: user._id,
          name: "Sarah Jenkins",
          email: "sarah.j@ados.io",
          role: "Media Buyer",
          status: "Active",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
          lastActive: "14 mins ago",
        },
        {
          userId: user._id,
          name: "David Chen",
          email: "david.c@ados.io",
          role: "Analyst",
          status: "Active",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
          lastActive: "2 hours ago",
        },
      ]);
    }

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
    console.error("Warning: Error initializing starter user data:", error.message);
  }
};
