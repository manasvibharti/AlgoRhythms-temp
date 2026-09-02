/**
 * ============================================================================
 * AnumatiSetu — Business Compliance & Statutory Approval Platform
 * Frontend Client Layer & Authentication Bridge
 * ============================================================================
 */

const API_BASE = "http://localhost:4000/api";
const UPLOADS_BASE = "http://localhost:4000/uploads";
const TOKEN_KEY = "anumatisetu_auth_token";

// ----------------------------------------------------------------------------
// 1. Regulatory Requirement Definition Rules (Client Display Catalog)
// ----------------------------------------------------------------------------
const STATUTORY_CATALOG = [
  {
    code: "REQ_TRADE_LICENSE",
    title: "Municipal Trade License",
    department: "Municipal Corporation / Local Urban Body",
    category: "General Business",
    description: "Mandatory operating permit issued by local municipal authorities verifying commercial zoning compliance.",
    mandatoryDocuments: ["Property Tax Receipt or Lease Deed", "Identity & Address Proof of Proprietor/Directors", "Sanctioned Building Layout"],
    inspectionRequired: false,
    validityYears: 1,
    feeEstimate: "₹5,000 – ₹10,000"
  },
  {
    code: "REQ_FIRE_NOC",
    title: "Fire Safety Certificate (NOC)",
    department: "State Fire and Emergency Services Department",
    category: "Safety & Hazard",
    description: "Statutory clearance certifying premises compliance with the National Building Code (NBC) fire protection measures.",
    mandatoryDocuments: ["Architectural Fire Evacuation Plan", "Hydrant & Sprinkler Test Certificates", "Fire Extinguisher Installation Audit"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹10,000 – ₹25,000"
  },
  {
    code: "REQ_BUILDING_SANCTION",
    title: "Industrial Building Plan Sanction & Occupancy",
    department: "Industrial Area Development Board / Town Planning Authority",
    category: "Infrastructure",
    description: "Formal sanction of industrial civil structures ensuring structural stability and zoning clearances.",
    mandatoryDocuments: ["Structural Stability Certificate by Chartered Engineer", "Site Elevation & Cross-Section Blueprints", "Land Allotment Order"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹25,000 – ₹75,000"
  },
  {
    code: "REQ_FACTORIES_LICENSE",
    title: "Factory Registration & License (Form 2)",
    department: "Directorate of Industrial Safety & Health (DISH)",
    category: "Labour & Safety",
    description: "Mandatory factory operating license under the Factories Act, 1948 for manufacturing establishments.",
    mandatoryDocuments: ["Approved Factory Plan Drawing", "Machinery Horsepower Schedule", "Ventilation & Lighting Certificate", "Safety Officer Appointment Proof"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹15,000 – ₹40,000"
  },
  {
    code: "REQ_SPCB_CTE_CTO",
    title: "Pollution Consent to Operate (CTO - Air & Water Acts)",
    department: "State Pollution Control Board (SPCB)",
    category: "Environment",
    description: "Statutory environmental consent under Section 25/26 of Water Act 1974 and Section 21 of Air Act 1981.",
    mandatoryDocuments: ["Effluent Treatment Plant (ETP) / STP Schematics", "Air Pollution Control Equipment Details", "Raw Material Mass Balance Flowsheet", "Ambient Air & Effluent Lab Test Reports"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹20,000 – ₹60,000"
  },
  {
    code: "REQ_EPFO_REG",
    title: "EPFO Employer Registration & Compliance Code",
    department: "Employees' Provident Fund Organisation (Ministry of Labour)",
    category: "Labour Welfare",
    description: "Mandatory provident fund registration under the Employees' Provident Funds & Miscellaneous Provisions Act, 1952.",
    mandatoryDocuments: ["Certificate of Incorporation / Partnership Deed", "PAN & GST Registration Proof", "List of First 20 Covered Employees", "Bank Account Cancelled Cheque"],
    inspectionRequired: false,
    validityYears: 10,
    feeEstimate: "Nil (Statutory Free Filing)"
  },
  {
    code: "REQ_ESIC_REG",
    title: "ESIC Employer Registration Code",
    department: "Employees' State Insurance Corporation (ESIC)",
    category: "Labour Welfare",
    description: "Mandatory healthcare and disability insurance registration under the Employees' State Insurance Act, 1948.",
    mandatoryDocuments: ["Attendance Register Abstract", "Salary Wage Register", "List of Covered Employees", "Factory/Shop License Copy"],
    inspectionRequired: false,
    validityYears: 10,
    feeEstimate: "Nil (Statutory Free Filing)"
  },
  {
    code: "REQ_BOILER_CERT",
    title: "Industrial Boiler Operation Certificate",
    department: "Directorate of Steam Boilers",
    category: "Safety & Hazard",
    description: "Statutory annual certificate under Indian Boiler Regulations (IBR) certifying safety of high-pressure vessels.",
    mandatoryDocuments: ["Hydraulic Pressure Test Inspection Report", "Certified Boiler Attendant License", "Steam Piping Isometric Drawings"],
    inspectionRequired: true,
    validityYears: 1,
    feeEstimate: "₹12,000 – ₹30,000"
  },
  {
    code: "REQ_FSSAI_LICENSE",
    title: "FSSAI Food Business Manufacturing License",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    category: "Food Safety",
    description: "Central or State statutory food safety license under the Food Safety and Standards Act, 2006.",
    mandatoryDocuments: ["Food Safety Management System (FSMS) Plan", "Water Potability Test Report", "Equipment Layout & Capacity Breakdown", "Recall Management Protocol"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹7,500 – ₹15,000"
  },
  {
    code: "REQ_PESO_LICENSE",
    title: "PESO Hazardous Chemical & Petroleum Storage License",
    department: "Petroleum & Explosives Safety Organisation (PESO)",
    category: "Safety & Hazard",
    description: "Statutory approval under Petroleum Rules & Static and Mobile Pressure Vessels (SMPV) Rules.",
    mandatoryDocuments: ["Storage Tank Fabrication Drawings", "Flameproof Equipment Test Certificates", "On-site Emergency Disaster Management Plan"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹25,000 – ₹50,000"
  }
];

// ----------------------------------------------------------------------------
// 2. API Service Layer (Authenticated Backend Calls)
// ----------------------------------------------------------------------------
const ApiService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },

  getAuthHeaders(includeContentType = true) {
    const headers = {};
    const token = this.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (includeContentType) headers["Content-Type"] = "application/json";
    return headers;
  },

  async register(email, password, businessName) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, businessName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    this.setToken(data.token);
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    this.setToken(data.token);
    return data;
  },

  async logout() {
    try {
      if (this.getToken()) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: this.getAuthHeaders()
        });
      }
    } catch (e) {}
    this.setToken(null);
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) {
        if (res.status === 401) this.setToken(null);
        return null;
      }
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getProfile() {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async saveProfile(profileData) {
    const hasToken = !!this.getToken();
    const url = hasToken ? `${API_BASE}/profile` : `${API_BASE}/auth/register-and-profile`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save profile");
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async getRequirements() {
    try {
      const res = await fetch(`${API_BASE}/profile/requirements`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getApplications(filterStatus = "ALL") {
    try {
      const url = filterStatus && filterStatus !== "ALL"
        ? `${API_BASE}/applications?status=${encodeURIComponent(filterStatus)}`
        : `${API_BASE}/applications`;
      const res = await fetch(url, { headers: this.getAuthHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getApplicationById(id) {
    try {
      const res = await fetch(`${API_BASE}/applications/${encodeURIComponent(id)}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async createApplication(requirementCode, notes = "") {
    const res = await fetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ requirementCode, notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create application");
    return data;
  },

  async updateApplicationStatus(appId, newStatus, extraData = {}) {
    const res = await fetch(`${API_BASE}/applications/${encodeURIComponent(appId)}/status`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status: newStatus, ...extraData })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update status");
    return data;
  },

  async getDocuments() {
    try {
      const res = await fetch(`${API_BASE}/documents`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async uploadDocument(formData) {
    const res = await fetch(`${API_BASE}/documents`, {
      method: "POST",
      headers: this.getAuthHeaders(false),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to upload document");
    return data;
  },

  async deleteDocument(docId) {
    const res = await fetch(`${API_BASE}/documents/${encodeURIComponent(docId)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete document");
    return data;
  },

  async getRenewals() {
    try {
      const res = await fetch(`${API_BASE}/renewals`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async renewLicense(renewalId) {
    const res = await fetch(`${API_BASE}/renewals/${encodeURIComponent(renewalId)}/renew`, {
      method: "POST",
      headers: this.getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to renew license");
    return data;
  },

  async getDashboardData() {
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return await res.json();
    } catch (e) {
      return {
        metrics: { hasProfile: false, totalRequiredApprovals: 0, activeApplicationsCount: 0, pendingActionsCount: 0, upcomingRenewalsCount: 0, totalApplicationsCount: 0, approvedCount: 0 },
        recentApplications: [],
        recentActivities: [],
        notifications: []
      };
    }
  },

  async markAllNotificationsRead() {
    try {
      await fetch(`${API_BASE}/dashboard/notifications/mark-read`, {
        method: "POST",
        headers: this.getAuthHeaders()
      });
    } catch (e) {}
  }
};

// ----------------------------------------------------------------------------
// 3. UI Helpers, Dialogs & Auth Modals
// ----------------------------------------------------------------------------
const AlgoUI = {
  showToast(message, type = "info", duration = 3000) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    if (type === "warning") icon = "⚠️";
    if (type === "danger") icon = "✕";

    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, duration);
  },

  openModal(title, bodyHtml, footerHtml = "") {
    let overlay = document.getElementById("modal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "modal-overlay";
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 id="modal-title"></h3>
            <button class="modal-close" id="modal-close-btn" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body" id="modal-body"></div>
          <div class="modal-footer" id="modal-footer"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) AlgoUI.closeModal();
      });
      document.getElementById("modal-close-btn").addEventListener("click", AlgoUI.closeModal);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("open")) {
          AlgoUI.closeModal();
        }
      });
    }

    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = bodyHtml;

    const footerEl = document.getElementById("modal-footer");
    if (footerHtml) {
      footerEl.innerHTML = footerHtml;
      footerEl.style.display = "flex";
    } else {
      footerEl.innerHTML = `<button class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()">Close</button>`;
      footerEl.style.display = "flex";
    }

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  },

  closeModal() {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  openAuthModal(initialTab = "login") {
    const isLogin = initialTab === "login";
    const bodyHtml = `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <div style="display:flex; border-bottom:1px solid var(--slate-200); margin-bottom:0.5rem;">
          <button type="button" id="tab-auth-login" class="filter-btn ${isLogin ? 'active' : ''}" style="flex:1; border-radius:0; border-bottom:2px solid ${isLogin ? 'var(--brand-700)' : 'transparent'};">
            Sign In to Account
          </button>
          <button type="button" id="tab-auth-register" class="filter-btn ${!isLogin ? 'active' : ''}" style="flex:1; border-radius:0; border-bottom:2px solid ${!isLogin ? 'var(--brand-700)' : 'transparent'};">
            Create Enterprise Account
          </button>
        </div>

        <!-- Login Form -->
        <form id="auth-login-form" style="display:${isLogin ? 'flex' : 'none'}; flex-direction:column; gap:1rem;">
          <div class="form-group">
            <label class="form-label" for="login-email">Registered Email Address <span class="required">*</span></label>
            <input type="email" id="login-email" class="form-control" placeholder="entrepreneur@company.com" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Password <span class="required">*</span></label>
            <input type="password" id="login-password" class="form-control" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top:0.5rem; justify-content:center;">
            Sign In to AnumatiSetu →
          </button>
        </form>

        <!-- Register Form -->
        <form id="auth-register-form" style="display:${!isLogin ? 'flex' : 'none'}; flex-direction:column; gap:1rem;">
          <div class="form-group">
            <label class="form-label" for="reg-biz-name">Enterprise / Entity Legal Name <span class="required">*</span></label>
            <input type="text" id="reg-biz-name" class="form-control" placeholder="e.g. Apex BioTech Pvt Ltd" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-email">Official Email Address <span class="required">*</span></label>
            <input type="email" id="reg-email" class="form-control" placeholder="contact@company.com" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-password">Password (min 6 characters) <span class="required">*</span></label>
            <input type="password" id="reg-password" class="form-control" placeholder="••••••••" minlength="6" required />
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top:0.5rem; justify-content:center;">
            Create Account & Setup Compliance →
          </button>
        </form>
      </div>
    `;

    AlgoUI.openModal("Enterprise Access & Account Management", bodyHtml, "");

    document.getElementById("tab-auth-login")?.addEventListener("click", () => {
      document.getElementById("auth-login-form").style.display = "flex";
      document.getElementById("auth-register-form").style.display = "none";
      document.getElementById("tab-auth-login").classList.add("active");
      document.getElementById("tab-auth-register").classList.remove("active");
      document.getElementById("tab-auth-login").style.borderBottom = "2px solid var(--brand-700)";
      document.getElementById("tab-auth-register").style.borderBottom = "2px solid transparent";
    });

    document.getElementById("tab-auth-register")?.addEventListener("click", () => {
      document.getElementById("auth-login-form").style.display = "none";
      document.getElementById("auth-register-form").style.display = "flex";
      document.getElementById("tab-auth-register").classList.add("active");
      document.getElementById("tab-auth-login").classList.remove("active");
      document.getElementById("tab-auth-register").style.borderBottom = "2px solid var(--brand-700)";
      document.getElementById("tab-auth-login").style.borderBottom = "2px solid transparent";
    });

    document.getElementById("auth-login-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      try {
        AlgoUI.showToast("Authenticating...", "info");
        const res = await ApiService.login(email, password);
        AlgoUI.showToast(`Welcome back, ${res.user.businessName}!`, "success");
        AlgoUI.closeModal();
        setTimeout(() => location.reload(), 400);
      } catch (err) {
        AlgoUI.showToast(err.message, "danger");
      }
    });

    document.getElementById("auth-register-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const businessName = document.getElementById("reg-biz-name").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      try {
        AlgoUI.showToast("Creating enterprise account...", "info");
        const res = await ApiService.register(email, password, businessName);
        AlgoUI.showToast(`Account created for ${res.user.businessName}!`, "success");
        AlgoUI.closeModal();
        setTimeout(() => {
          window.location.href = "profile.html";
        }, 400);
      } catch (err) {
        AlgoUI.showToast(err.message, "danger");
      }
    });
  },

  renderStatusBadge(status) {
    const s = (status || "").toUpperCase();
    if (s === "APPROVED" || s === "ACTIVE" || s === "VERIFIED") {
      return `<span class="badge badge-success"><span class="badge-dot"></span>${status}</span>`;
    } else if (s === "SUBMITTED" || s === "UNDER REVIEW" || s === "DUE_SOON") {
      return `<span class="badge badge-info"><span class="badge-dot"></span>${status}</span>`;
    } else if (s === "CLARIFICATION REQUIRED" || s === "INSPECTION REQUIRED") {
      return `<span class="badge badge-warning"><span class="badge-dot"></span>${status}</span>`;
    } else if (s === "REJECTED" || s === "OVERDUE") {
      return `<span class="badge badge-danger"><span class="badge-dot"></span>${status}</span>`;
    } else if (s === "DRAFT" || s === "NOT_APPLIED") {
      return `<span class="badge badge-neutral"><span class="badge-dot"></span>${status === "NOT_APPLIED" ? "Not Applied" : status}</span>`;
    }
    return `<span class="badge badge-neutral">${status}</span>`;
  },

  async setupNavigation() {
    const authData = await ApiService.getCurrentUser();
    const user = authData ? authData.user : null;
    const profile = authData ? authData.profile : null;

    const navActions = document.querySelector(".nav-actions");
    const pillEls = document.querySelectorAll(".profile-pill");

    if (user) {
      // User is logged in
      const displayName = (profile && profile.businessName) ? profile.businessName : user.businessName;

      pillEls.forEach(el => {
        el.textContent = displayName;
        el.setAttribute("title", `Account: ${displayName} (${user.email})`);
        const parent = el.parentElement;

        if (parent && !parent.querySelector(".user-dropdown")) {
          parent.classList.add("user-menu-wrapper");
          const dropdown = document.createElement("div");
          dropdown.className = "user-dropdown";
          dropdown.id = "user-profile-dropdown";
          dropdown.innerHTML = `
            <div class="user-dropdown-header">
              <div class="user-dropdown-name">${displayName}</div>
              <div class="user-dropdown-meta">${user.email}</div>
            </div>
            <div class="user-dropdown-menu">
              <a href="profile.html" class="user-dropdown-item">
                <span>🏢</span> Manage Business Profile
              </a>
              <a href="dashboard.html" class="user-dropdown-item">
                <span>📊</span> Compliance Dashboard
              </a>
              <a href="approvals.html" class="user-dropdown-item">
                <span>📋</span> Required Approvals
              </a>
              <button type="button" class="user-dropdown-item danger" id="user-sign-out-btn">
                <span>🚪</span> Sign Out
              </button>
            </div>
          `;
          parent.appendChild(dropdown);

          el.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle("show");
          });

          document.addEventListener("click", (e) => {
            if (!parent.contains(e.target)) {
              dropdown.classList.remove("show");
            }
          });

          dropdown.querySelector("#user-sign-out-btn")?.addEventListener("click", async () => {
            await AlgoUI.handleSignOut();
          });
        }
      });
    } else {
      // User is signed out -> Replace pill with Sign In button
      pillEls.forEach(el => {
        el.textContent = "Sign In / Register";
        el.style.backgroundColor = "var(--brand-700)";
        el.style.color = "#ffffff";
        el.removeAttribute("href");
        el.onclick = (e) => {
          e.preventDefault();
          AlgoUI.openAuthModal("login");
        };
      });
    }

    // Notifications setup if logged in
    const badgeEl = document.getElementById("nav-notif-badge");
    const notifBtn = document.getElementById("nav-notif-btn");
    const notifDropdown = document.getElementById("nav-notif-dropdown");

    if (user && notifBtn && notifDropdown) {
      const dashData = await ApiService.getDashboardData();
      const notifs = dashData.notifications || [];
      const unreadCount = notifs.filter(n => !n.read).length;

      if (badgeEl) {
        if (unreadCount > 0) {
          badgeEl.textContent = unreadCount;
          badgeEl.style.display = "inline-flex";
        } else {
          badgeEl.style.display = "none";
        }
      }

      notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
          notifDropdown.classList.remove("show");
        }
      });

      const notifListEl = document.getElementById("notif-list-container");
      if (notifListEl) {
        if (notifs.length === 0) {
          notifListEl.innerHTML = `<div class="empty-state-compact">No new notifications.</div>`;
        } else {
          notifListEl.innerHTML = notifs.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}">
              <div class="notif-msg">${n.message}</div>
              <div class="notif-time">${n.time}</div>
            </div>
          `).join("");
        }
      }

      document.getElementById("notif-mark-all-read")?.addEventListener("click", async () => {
        await ApiService.markAllNotificationsRead();
        if (badgeEl) badgeEl.style.display = "none";
        document.querySelectorAll(".notif-item.unread").forEach(el => el.classList.remove("unread"));
        AlgoUI.showToast("All notifications marked as read.", "info");
      });
    }

    // Mobile Hamburger
    const mobileBtn = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("main-nav-links");
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener("click", () => {
        navMenu.classList.toggle("show");
      });
    }

    // Active Navigation Highlighting
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPath || (currentPath === "" && href === "index.html")) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  },

  async handleSignOut() {
    if (confirm("Are you sure you want to sign out of your AnumatiSetu account?")) {
      await ApiService.logout();
      AlgoUI.showToast("Signed out successfully.", "info");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 400);
    }
  },

  async ensureAuth() {
    const user = await ApiService.getCurrentUser();
    if (!user) {
      AlgoUI.openAuthModal("login");
      return false;
    }
    return true;
  }
};

// ----------------------------------------------------------------------------
// 4. Page Controllers
// ----------------------------------------------------------------------------

// ==========================================
// PAGE: PROFILE (profile.html)
// ==========================================
async function initProfilePage() {
  const authData = await ApiService.getCurrentUser();
  const user = authData ? authData.user : null;
  const profile = await ApiService.getProfile();
  const formCard = document.querySelector(".card:has(#business-profile-form)") || document.getElementById("business-profile-form")?.closest(".card");
  const form = document.getElementById("business-profile-form");
  const clearBtn = document.getElementById("clear-all-data-btn");

  if (clearBtn) {
    clearBtn.textContent = user ? "Sign Out" : "Sign In / Register";
    clearBtn.onclick = () => {
      if (user) AlgoUI.handleSignOut();
      else AlgoUI.openAuthModal("login");
    };
  }

  const isProfileComplete = profile && profile.isComplete;

  if (isProfileComplete && formCard) {
    const renderProfileSummary = () => {
      formCard.innerHTML = `
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="margin-bottom:0.2rem;">Registered Enterprise Profile</h3>
            <p style="font-size:0.82rem; color:var(--slate-500); margin:0;">Account: <strong>${user.email}</strong></p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="unlock-profile-btn">
            ✏️ Modify Profile
          </button>
        </div>
        <div style="padding: 1.5rem 0 0.5rem 0;">
          <div class="profile-overview-grid">
            <div>
              <div class="profile-field-label">Legal Entity Name</div>
              <div class="profile-field-value">${profile.businessName}</div>
            </div>
            <div>
              <div class="profile-field-label">Industry / Activity Sector</div>
              <div class="profile-field-value">${profile.industryType}</div>
            </div>
            <div>
              <div class="profile-field-label">Operational Stage</div>
              <div class="profile-field-value">${profile.businessStage}</div>
            </div>
            <div>
              <div class="profile-field-label">Location / Estate</div>
              <div class="profile-field-value">${profile.location}</div>
            </div>
            <div>
              <div class="profile-field-label">State Jurisdiction</div>
              <div class="profile-field-value">${profile.state}</div>
            </div>
            <div>
              <div class="profile-field-label">Employees Headcount</div>
              <div class="profile-field-value">${profile.employeesCount || 0} Employees</div>
            </div>
            <div>
              <div class="profile-field-label">Investment in Plant & Machinery</div>
              <div class="profile-field-value">${profile.investmentScale || "—"}</div>
            </div>
            <div>
              <div class="profile-field-label">MSME / Enterprise Category</div>
              <div class="profile-field-value">${profile.businessCategory}</div>
            </div>
          </div>

          <div style="margin-top: 1.75rem; border-top: 1px solid var(--slate-100); padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.82rem; color: var(--success-dark); font-weight: 600;">
              ✓ Statutory requirements mapped and active for ${profile.businessName}
            </div>
            <a href="approvals.html" class="btn btn-primary btn-sm">
              View Applicable Approvals →
            </a>
          </div>
        </div>
      `;

      document.getElementById("unlock-profile-btn")?.addEventListener("click", () => {
        if (confirm("Modifying your business profile will recalculate mandatory statutory clearances. Proceed to edit?")) {
          renderEditForm();
        }
      });
    };

    const renderEditForm = () => {
      formCard.innerHTML = `
        <div class="card-header">
          <h3>Modify Enterprise Registration Details</h3>
        </div>
        <form id="business-profile-form" novalidate>
          <div class="alert alert-warning" style="margin-bottom:1.25rem;">
            <span>⚠️</span>
            <div>
              <strong>Profile Update Notice:</strong> Changes to sector, employee count, or location will automatically update your statutory requirements.
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="businessName" class="form-label">Business / Entity Legal Name <span class="required">*</span></label>
              <input type="text" id="businessName" name="businessName" class="form-control" value="${profile?.businessName || user?.businessName || ''}" required />
            </div>
            <div class="form-group">
              <label for="industryType" class="form-label">Industry / Activity Sector <span class="required">*</span></label>
              <select id="industryType" name="industryType" class="form-select" required>
                <option value="Manufacturing" ${profile.industryType === 'Manufacturing' ? 'selected' : ''}>Manufacturing / Engineering</option>
                <option value="Food Processing" ${profile.industryType === 'Food Processing' ? 'selected' : ''}>Food Processing & Agro</option>
                <option value="Textile" ${profile.industryType === 'Textile' ? 'selected' : ''}>Textile & Apparel</option>
                <option value="Electronics" ${profile.industryType === 'Electronics' ? 'selected' : ''}>Electronics & Hardware</option>
                <option value="Chemicals" ${profile.industryType === 'Chemicals' ? 'selected' : ''}>Chemicals & Hazardous Materials</option>
                <option value="Services" ${profile.industryType === 'Services' ? 'selected' : ''}>Commercial Services / Warehousing</option>
                <option value="Other" ${profile.industryType === 'Other' ? 'selected' : ''}>Other General Business</option>
              </select>
            </div>
            <div class="form-group">
              <label for="businessStage" class="form-label">Operating Stage <span class="required">*</span></label>
              <select id="businessStage" name="businessStage" class="form-select" required>
                <option value="New Setup" ${profile.businessStage === 'New Setup' ? 'selected' : ''}>New Setup (Pre-Operational)</option>
                <option value="Expansion" ${profile.businessStage === 'Expansion' ? 'selected' : ''}>Expansion / Brownfield Upgrade</option>
                <option value="Existing Business" ${profile.businessStage === 'Existing Business' ? 'selected' : ''}>Existing Business (Operational)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="location" class="form-label">Operating Location / Industrial Estate <span class="required">*</span></label>
              <input type="text" id="location" name="location" class="form-control" value="${profile.location || ''}" placeholder="e.g. Peenya Industrial Area, Bengaluru" required />
            </div>
            <div class="form-group">
              <label for="state" class="form-label">State / Union Territory <span class="required">*</span></label>
              <select id="state" name="state" class="form-select" required>
                ${["Karnataka", "Maharashtra", "Gujarat", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Uttar Pradesh", "Rajasthan", "Haryana", "Delhi NCR", "Goa", "West Bengal", "Other"]
                  .map(s => `<option value="${s}" ${profile.state === s ? 'selected' : ''}>${s}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label for="investmentScale" class="form-label">Investment in Plant & Machinery</label>
              <input type="text" id="investmentScale" name="investmentScale" class="form-control" value="${profile.investmentScale || ''}" placeholder="e.g. ₹5 Crores" />
            </div>
            <div class="form-group">
              <label for="employeesCount" class="form-label">Number of Employees <span class="required">*</span></label>
              <input type="number" id="employeesCount" name="employeesCount" class="form-control" value="${profile.employeesCount || 0}" min="0" required />
            </div>
            <div class="form-group full-width">
              <label for="businessCategory" class="form-label">Business Scale / Category <span class="required">*</span></label>
              <select id="businessCategory" name="businessCategory" class="form-select" required>
                ${["Micro Enterprise", "Small Enterprise", "Medium Enterprise", "Large Enterprise"]
                  .map(c => `<option value="${c}" ${profile.businessCategory === c ? 'selected' : ''}>${c}</option>`).join("")}
              </select>
            </div>
          </div>
          <div style="margin-top: 1.5rem; border-top: 1px solid var(--slate-100); padding-top: 1rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn btn-secondary" id="cancel-edit-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Profile & Determine Requirements →</button>
          </div>
        </form>
      `;

      document.getElementById("cancel-edit-btn")?.addEventListener("click", () => {
        renderProfileSummary();
      });

      attachFormSubmitHandler();
    };

    renderProfileSummary();
  } else if (form) {
    // Pre-fill business name from registered user if present
    if (user && form.elements["businessName"] && !form.elements["businessName"].value) {
      form.elements["businessName"].value = user.businessName || "";
    }
    attachFormSubmitHandler();
  }

  function attachFormSubmitHandler() {
    const activeForm = document.getElementById("business-profile-form");
    if (!activeForm) return;
    activeForm.onsubmit = window.handleProfileFormSubmit;
  }
}

window.handleProfileFormSubmit = async function(e) {
  if (e && e.preventDefault) e.preventDefault();

  const activeForm = document.getElementById("business-profile-form");
  if (!activeForm) return false;

  const profileData = {
    businessName: (activeForm.elements["businessName"]?.value || "").trim(),
    industryType: activeForm.elements["industryType"]?.value || "Manufacturing",
    businessStage: activeForm.elements["businessStage"]?.value || "New Setup",
    location: (activeForm.elements["location"]?.value || "").trim(),
    state: activeForm.elements["state"]?.value || "Karnataka",
    investmentScale: (activeForm.elements["investmentScale"]?.value || "").trim(),
    employeesCount: parseInt(activeForm.elements["employeesCount"]?.value) || 0,
    businessCategory: activeForm.elements["businessCategory"]?.value || "Small Enterprise"
  };

  if (!profileData.businessName || !profileData.location) {
    AlgoUI.showToast("Please enter business legal name and location.", "warning");
    return false;
  }

  try {
    AlgoUI.showToast("Saving profile and determining requirements...", "info");
    await ApiService.saveProfile(profileData);
    AlgoUI.showToast("Profile saved! Statutory clearances determined.", "success");
    setTimeout(() => {
      window.location.href = "approvals.html";
    }, 500);
  } catch (err) {
    AlgoUI.showToast("Error saving profile: " + err.message, "danger");
  }
  return false;
};

// ==========================================
// PAGE: DASHBOARD (dashboard.html)
// ==========================================
async function initDashboardPage() {
  const user = await ApiService.getCurrentUser();
  if (!user) {
    AlgoUI.openAuthModal("login");
    return;
  }

  const data = await ApiService.getDashboardData();
  const { metrics, recentApplications, recentActivities } = data;

  const titleEl = document.getElementById("dash-header-title");
  if (titleEl) {
    if (metrics.hasProfile && metrics.profile) {
      titleEl.textContent = `Compliance Overview — ${metrics.profile.businessName}`;
    } else if (user) {
      titleEl.textContent = `Compliance Overview — ${user.businessName || 'Enterprise'}`;
    }
  }

  const totalReqEl = document.getElementById("kpi-total-approvals");
  const activeAppsEl = document.getElementById("kpi-active-applications");
  const pendingActionsEl = document.getElementById("kpi-pending-actions");
  const upcomingRenewalsEl = document.getElementById("kpi-upcoming-renewals");

  if (totalReqEl) totalReqEl.textContent = metrics.totalRequiredApprovals;
  if (activeAppsEl) activeAppsEl.textContent = metrics.activeApplicationsCount;
  if (pendingActionsEl) pendingActionsEl.textContent = metrics.pendingActionsCount;
  if (upcomingRenewalsEl) upcomingRenewalsEl.textContent = metrics.upcomingRenewalsCount;

  const promptBanner = document.getElementById("dash-profile-prompt");
  if (promptBanner) {
    if (!metrics.hasProfile) {
      promptBanner.style.display = "block";
    } else {
      promptBanner.style.display = "none";
    }
  }

  const appsContainer = document.getElementById("dash-recent-applications-list");
  if (appsContainer) {
    if (recentApplications.length === 0) {
      appsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No applications created yet.</div>
          <div class="empty-state-desc">Set up your business profile to view applicable statutory approvals and create your first application.</div>
          <div style="margin-top: 1rem;">
            <a href="${metrics.hasProfile ? 'approvals.html' : 'profile.html'}" class="btn btn-primary btn-sm">
              ${metrics.hasProfile ? 'View Required Approvals →' : 'Complete Business Profile →'}
            </a>
          </div>
        </div>
      `;
    } else {
      appsContainer.innerHTML = `
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Approval / License</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${recentApplications.map(app => `
                <tr>
                  <td><code>${app.id}</code></td>
                  <td><strong>${app.title}</strong></td>
                  <td style="font-size:0.82rem; color:var(--slate-600);">${app.department}</td>
                  <td>${AlgoUI.renderStatusBadge(app.status)}</td>
                  <td>
                    <a href="applications.html?id=${app.id}" class="btn btn-secondary btn-sm">Track</a>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  const actContainer = document.getElementById("dash-activity-list");
  if (actContainer) {
    if (recentActivities.length === 0) {
      actContainer.innerHTML = `<div class="empty-state-compact">No recent compliance activity recorded.</div>`;
    } else {
      actContainer.innerHTML = recentActivities.map(act => `
        <div class="activity-row">
          <div class="activity-bullet"></div>
          <div class="activity-body">
            <div class="activity-text">${act.text}</div>
            <div class="activity-time">${act.timestamp}</div>
          </div>
        </div>
      `).join("");
    }
  }
}

// ==========================================
// PAGE: APPROVALS & REQUIREMENTS (approvals.html)
// ==========================================
let currentReqCategory = "ALL";
let currentReqSearch = "";

async function renderRequirementsList() {
  const authData = await ApiService.getCurrentUser();
  if (!authData) {
    AlgoUI.openAuthModal("login");
    return;
  }

  const profile = await ApiService.getProfile();
  const container = document.getElementById("requirements-table-container");
  const countEl = document.getElementById("requirements-count");

  if (!profile || !profile.isComplete) {
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">Business profile required.</div>
          <div class="empty-state-desc">Please complete your business location, industry sector, and headcount details to determine your statutory clearances.</div>
          <div style="margin-top: 1rem;">
            <a href="profile.html" class="btn btn-primary">Complete Business Profile →</a>
          </div>
        </div>
      `;
    }
    if (countEl) countEl.textContent = "0 requirements";
    return;
  }

  let requirements = await ApiService.getRequirements();

  if (currentReqCategory !== "ALL") {
    requirements = requirements.filter(r => r.category.toUpperCase() === currentReqCategory.toUpperCase());
  }
  if (currentReqSearch) {
    const q = currentReqSearch.toLowerCase();
    requirements = requirements.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  }

  if (countEl) countEl.textContent = `${requirements.length} applicable requirements for ${profile.businessName}`;

  if (container) {
    if (requirements.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No matching statutory requirements.</div>
          <div class="empty-state-desc">Try clearing your search query or selecting a different category filter.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th style="min-width: 260px;">Approval / Permit</th>
              <th>Department / Authority</th>
              <th>Category</th>
              <th>Inspection</th>
              <th>Fee Est.</th>
              <th>Current Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${requirements.map(req => `
              <tr>
                <td>
                  <strong>${req.title}</strong>
                  <div style="font-size: 0.78rem; color: var(--slate-500); margin-top: 0.2rem;">${req.description}</div>
                </td>
                <td style="font-size: 0.84rem; color: var(--slate-700);">${req.department}</td>
                <td><span class="badge badge-neutral">${req.category}</span></td>
                <td>${req.inspectionRequired ? '<span style="color:var(--warning-dark); font-weight:600;">Yes</span>' : '<span style="color:var(--slate-500);">No</span>'}</td>
                <td style="font-size: 0.82rem; font-weight:500;">${req.feeEstimate}</td>
                <td>${AlgoUI.renderStatusBadge(req.status)}</td>
                <td style="text-align: right;">
                  <button class="btn btn-primary btn-sm" onclick="handleStartApplication('${req.code}')">
                    ${req.status === "NOT_APPLIED" ? "Apply Now" : "View Application"}
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

async function handleStartApplication(reqCode) {
  const apps = await ApiService.getApplications();
  const existing = apps.find(a => a.requirementCode === reqCode);

  if (existing) {
    window.location.href = `applications.html?id=${existing.id}`;
    return;
  }

  const catalogItem = STATUTORY_CATALOG.find(r => r.code === reqCode);
  if (!catalogItem) return;

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      <p style="color:var(--slate-700); font-size:0.9rem;">
        Initiating statutory filing for: <strong>${catalogItem.title}</strong> under <strong>${catalogItem.department}</strong>.
      </p>
      <div>
        <label class="form-label">Mandatory Documents to Prepare:</label>
        <ul style="font-size:0.85rem; color:var(--slate-600); margin-left:1.25rem; margin-top:0.25rem;">
          ${catalogItem.mandatoryDocuments.map(d => `<li>${d}</li>`).join("")}
        </ul>
      </div>
      <div class="form-group">
        <label class="form-label" for="app-init-notes">Application Notes / Specifics (Optional):</label>
        <textarea id="app-init-notes" class="form-textarea" rows="3" placeholder="Enter plant specifications, facility notes, or internal tracking IDs..."></textarea>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()">Cancel</button>
    <button class="btn btn-primary btn-sm" onclick="confirmCreateApplication('${reqCode}')">Create Application Draft →</button>
  `;

  AlgoUI.openModal(`Initiate Application: ${catalogItem.title}`, contentHtml, footerHtml);
}

async function confirmCreateApplication(reqCode) {
  const notes = (document.getElementById("app-init-notes")?.value || "").trim();
  try {
    const newApp = await ApiService.createApplication(reqCode, notes);
    AlgoUI.showToast("Application draft created.", "success");
    AlgoUI.closeModal();
    setTimeout(() => {
      window.location.href = `applications.html?id=${newApp.id}`;
    }, 400);
  } catch (e) {
    AlgoUI.showToast(e.message || "Failed to create application.", "danger");
  }
}

async function initApprovalsPage() {
  const categorySelect = document.getElementById("req-category-filter");
  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      currentReqCategory = e.target.value;
      renderRequirementsList();
    });
  }

  const searchInput = document.getElementById("req-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentReqSearch = e.target.value.trim();
      renderRequirementsList();
    });
  }

  renderRequirementsList();
}

// ==========================================
// PAGE: APPLICATIONS (applications.html)
// ==========================================
let currentAppFilter = "ALL";

async function renderApplicationsTable() {
  const user = await ApiService.getCurrentUser();
  if (!user) {
    AlgoUI.openAuthModal("login");
    return;
  }

  const apps = await ApiService.getApplications(currentAppFilter);
  const container = document.getElementById("applications-table-container");
  const countEl = document.getElementById("applications-count-display");

  if (countEl) countEl.textContent = `${apps.length} applications`;

  if (container) {
    if (apps.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No applications found.</div>
          <div class="empty-state-desc">You have no applications under filter "${currentAppFilter}". Initiate an application from your Required Approvals catalog.</div>
          <div style="margin-top: 1rem;">
            <a href="approvals.html" class="btn btn-primary">Browse Required Approvals →</a>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th style="min-width: 200px;">Approval / License</th>
              <th>Department</th>
              <th>Status</th>
              <th>Created Date</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${apps.map(app => `
              <tr>
                <td><code>${app.id}</code></td>
                <td><strong>${app.title}</strong></td>
                <td style="font-size:0.84rem; color:var(--slate-700);">${app.department}</td>
                <td>${AlgoUI.renderStatusBadge(app.status)}</td>
                <td style="font-size:0.84rem; color:var(--slate-600);">${app.createdDate || "—"}</td>
                <td style="text-align: right;">
                  <button class="btn btn-secondary btn-sm" onclick="openApplicationDetailsModal('${app.id}')">
                    Manage Workflow
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

async function openApplicationDetailsModal(appId) {
  const app = await ApiService.getApplicationById(appId);
  if (!app) return;

  const catalogItem = STATUTORY_CATALOG.find(r => r.code === app.requirementCode);
  const mandatoryDocs = catalogItem ? catalogItem.mandatoryDocuments : [];
  const allDocs = await ApiService.getDocuments();

  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:1.25rem;">
      
      <!-- Top Status Banner -->
      <div style="background-color:var(--slate-50); border:1px solid var(--slate-200); padding:0.85rem 1rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.75rem; color:var(--slate-500); font-weight:700; text-transform:uppercase;">Application Number</span>
          <div style="font-size:1.05rem; font-weight:800; font-family:var(--font-mono); color:var(--slate-900);">${app.id}</div>
        </div>
        <div style="text-align:right;">
          <span style="font-size:0.75rem; color:var(--slate-500); font-weight:700; text-transform:uppercase;">Workflow Status</span>
          <div>${AlgoUI.renderStatusBadge(app.status)}</div>
        </div>
      </div>

      <!-- Application Details -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; font-size:0.88rem;">
        <div>
          <label style="font-weight:700; color:var(--slate-800);">Authority / Department:</label>
          <div style="color:var(--slate-700);">${app.department}</div>
        </div>
        <div>
          <label style="font-weight:700; color:var(--slate-800);">Created Date:</label>
          <div style="color:var(--slate-700);">${app.createdDate || "—"}</div>
        </div>
      </div>

      <!-- Clarification Alert if active -->
      ${app.status === "CLARIFICATION REQUIRED" ? `
        <div class="alert alert-warning">
          <span>⚠️</span>
          <div>
            <strong>Department Clarification Notice:</strong>
            <div>${app.clarificationMessage || "Please submit requested clarifications to the department."}</div>
          </div>
        </div>
      ` : ''}

      <!-- Inspection Alert if active -->
      ${app.status === "INSPECTION REQUIRED" ? `
        <div class="alert alert-warning">
          <span>📅</span>
          <div>
            <strong>Physical Site Inspection Scheduled:</strong>
            <div>Scheduled Inspection Date: <strong>${app.inspectionDate || "To be confirmed by Department Inspector"}</strong></div>
          </div>
        </div>
      ` : ''}

      <!-- Mandatory Documents Checklist with REAL file upload -->
      <div>
        <label style="font-weight:700; font-size:0.88rem; color:var(--slate-800); display:block; margin-bottom:0.4rem;">
          Mandatory Statutory Documents (Upload & Verify):
        </label>
        <div style="border:1px solid var(--slate-200); border-radius:var(--radius-md); overflow:hidden;">
          ${mandatoryDocs.map((docName, idx) => {
            const isAttached = (app.documentsAttached || []).includes(docName);
            const matchingDoc = allDocs.find(d => d.applicationId === app.id && d.name === docName);
            const hasRealFile = matchingDoc && matchingDoc.hasFile && matchingDoc.fileName;

            return `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:0.65rem 0.85rem; border-bottom:1px solid var(--slate-100); font-size:0.84rem;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span>${isAttached ? '✅' : '⚪'}</span>
                  <div>
                    <span style="${isAttached ? 'color:var(--slate-900); font-weight:600;' : 'color:var(--slate-500);'}">${docName}</span>
                    ${matchingDoc && matchingDoc.fileName ? `<div style="font-size:0.75rem; color:var(--slate-500); font-family:var(--font-mono);">${matchingDoc.fileName} (${matchingDoc.fileSize})</div>` : ''}
                  </div>
                </div>
                <div style="display:flex; gap:0.4rem; align-items:center;">
                  ${hasRealFile ? `
                    <a href="${UPLOADS_BASE}/${encodeURIComponent(matchingDoc.fileName)}" target="_blank" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.55rem; font-size:0.78rem;">
                      📄 View File
                    </a>
                  ` : ''}
                  <input type="file" id="app-doc-file-${idx}" style="display:none;" onchange="handleAppDocUpload(event, '${app.id}', '${docName.replace(/'/g, "\\'")}')" />
                  <button class="btn ${isAttached ? 'btn-secondary' : 'btn-primary'} btn-sm" style="padding:0.25rem 0.6rem; font-size:0.78rem;" onclick="document.getElementById('app-doc-file-${idx}').click()">
                    ${isAttached ? 'Replace File' : '+ Upload File'}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Owner Self-Reported Regulatory Status Tracking -->
      <div style="border-top:1px solid var(--slate-200); padding-top:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <label style="font-weight:700; font-size:0.84rem; color:var(--slate-700);">
            Self-Reported Application Tracking Status:
          </label>
          <span style="font-size:0.74rem; color:var(--slate-500);">Record status updates from department</span>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
          ${app.status === "DRAFT" ? `
            <button class="btn btn-primary btn-sm" onclick="advanceAppStatus('${app.id}', 'SUBMITTED')">
              📤 Mark as Submitted (I have filed this)
            </button>
          ` : ''}

          ${app.status === "SUBMITTED" ? `
            <button class="btn btn-secondary btn-sm" onclick="advanceAppStatus('${app.id}', 'UNDER REVIEW')">
              🔍 Mark as Under Review (Department acknowledged)
            </button>
          ` : ''}

          ${app.status === "UNDER REVIEW" ? `
            <button class="btn btn-secondary btn-sm" onclick="triggerClarificationDialog('${app.id}')">
              ⚠️ Record Clarification Notice
            </button>
            ${app.inspectionRequired ? `
              <button class="btn btn-secondary btn-sm" onclick="triggerInspectionDialog('${app.id}')">
                📅 Record Scheduled Inspection
              </button>
            ` : ''}
            <button class="btn btn-success btn-sm" onclick="advanceAppStatus('${app.id}', 'APPROVED')">
              ✓ Record Approval (Permit Issued)
            </button>
            <button class="btn btn-danger btn-sm" onclick="advanceAppStatus('${app.id}', 'REJECTED')">
              ✕ Record Rejection
            </button>
          ` : ''}

          ${app.status === "CLARIFICATION REQUIRED" ? `
            <button class="btn btn-primary btn-sm" onclick="advanceAppStatus('${app.id}', 'UNDER REVIEW')">
              📤 Mark Clarification Submitted
            </button>
          ` : ''}

          ${app.status === "INSPECTION REQUIRED" ? `
            <button class="btn btn-success btn-sm" onclick="advanceAppStatus('${app.id}', 'APPROVED')">
              ✓ Inspection Passed & Approved
            </button>
          ` : ''}

          ${app.status === "APPROVED" ? `
            <a href="renewals.html" class="btn btn-secondary btn-sm">
              📜 View Active License & Renewal Timeline →
            </a>
          ` : ''}
        </div>
      </div>

    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()">Close</button>
  `;

  AlgoUI.openModal(`Application Details: ${app.title}`, contentHtml, footerHtml);
}

async function handleAppDocUpload(event, appId, docName) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("docName", docName);
  formData.append("category", "Statutory Filing");
  formData.append("applicationId", appId);
  formData.append("file", file);

  try {
    AlgoUI.showToast(`Uploading ${file.name}...`, "info");
    await ApiService.uploadDocument(formData);
    AlgoUI.showToast(`Uploaded: ${docName}`, "success");
    openApplicationDetailsModal(appId);
    renderApplicationsTable();
  } catch (err) {
    AlgoUI.showToast("Failed to upload document: " + err.message, "danger");
  }
}

async function advanceAppStatus(appId, newStatus) {
  try {
    await ApiService.updateApplicationStatus(appId, newStatus);
    AlgoUI.showToast(`Application status updated to ${newStatus}.`, "success");
    AlgoUI.closeModal();
    renderApplicationsTable();
  } catch (e) {
    AlgoUI.showToast(e.message || "Failed to update status.", "danger");
  }
}

function triggerClarificationDialog(appId) {
  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      <p style="font-size:0.88rem; color:var(--slate-700);">
        Enter the clarification note or document request issued by the regulatory department:
      </p>
      <div class="form-group">
        <label class="form-label" for="modal-clarification-msg">Department Clarification Details <span class="required">*</span></label>
        <textarea id="modal-clarification-msg" class="form-textarea" rows="4" placeholder="e.g. Submit revised architectural fire exit layout and certified test report."></textarea>
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" onclick="openApplicationDetailsModal('${appId}')">Cancel</button>
    <button class="btn btn-primary btn-sm" onclick="confirmClarificationRequest('${appId}')">Save Clarification Notice →</button>
  `;

  AlgoUI.openModal("Record Department Clarification", contentHtml, footerHtml);
}

async function confirmClarificationRequest(appId) {
  const msg = (document.getElementById("modal-clarification-msg")?.value || "").trim();
  if (!msg) {
    AlgoUI.showToast("Please enter the clarification message.", "warning");
    return;
  }

  try {
    await ApiService.updateApplicationStatus(appId, "CLARIFICATION REQUIRED", { clarificationMessage: msg });
    AlgoUI.showToast("Clarification recorded.", "warning");
    openApplicationDetailsModal(appId);
  } catch (e) {
    AlgoUI.showToast("Failed to record clarification: " + e.message, "danger");
  }
}

function triggerInspectionDialog(appId) {
  const defaultDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  const contentHtml = `
    <div style="display:flex; flex-direction:column; gap:1rem;">
      <p style="font-size:0.88rem; color:var(--slate-700);">
        Enter the date scheduled for physical on-site premises inspection by the department:
      </p>
      <div class="form-group">
        <label class="form-label" for="modal-inspection-date">Scheduled Inspection Date <span class="required">*</span></label>
        <input type="date" id="modal-inspection-date" class="form-control" value="${defaultDate}" required />
      </div>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary btn-sm" onclick="openApplicationDetailsModal('${appId}')">Cancel</button>
    <button class="btn btn-primary btn-sm" onclick="confirmInspectionSchedule('${appId}')">Record Scheduled Inspection →</button>
  `;

  AlgoUI.openModal("Record Scheduled Inspection", contentHtml, footerHtml);
}

async function confirmInspectionSchedule(appId) {
  const dateStr = (document.getElementById("modal-inspection-date")?.value || "").trim();
  if (!dateStr) {
    AlgoUI.showToast("Please select a valid date.", "warning");
    return;
  }

  try {
    await ApiService.updateApplicationStatus(appId, "INSPECTION REQUIRED", { inspectionDate: dateStr });
    AlgoUI.showToast("Physical inspection scheduled.", "warning");
    openApplicationDetailsModal(appId);
  } catch (e) {
    AlgoUI.showToast("Failed to schedule inspection: " + e.message, "danger");
  }
}

async function initApplicationsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get("id");

  document.querySelectorAll(".app-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".app-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentAppFilter = btn.getAttribute("data-status") || "ALL";
      renderApplicationsTable();
    });
  });

  await renderApplicationsTable();

  if (targetId) {
    openApplicationDetailsModal(targetId);
  }
}

// ==========================================
// PAGE: DOCUMENTS (documents.html)
// ==========================================
async function renderDocumentsGrid() {
  const user = await ApiService.getCurrentUser();
  if (!user) {
    AlgoUI.openAuthModal("login");
    return;
  }

  const docs = await ApiService.getDocuments();
  const container = document.getElementById("documents-list-container");
  const countEl = document.getElementById("documents-count-display");

  if (countEl) countEl.textContent = `${docs.length} statutory documents`;

  if (container) {
    if (docs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No documents uploaded.</div>
          <div class="empty-state-desc">Upload business licenses, drawings, or inspection reports to attach them to your statutory applications.</div>
          <div style="margin-top: 1rem;">
            <button class="btn btn-primary" onclick="openUploadDocumentModal()">+ Upload First Document</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Category</th>
              <th>File Name</th>
              <th>Size</th>
              <th>Upload Date</th>
              <th>Status</th>
              <th style="text-align: right; min-width: 180px;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${docs.map(doc => `
              <tr>
                <td><strong>${doc.name}</strong></td>
                <td><span class="badge badge-neutral">${doc.category}</span></td>
                <td><code>${doc.fileName}</code></td>
                <td style="font-size:0.82rem; color:var(--slate-600);">${doc.fileSize || "—"}</td>
                <td style="font-size:0.82rem; color:var(--slate-600);">${doc.uploadedDate}</td>
                <td>${AlgoUI.renderStatusBadge(doc.status)}</td>
                <td style="text-align: right;">
                  <div style="display:inline-flex; gap:0.4rem; justify-content:flex-end;">
                    ${doc.hasFile && doc.fileName ? `
                      <a href="${UPLOADS_BASE}/${encodeURIComponent(doc.fileName)}" target="_blank" class="btn btn-secondary btn-sm" title="View Document">
                        View
                      </a>
                      <a href="${UPLOADS_BASE}/${encodeURIComponent(doc.fileName)}" download="${doc.fileName}" class="btn btn-secondary btn-sm" title="Download Document">
                        ⬇️
                      </a>
                    ` : ''}
                    <button class="btn btn-danger btn-sm" onclick="handleDeleteDoc('${doc.id}')">Delete</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

function openUploadDocumentModal() {
  const contentHtml = `
    <form id="doc-upload-form" onsubmit="handleDocUploadSubmit(event)">
      <div class="form-group">
        <label class="form-label" for="upload-doc-name">Document Title / Name <span class="required">*</span></label>
        <input type="text" id="upload-doc-name" class="form-control" placeholder="e.g. Factory Layout Plan Drawing" required />
      </div>
      <div class="form-group" style="margin-top:1rem;">
        <label class="form-label" for="upload-doc-cat">Category <span class="required">*</span></label>
        <select id="upload-doc-cat" class="form-select" required>
          <option value="Infrastructure Blueprints">Infrastructure Blueprints</option>
          <option value="Environmental Test Reports">Environmental Test Reports</option>
          <option value="Safety Audits">Safety Audits</option>
          <option value="Corporate / Legal">Corporate / Legal Identification</option>
          <option value="Labour Registers">Labour & Wage Registers</option>
          <option value="Statutory Filing">Statutory Filing</option>
          <option value="General">General Compliance</option>
        </select>
      </div>
      <div class="form-group" style="margin-top:1rem;">
        <label class="form-label" for="upload-doc-file">Select File (PDF / JPG / PNG / DOCX)</label>
        <input type="file" id="upload-doc-file" class="form-control" />
      </div>
      <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.5rem;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="AlgoUI.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">Upload Document →</button>
      </div>
    </form>
  `;

  AlgoUI.openModal("Upload Statutory Document", contentHtml, "");
}

async function handleDocUploadSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("upload-doc-name").value.trim();
  const cat = document.getElementById("upload-doc-cat").value;
  const fileInput = document.getElementById("upload-doc-file");

  if (!name) return;

  const formData = new FormData();
  formData.append("docName", name);
  formData.append("category", cat);
  if (fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
  }

  try {
    AlgoUI.showToast("Uploading document to server...", "info");
    await ApiService.uploadDocument(formData);
    AlgoUI.showToast("Document uploaded successfully.", "success");
    AlgoUI.closeModal();
    renderDocumentsGrid();
  } catch (err) {
    AlgoUI.showToast("Upload failed: " + err.message, "danger");
  }
}

async function handleDeleteDoc(docId) {
  if (confirm("Are you sure you want to delete this document from MySQL database and server disk?")) {
    try {
      await ApiService.deleteDocument(docId);
      AlgoUI.showToast("Document deleted.", "info");
      renderDocumentsGrid();
    } catch (err) {
      AlgoUI.showToast("Failed to delete document: " + err.message, "danger");
    }
  }
}

async function initDocumentsPage() {
  const uploadBtn = document.getElementById("open-upload-doc-btn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", openUploadDocumentModal);
  }
  renderDocumentsGrid();
}

// ==========================================
// PAGE: RENEWALS (renewals.html)
// ==========================================
async function renderRenewalsTable() {
  const user = await ApiService.getCurrentUser();
  if (!user) {
    AlgoUI.openAuthModal("login");
    return;
  }

  const renewals = await ApiService.getRenewals();
  const container = document.getElementById("renewals-table-container");
  const countEl = document.getElementById("renewals-count-display");

  if (countEl) countEl.textContent = `${renewals.length} active licenses`;

  if (container) {
    if (renewals.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No active licences or upcoming renewals.</div>
          <div class="empty-state-desc">When your statutory applications are approved, active licenses will automatically be tracked here for renewal management.</div>
          <div style="margin-top: 1rem;">
            <a href="applications.html" class="btn btn-primary">View Applications →</a>
          </div>
        </div>
      `;
      return;
    }

    const now = new Date();

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>License / Approval</th>
              <th>Department</th>
              <th>License Number</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Days Remaining</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${renewals.map(r => {
              const exp = new Date(r.expiryDate);
              const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
              const isDueSoon = diffDays <= 60 && diffDays > 0;
              const isOverdue = diffDays <= 0;

              return `
                <tr>
                  <td><strong>${r.title}</strong></td>
                  <td style="font-size:0.84rem; color:var(--slate-700);">${r.department}</td>
                  <td><code>${r.licenseNumber}</code></td>
                  <td style="font-size:0.84rem; color:var(--slate-600);">${r.issueDate || "—"}</td>
                  <td style="font-size:0.84rem; color:var(--slate-800); font-weight:600;">${r.expiryDate}</td>
                  <td>
                    ${isOverdue ? `
                      <span style="color:var(--danger-primary); font-weight:700;">Overdue by ${Math.abs(diffDays)}d</span>
                    ` : isDueSoon ? `
                      <span style="color:var(--warning-dark); font-weight:700;">${diffDays} days</span>
                    ` : `
                      <span style="color:var(--slate-700);">${diffDays} days</span>
                    `}
                  </td>
                  <td>
                    ${isOverdue ? AlgoUI.renderStatusBadge("OVERDUE") : isDueSoon ? AlgoUI.renderStatusBadge("DUE_SOON") : AlgoUI.renderStatusBadge("ACTIVE")}
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="handleRenewLicenseAction('${r.id}')">
                      Renew License
                    </button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

async function handleRenewLicenseAction(renewalId) {
  const renewals = await ApiService.getRenewals();
  const target = renewals.find(r => r.id === renewalId);
  if (!target) return;

  if (confirm(`Submit renewal application for ${target.title} (${target.licenseNumber}) for another ${target.validityYears} year(s)?`)) {
    try {
      await ApiService.renewLicense(renewalId);
      AlgoUI.showToast("License successfully renewed in MySQL database!", "success");
      renderRenewalsTable();
    } catch (err) {
      AlgoUI.showToast("Renewal failed: " + err.message, "danger");
    }
  }
}

async function initRenewalsPage() {
  renderRenewalsTable();
}

// ----------------------------------------------------------------------------
// 5. DOM Initializer & Routing
// ----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  AlgoUI.setupNavigation();

  const path = window.location.pathname.toLowerCase();

  if (path.includes("profile") || document.getElementById("business-profile-form")) {
    initProfilePage();
  } else if (path.includes("dashboard") || document.getElementById("dash-header-title")) {
    initDashboardPage();
  } else if (path.includes("approvals") || document.getElementById("requirements-table-container")) {
    initApprovalsPage();
  } else if (path.includes("applications") || document.getElementById("applications-table-container")) {
    initApplicationsPage();
  } else if (path.includes("documents") || document.getElementById("documents-list-container")) {
    initDocumentsPage();
  } else if (path.includes("renewals") || document.getElementById("renewals-table-container")) {
    initRenewalsPage();
  }
});
