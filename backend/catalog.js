/**
 * ============================================================================
 * AnumatiSetu — Authoritative Statutory Catalog & Dynamic Regulatory Engine
 * ============================================================================
 */

const STATE_DEPARTMENT_REGISTRY = {
  "Karnataka": {
    spcb: "Karnataka State Pollution Control Board (KSPCB)",
    industrialBoard: "Karnataka Industrial Areas Development Board (KIADB)",
    discom: "Bangalore Electricity Supply Company (BESCOM) / HESCOM",
    municipal: "Bruhat Bengaluru Mahanagara Palike (BBMP) / Local Urban Body",
    fire: "Karnataka State Fire & Emergency Services",
    labour: "Department of Labour, Government of Karnataka",
    dish: "Directorate of Factories, Boilers, Industrial Safety & Health (DISH Karnataka)",
    boilers: "Inspectorate of Steam Boilers, Karnataka",
    ceig: "Chief Electrical Inspectorate to Government (CEIG Karnataka)",
    drugs: "Drugs Control Department, Karnataka",
    textile: "Department of Handlooms & Textiles, Karnataka"
  },
  "Maharashtra": {
    spcb: "Maharashtra Pollution Control Board (MPCB)",
    industrialBoard: "Maharashtra Industrial Development Corporation (MIDC)",
    discom: "Maharashtra State Electricity Distribution Co. (MSEDCL / Mahavitaran)",
    municipal: "Brihanmumbai Municipal Corporation (BMC) / Municipal Corporation",
    fire: "Directorate of Maharashtra Fire Services",
    labour: "Labour Department, Government of Maharashtra",
    dish: "Directorate of Industrial Safety & Health (DISH Maharashtra)",
    boilers: "Directorate of Steam Boilers, Maharashtra",
    ceig: "Chief Electrical Inspectorate, Maharashtra",
    drugs: "Food and Drug Administration (FDA Maharashtra)",
    textile: "Directorate of Textiles, Maharashtra"
  },
  "Gujarat": {
    spcb: "Gujarat Pollution Control Board (GPCB)",
    industrialBoard: "Gujarat Industrial Development Corporation (GIDC)",
    discom: "Gujarat Urja Vikas Nigam Ltd (GUVNL / DGVCL / MGVCL)",
    municipal: "Ahmedabad / Surat Municipal Corporation / Urban Authority",
    fire: "Gujarat State Fire Prevention & Life Safety Authority",
    labour: "Labour & Employment Department, Gujarat",
    dish: "Directorate of Industrial Safety & Health (DISH Gujarat)",
    boilers: "Office of Chief Inspector of Boilers, Gujarat",
    ceig: "Office of Chief Electrical Inspector, Gujarat",
    drugs: "Food and Drugs Control Administration (FDCA Gujarat)",
    textile: "Department of Industries & Textiles, Gujarat"
  },
  "Tamil Nadu": {
    spcb: "Tamil Nadu Pollution Control Board (TNPCB)",
    industrialBoard: "State Industries Promotion Corp of Tamil Nadu (SIPCOT) / TIDCO",
    discom: "Tamil Nadu Generation and Distribution Corp (TANGEDCO)",
    municipal: "Greater Chennai Corporation (GCC) / Local Municipality",
    fire: "Tamil Nadu Fire and Rescue Services (TNFRS)",
    labour: "Department of Labour & Employment, Tamil Nadu",
    dish: "Directorate of Industrial Safety & Health (DISH Tamil Nadu)",
    boilers: "Directorate of Boilers, Tamil Nadu",
    ceig: "Chief Electrical Inspectorate, Tamil Nadu",
    drugs: "Drugs Control Administration, Tamil Nadu",
    textile: "Department of Handlooms, Handicrafts, Textiles, Tamil Nadu"
  },
  "Telangana": {
    spcb: "Telangana State Pollution Control Board (TGPCB)",
    industrialBoard: "Telangana Industrial Infrastructure Corporation (TGIIC)",
    discom: "TSSPDCL / TSNPDCL Power Distribution Company",
    municipal: "Greater Hyderabad Municipal Corporation (GHMC) / Local ULB",
    fire: "Telangana State Disaster Response & Fire Services",
    labour: "Department of Labour, Telangana",
    dish: "Department of Factories, Government of Telangana",
    boilers: "Directorate of Boilers, Telangana",
    ceig: "Chief Electrical Inspectorate, Telangana",
    drugs: "Drugs Control Administration, Telangana",
    textile: "Department of Handlooms & Textiles, Telangana"
  },
  "Andhra Pradesh": {
    spcb: "Andhra Pradesh Pollution Control Board (APPCB)",
    industrialBoard: "Andhra Pradesh Industrial Infrastructure Corporation (APIIC)",
    discom: "APSPDCL / APEPDCL Electricity Distribution",
    municipal: "Municipal Administration & Urban Development Department, AP",
    fire: "AP State Disaster Response & Fire Services Department",
    labour: "Labour Department, Government of Andhra Pradesh",
    dish: "Directorate of Factories, Andhra Pradesh",
    boilers: "Directorate of Boilers, Andhra Pradesh",
    ceig: "Chief Electrical Inspectorate, Andhra Pradesh",
    drugs: "Drugs Control Administration, Andhra Pradesh",
    textile: "Directorate of Handlooms & Textiles, AP"
  },
  "Uttar Pradesh": {
    spcb: "Uttar Pradesh Pollution Control Board (UPPCB)",
    industrialBoard: "UP State Industrial Development Authority (UPSIDA) / NOIDA",
    discom: "UP Power Corporation Limited (UPPCL / PVVNL)",
    municipal: "Nagar Nigam / Directorate of Local Bodies UP",
    fire: "Uttar Pradesh Fire Service Department",
    labour: "Labour Commissionerate, Uttar Pradesh",
    dish: "Directorate of Factories, Uttar Pradesh",
    boilers: "Directorate of Boilers, Uttar Pradesh",
    ceig: "Directorate of Electrical Safety, UP",
    drugs: "Food Safety and Drug Administration, UP",
    textile: "Directorate of Handloom and Textiles, UP"
  },
  "Delhi NCR": {
    spcb: "Delhi Pollution Control Committee (DPCC)",
    industrialBoard: "Delhi State Industrial & Infrastructure Dev. Corp (DSIIDC)",
    discom: "BSES Yamuna / Rajdhani Power / Tata Power-DDL",
    municipal: "Municipal Corporation of Delhi (MCD)",
    fire: "Delhi Fire Service (DFS)",
    labour: "Department of Labour, GNCTD",
    dish: "Directorate of Industrial Safety & Health (DISH Delhi)",
    boilers: "Office of Chief Inspector of Boilers, Delhi",
    ceig: "Electrical Inspectorate, GNCTD",
    drugs: "Drugs Control Department, GNCTD",
    textile: "Department of Industries, Delhi"
  },
  "Rajasthan": {
    spcb: "Rajasthan State Pollution Control Board (RSPCB)",
    industrialBoard: "Rajasthan State Industrial Development & Investment Corp (RIICO)",
    discom: "Jaipur / Jodhpur / Ajmer Vidyut Vitran Nigam Ltd (JVVNL)",
    municipal: "Municipal Corporation / Local Self Government Dept, Rajasthan",
    fire: "Rajasthan Fire Services",
    labour: "Department of Labour, Rajasthan",
    dish: "Department of Factories & Boilers, Rajasthan",
    boilers: "Office of Chief Inspector of Boilers, Rajasthan",
    ceig: "Electrical Inspectorate, Rajasthan",
    drugs: "Drug Control Organization, Rajasthan",
    textile: "Department of Industries, Rajasthan"
  },
  "Haryana": {
    spcb: "Haryana State Pollution Control Board (HSPCB)",
    industrialBoard: "Haryana State Industrial & Infrastructure Dev. Corp (HSIIDC)",
    discom: "DHBVN / UHBVN Electricity Distribution",
    municipal: "Municipal Corporation (MCG / MCF) / Directorate of Urban Local Bodies",
    fire: "Haryana Fire and Emergency Services",
    labour: "Labour Department, Haryana",
    dish: "Directorate of Industrial Safety & Health (DISH Haryana)",
    boilers: "Boiler Inspection Department, Haryana",
    ceig: "Chief Electrical Inspectorate, Haryana",
    drugs: "Food and Drugs Administration, Haryana",
    textile: "Department of Industries & Commerce, Haryana"
  },
  "West Bengal": {
    spcb: "West Bengal Pollution Control Board (WBPCB)",
    industrialBoard: "West Bengal Industrial Development Corporation (WBIDC)",
    discom: "WBSEDCL / CESC Limited",
    municipal: "Kolkata Municipal Corporation (KMC) / Local Municipality",
    fire: "West Bengal Fire & Emergency Services",
    labour: "Labour Department, Government of West Bengal",
    dish: "Directorate of Factories, West Bengal",
    boilers: "Directorate of Boilers, West Bengal",
    ceig: "Directorate of Electricity, West Bengal",
    drugs: "Directorate of Drugs Control, West Bengal",
    textile: "Directorate of Textiles, West Bengal"
  },
  "Goa": {
    spcb: "Goa State Pollution Control Board (GSPCB)",
    industrialBoard: "Goa Industrial Development Corporation (Goa-IDC)",
    discom: "Electricity Department, Government of Goa",
    municipal: "Corporation of the City of Panaji (CCP) / Village Panchayat",
    fire: "Directorate of Fire and Emergency Services, Goa",
    labour: "Department of Labour & Employment, Goa",
    dish: "Inspectorate of Factories and Boilers, Goa",
    boilers: "Inspectorate of Factories and Boilers, Goa",
    ceig: "Chief Electrical Inspectorate, Goa",
    drugs: "Directorate of Food and Drugs Administration, Goa",
    textile: "Department of Handicrafts, Textile and Coir, Goa"
  },
  "Other": {
    spcb: "State Pollution Control Board (SPCB)",
    industrialBoard: "State Industrial Development Corporation (SIDC)",
    discom: "State Power Distribution Corporation (DISCOM)",
    municipal: "Municipal Corporation / Urban Local Body",
    fire: "State Fire and Emergency Services Department",
    labour: "Department of Labour",
    dish: "Directorate of Industrial Safety & Health (DISH)",
    boilers: "Directorate of Boilers",
    ceig: "Chief Electrical Inspectorate",
    drugs: "State Drugs Control Administration",
    textile: "Department of Textiles"
  }
};

const STATUTORY_CATALOG = [
  // =========================================================================
  // 1. GENERAL STATUTORY CLEARANCES (Applicable to Commercial & Industrial)
  // =========================================================================
  {
    code: "REQ_TRADE_LICENSE",
    title: "Municipal Trade License",
    deptKey: "municipal",
    defaultDept: "Municipal Corporation / Local Urban Body",
    category: "General Business",
    description: "Mandatory operating permit issued by local municipal authorities verifying commercial zoning compliance.",
    mandatoryDocuments: ["Property Tax Receipt or Registered Lease Deed", "Identity & Address Proof of Proprietor/Directors", "Sanctioned Building Layout Plan"],
    inspectionRequired: false,
    validityYears: 1,
    feeEstimate: "₹5,000 – ₹10,000",
  },
  {
    code: "REQ_FIRE_NOC",
    title: "Fire Safety Certificate (Fire NOC)",
    deptKey: "fire",
    defaultDept: "State Fire and Emergency Services Department",
    category: "Safety & Hazard",
    description: "Statutory clearance certifying premises compliance with the National Building Code (NBC) fire protection measures.",
    mandatoryDocuments: ["Architectural Fire Evacuation Plan", "Hydrant & Sprinkler Flow Test Certificates", "Fire Extinguisher Installation Audit"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹10,000 – ₹25,000",
    condition: (p) => p.industryType !== "Services" || parseInt(p.employeesCount || 0) >= 20 || ["Medium Enterprise", "Large Enterprise"].includes(p.businessCategory),
  },
  {
    code: "REQ_BUILDING_SANCTION",
    title: "Industrial / Commercial Building Plan Sanction",
    deptKey: "industrialBoard",
    defaultDept: "Industrial Area Development Board / Town Planning Authority",
    category: "Infrastructure",
    description: "Formal sanction of civil building structures ensuring structural stability and zoning clearances.",
    mandatoryDocuments: ["Structural Stability Certificate by Chartered Engineer", "Site Elevation & Cross-Section Blueprints", "Land Allotment Order / Title Deed"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹25,000 – ₹75,000",
    condition: (p) => ["Manufacturing", "Chemicals", "Textile", "Food Processing", "Electronics"].includes(p.industryType) || p.businessStage === "New Setup",
  },

  // =========================================================================
  // 2. FOOD PROCESSING & AGRO SECTOR
  // =========================================================================
  {
    code: "REQ_FSSAI_LICENSE",
    title: "FSSAI Food Business Manufacturing License",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    category: "Food Safety",
    description: "Mandatory statutory food business operating license under the Food Safety and Standards Act, 2006.",
    mandatoryDocuments: ["Food Safety Management System (FSMS) Plan", "Water Potability Lab Test Report (IS:10500)", "Equipment Layout & Capacity Breakdown", "Recall Management Protocol"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹7,500 – ₹15,000",
    condition: (p) => p.industryType === "Food Processing",
  },
  {
    code: "REQ_AGMARK_GRADING",
    title: "AGMARK Quality Grading & Certification",
    department: "Directorate of Marketing & Inspection (Ministry of Agriculture)",
    category: "Food Safety",
    description: "Statutory agricultural produce grading certification under Agricultural Produce (Grading and Marking) Act.",
    mandatoryDocuments: ["Chemist Approval Certificate", "Packaging Material Food-Grade Test Report", "Standard Operating Procedure (SOP) for Batch Testing"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹10,000 – ₹20,000",
    condition: (p) => p.industryType === "Food Processing",
  },
  {
    code: "REQ_COLD_STORAGE_NOC",
    title: "Cold Chain Storage & Temperature Telemetry NOC",
    deptKey: "municipal",
    defaultDept: "State Agriculture & Horticulture Department",
    category: "Food Safety",
    description: "Statutory temperature compliance certification for perishable food ingredient cold storage facilities.",
    mandatoryDocuments: ["Refrigeration Plant Engineering Schematics", "Continuous Temperature Data Logging Report", "Backup Power Generator Certificate"],
    inspectionRequired: true,
    validityYears: 2,
    feeEstimate: "₹12,000 – ₹25,000",
    condition: (p) => p.industryType === "Food Processing" && ["Small Enterprise", "Medium Enterprise", "Large Enterprise"].includes(p.businessCategory),
  },

  // =========================================================================
  // 3. CHEMICALS & HAZARDOUS MATERIALS SECTOR
  // =========================================================================
  {
    code: "REQ_PESO_LICENSE",
    title: "PESO Petroleum & Hazardous Chemical Storage License",
    department: "Petroleum & Explosives Safety Organisation (PESO)",
    category: "Safety & Hazard",
    description: "Statutory approval under Petroleum Rules 2002 & Static and Mobile Pressure Vessels (SMPV) Rules.",
    mandatoryDocuments: ["Storage Tank Fabrication & Hydro-test Drawings", "Flameproof Electrical Equipment Test Certificates", "On-site Emergency Disaster Management Plan (DMP)"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹25,000 – ₹50,000",
    condition: (p) => p.industryType === "Chemicals",
  },
  {
    code: "REQ_HAZMAT_AUTHORIZATION",
    title: "SPCB Hazardous & Other Waste Management Authorization",
    deptKey: "spcb",
    defaultDept: "State Pollution Control Board (SPCB)",
    category: "Environment",
    description: "Mandatory authorization under Hazardous and Other Wastes (Management & Transboundary Movement) Rules, 2016.",
    mandatoryDocuments: ["Common TSDF (Treatment Storage Disposal Facility) Membership", "Hazardous Waste Storage Shed Blueprint", "Manifest Record Keeping Protocol (Form 10)"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹15,000 – ₹35,000",
    condition: (p) => p.industryType === "Chemicals" || p.industryType === "Textile",
  },
  {
    code: "REQ_PROCESS_SAFETY_41",
    title: "Factories Act Section 41 Hazardous Process Safety Clearance",
    deptKey: "dish",
    defaultDept: "Directorate of Industrial Safety & Health (DISH)",
    category: "Safety & Hazard",
    description: "Statutory appraisal by the State Site Appraisal Committee for establishments involving hazardous chemical processes.",
    mandatoryDocuments: ["Quantitative Risk Assessment (QRA) Report", "HAZOP Process Safety Study", "Occupational Health Surveillance Protocol"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹20,000 – ₹45,000",
    condition: (p) => p.industryType === "Chemicals",
  },

  // =========================================================================
  // 4. TEXTILE & APPAREL SECTOR
  // =========================================================================
  {
    code: "REQ_ZLD_COMPLIANCE",
    title: "SPCB Zero Liquid Discharge (ZLD) Effluent System Certificate",
    deptKey: "spcb",
    defaultDept: "State Pollution Control Board (SPCB)",
    category: "Environment",
    description: "Mandatory ZLD certification certifying zero untreated liquid effluent discharge from textile wet processing units.",
    mandatoryDocuments: ["Multi-Effect Evaporator (MEE) & RO Flowsheet", "Continuous Online Effluent Monitoring (OCEMS) Telemetry", "Salt Recovery & Hazardous Sludge Manifest"],
    inspectionRequired: true,
    validityYears: 2,
    feeEstimate: "₹30,000 – ₹70,000",
    condition: (p) => p.industryType === "Textile",
  },
  {
    code: "REQ_TEXTILE_COMMISSIONER",
    title: "Textile Commissioner Industrial Registration",
    department: "Office of the Textile Commissioner (Ministry of Textiles)",
    category: "General Business",
    description: "Statutory industrial registration for powerlooms, spinning mills, and textile processing units.",
    mandatoryDocuments: ["Installed Spindle/Loom Machinery Specification", "Udyam MSME Registration Certificate", "Factory Building Plan Sanction"],
    inspectionRequired: false,
    validityYears: 10,
    feeEstimate: "Nil (Statutory Free Filing)",
    condition: (p) => p.industryType === "Textile",
  },

  // =========================================================================
  // 5. ELECTRONICS & HARDWARE / IT SECTOR
  // =========================================================================
  {
    code: "REQ_EPR_EWASTE",
    title: "CPCB Extended Producer Responsibility (EPR) E-Waste Authorization",
    department: "Central Pollution Control Board (CPCB)",
    category: "Environment",
    description: "Mandatory EPR authorization under E-Waste (Management) Rules, 2022 for producers of electronic hardware.",
    mandatoryDocuments: ["EPR Target Plan & Collection Center Agreements", "Authorized PRO / Recycler Agreement", "RoHS Compliance Declaration Form"],
    inspectionRequired: false,
    validityYears: 5,
    feeEstimate: "₹10,000 – ₹25,000",
    condition: (p) => p.industryType === "Electronics",
  },
  {
    code: "REQ_BIS_CRS",
    title: "BIS Compulsory Registration Scheme (CRS) Electronics Safety",
    department: "Bureau of Indian Standards (BIS)",
    category: "Safety & Hazard",
    description: "Statutory product conformity certification for IT and electronic equipment under Electronics & IT Goods Order.",
    mandatoryDocuments: ["NABL Accredited Lab Safety Test Report (IS 13252)", "Factory Quality Control Audit Report", "Brand Authorization Trademark Letter"],
    inspectionRequired: true,
    validityYears: 2,
    feeEstimate: "₹35,000 – ₹80,000",
    condition: (p) => p.industryType === "Electronics",
  },
  {
    code: "REQ_STPI_CUSTOMS",
    title: "STPI / EOU Electronic Hardware Technology Park License",
    department: "Software Technology Parks of India (STPI) / Customs",
    category: "General Business",
    description: "Operating license for duty-free capital equipment import under EHTP / STP export schemes.",
    mandatoryDocuments: ["Project Export-Import Feasibility Report", "Private Customs Bonded Warehouse Layout", "Board of Directors Resolution"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹25,000 – ₹50,000",
    condition: (p) => p.industryType === "Electronics" && ["Medium Enterprise", "Large Enterprise"].includes(p.businessCategory),
  },

  // =========================================================================
  // 6. COMMERCIAL SERVICES & WAREHOUSING SECTOR
  // =========================================================================
  {
    code: "REQ_SHOPS_ESTABLISHMENT",
    title: "Shops & Commercial Establishments Act Registration",
    deptKey: "labour",
    defaultDept: "Department of Labour",
    category: "Labour Welfare",
    description: "Mandatory statutory registration regulating working hours, commercial leaves, and employment conditions.",
    mandatoryDocuments: ["Lease Deed / Ownership Proof of Premises", "PAN & Incorporation Certificate", "Employee Wage Register & Shift Schedule"],
    inspectionRequired: false,
    validityYears: 5,
    feeEstimate: "₹2,500 – ₹6,000",
    condition: (p) => p.industryType === "Services" || p.industryType === "Other",
  },
  {
    code: "REQ_LEGAL_METROLOGY",
    title: "Legal Metrology Packaged Commodities & Weights Verification",
    department: "Department of Consumer Affairs (Legal Metrology Division)",
    category: "General Business",
    description: "Statutory registration for pre-packaged commodities manufacturing, warehousing, and commercial weighing instruments.",
    mandatoryDocuments: ["Sample Packaging Label Layout (MRP, Batch, Net Qty)", "Weighing Scale Calibration Verification Certificate", "Commercial Address Proof"],
    inspectionRequired: true,
    validityYears: 2,
    feeEstimate: "₹5,000 – ₹12,000",
    condition: (p) => p.industryType === "Services" || p.industryType === "Food Processing",
  },
  {
    code: "REQ_WDRA_WAREHOUSING",
    title: "WDRA Commercial Warehouse Registration",
    department: "Warehousing Development and Regulatory Authority (WDRA)",
    category: "Infrastructure",
    description: "Statutory accreditation certifying structural safety, pest control, and security of commercial warehousing yards.",
    mandatoryDocuments: ["Warehouse Insurance Policy for Fire & Burglary", "Security & Weighbridge Calibration Audit", "Pest Management Contract"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹15,000 – ₹30,000",
    condition: (p) => p.industryType === "Services" && ["Medium Enterprise", "Large Enterprise"].includes(p.businessCategory),
  },

  // =========================================================================
  // 7. MANUFACTURING / GENERAL ENGINEERING CLEARANCES
  // =========================================================================
  {
    code: "REQ_FACTORIES_LICENSE",
    title: "Factory Registration & Operating License (Form 2)",
    deptKey: "dish",
    defaultDept: "Directorate of Industrial Safety & Health (DISH)",
    category: "Labour & Safety",
    description: "Mandatory factory operating license under the Factories Act, 1948 for manufacturing establishments.",
    mandatoryDocuments: ["Approved Factory Plan Drawing", "Machinery Horsepower Schedule", "Ventilation & Lighting Certificate", "Safety Officer Appointment Proof"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹15,000 – ₹40,000",
    condition: (p) => ["Manufacturing", "Chemicals", "Textile", "Food Processing", "Electronics"].includes(p.industryType) || parseInt(p.employeesCount || 0) >= 10,
  },
  {
    code: "REQ_SPCB_CTE_CTO",
    title: "Pollution Consent to Operate (CTO - Air & Water Acts)",
    deptKey: "spcb",
    defaultDept: "State Pollution Control Board (SPCB)",
    category: "Environment",
    description: "Statutory environmental consent under Section 25/26 of Water Act 1974 and Section 21 of Air Act 1981.",
    mandatoryDocuments: ["Effluent Treatment Plant (ETP) / STP Schematics", "Air Pollution Control Equipment Details", "Raw Material Mass Balance Flowsheet", "Ambient Air & Effluent Lab Test Reports"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹20,000 – ₹60,000",
    condition: (p) => ["Manufacturing", "Chemicals", "Textile", "Food Processing", "Electronics"].includes(p.industryType),
  },
  {
    code: "REQ_BOILER_CERT",
    title: "Industrial Steam Boiler Operation Certificate",
    deptKey: "boilers",
    defaultDept: "Directorate of Steam Boilers",
    category: "Safety & Hazard",
    description: "Statutory annual certificate under Indian Boiler Regulations (IBR 1950) certifying safety of high-pressure vessels.",
    mandatoryDocuments: ["Hydraulic Pressure Test Inspection Report", "Certified Boiler Attendant License", "Steam Piping Isometric Drawings"],
    inspectionRequired: true,
    validityYears: 1,
    feeEstimate: "₹12,000 – ₹30,000",
    condition: (p) => ["Manufacturing", "Chemicals", "Textile"].includes(p.industryType) && ["Medium Enterprise", "Large Enterprise"].includes(p.businessCategory),
  },
  {
    code: "REQ_CEIG_ELECTRICAL",
    title: "Chief Electrical Inspectorate (CEIG) HT Power Substation Clearance",
    deptKey: "ceig",
    defaultDept: "Chief Electrical Inspectorate to Government",
    category: "Infrastructure",
    description: "Statutory safety clearance under Central Electricity Authority Regulations for High Tension (HT) industrial power installations.",
    mandatoryDocuments: ["HT Transformer & Switchgear Test Reports", "Substation Earthing Resistance Test Results", "Single Line Electrical Diagram (SLD)"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹15,000 – ₹35,000",
    condition: (p) => ["Manufacturing", "Chemicals", "Textile", "Electronics"].includes(p.industryType) && ["Medium Enterprise", "Large Enterprise"].includes(p.businessCategory),
  },

  // =========================================================================
  // 8. LABOUR & SOCIAL SECURITY MANDATES (Threshold-Triggered)
  // =========================================================================
  {
    code: "REQ_EPFO_REG",
    title: "EPFO Employer Registration & Compliance Code",
    department: "Employees' Provident Fund Organisation (Ministry of Labour)",
    category: "Labour Welfare",
    description: "Mandatory provident fund registration under the Employees' Provident Funds & Miscellaneous Provisions Act, 1952.",
    mandatoryDocuments: ["Certificate of Incorporation / Partnership Deed", "PAN & GST Registration Proof", "List of First 20 Covered Employees", "Bank Account Cancelled Cheque"],
    inspectionRequired: false,
    validityYears: 10,
    feeEstimate: "Nil (Statutory Free Filing)",
    condition: (p) => parseInt(p.employeesCount || 0) >= 20,
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
    feeEstimate: "Nil (Statutory Free Filing)",
    condition: (p) => parseInt(p.employeesCount || 0) >= 10,
  },
];

/**
 * Computes applicable requirements for a given business profile.
 * @param {Object} profile - Business profile object
 * @param {Array}  applications - Existing applications array (to attach live status)
 * @returns {Array} Matched statutory clearances tailored for this exact industry & location
 */
function computeRequirements(profile, applications = []) {
  if (!profile) return [];
  const stateMapping = (STATE_DEPARTMENT_REGISTRY && STATE_DEPARTMENT_REGISTRY[profile.state]) 
    ? STATE_DEPARTMENT_REGISTRY[profile.state] 
    : (STATE_DEPARTMENT_REGISTRY?.["Other"] || {});

  return STATUTORY_CATALOG.filter((item) => {
    if (!item.condition) return true;
    return item.condition(profile);
  }).map((item) => {
    const existingApp = applications.find((a) => a.requirement_code === item.code);
    const resolvedDept = item.deptKey ? (stateMapping[item.deptKey] || item.defaultDept || item.department) : item.department;

    return {
      code: item.code,
      title: item.title,
      department: resolvedDept || item.defaultDept || item.department || "Statutory Authority",
      category: item.category,
      description: item.description,
      mandatoryDocuments: item.mandatoryDocuments,
      inspectionRequired: item.inspectionRequired,
      validityYears: item.validityYears,
      feeEstimate: item.feeEstimate,
      status: existingApp ? existingApp.status : "NOT_APPLIED",
    };
  });
}

module.exports = { STATE_DEPARTMENT_REGISTRY, STATUTORY_CATALOG, computeRequirements };
