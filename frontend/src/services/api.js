const API_BASE = "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = localStorage.getItem("ados_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || (data.errors && data.errors[0]?.message) || `HTTP Error ${res.status}`;
    throw new Error(errorMsg);
  }
  return data.data !== undefined ? data.data : data;
};

export const api = {
  // Auth
  async googleAuth(payload) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: getHeaders(),
        credentials: "include",
      });
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem("ados_token");
    localStorage.removeItem("ados_user");
  },

  // Ads & Campaigns
  async getAds(params = {}) {
    const query = new URLSearchParams();
    if (params.platform && params.platform !== "all") query.append("platform", params.platform);
    if (params.status && params.status !== "all") query.append("status", params.status);
    if (params.search) query.append("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_BASE}/ads${qs}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async getAdStats() {
    const res = await fetch(`${API_BASE}/ads/stats`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async createAd(adData) {
    const res = await fetch(`${API_BASE}/ads`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(adData),
    });
    return handleResponse(res);
  },

  async toggleAdStatus(id) {
    const res = await fetch(`${API_BASE}/ads/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async deleteAd(id) {
    const res = await fetch(`${API_BASE}/ads/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Connected Accounts
  async getAccounts() {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async connectAccount(accountData) {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(accountData),
    });
    return handleResponse(res);
  },

  async disconnectAccount(id) {
    const res = await fetch(`${API_BASE}/accounts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Team Members
  async getTeam() {
    const res = await fetch(`${API_BASE}/team`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async inviteTeamMember(memberData) {
    const res = await fetch(`${API_BASE}/team`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(memberData),
    });
    return handleResponse(res);
  },

  async removeTeamMember(id) {
    const res = await fetch(`${API_BASE}/team/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Settings & API Key
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify(settingsData),
    });
    return handleResponse(res);
  },

  async regenerateApiKey() {
    const res = await fetch(`${API_BASE}/settings/regenerate-api-key`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  // Google Ads API Integration (Developer Testing Mode)
  async getGoogleAdsStatus() {
    const res = await fetch(`${API_BASE}/google-ads/status`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async getGoogleAdsAuthUrl() {
    const res = await fetch(`${API_BASE}/google-ads/auth-url`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async getGoogleAdsAccounts() {
    const res = await fetch(`${API_BASE}/google-ads/accounts`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async selectGoogleAdsAccount(customerId, managerId = null) {
    const res = await fetch(`${API_BASE}/google-ads/select-account`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
      body: JSON.stringify({ customerId, managerId }),
    });
    return handleResponse(res);
  },

  async getGoogleAdsCampaigns(params = {}) {
    const query = new URLSearchParams();
    if (params.dateRange) query.append("dateRange", params.dateRange);
    if (params.limit) query.append("limit", params.limit);

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_BASE}/google-ads/campaigns${qs}`, {
      method: "GET",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },

  async disconnectGoogleAds() {
    const res = await fetch(`${API_BASE}/google-ads/disconnect`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(res);
  },
};
