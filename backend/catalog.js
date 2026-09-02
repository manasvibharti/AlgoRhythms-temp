/**
 * ============================================================================
 * AnumatiSetu — Statutory Catalog & Dynamic State Authority Engine
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
    boilers: "Inspectorate of Steam Boilers, Karnataka"
  },
  "Maharashtra": {
    spcb: "Maharashtra Pollution Control Board (MPCB)",
    industrialBoard: "Maharashtra Industrial Development Corporation (MIDC)",
    discom: "Maharashtra State Electricity Distribution Co. (MSEDCL / Mahavitaran)",
    municipal: "Brihanmumbai Municipal Corporation (BMC) / Municipal Corporation",
    fire: "Directorate of Maharashtra Fire Services",
    labour: "Labour Department, Government of Maharashtra",
    dish: "Directorate of Industrial Safety & Health (DISH Maharashtra)",
    boilers: "Directorate of Steam Boilers, Maharashtra"
  },
  "Gujarat": {
    spcb: "Gujarat Pollution Control Board (GPCB)",
    industrialBoard: "Gujarat Industrial Development Corporation (GIDC)",
    discom: "Gujarat Urja Vikas Nigam Ltd (GUVNL / DGVCL / MGVCL)",
    municipal: "Ahmedabad / Surat Municipal Corporation / Urban Authority",
    fire: "Gujarat State Fire Prevention & Life Safety Authority",
    labour: "Labour & Employment Department, Gujarat",
    dish: "Directorate of Industrial Safety & Health (DISH Gujarat)",
    boilers: "Office of Chief Inspector of Boilers, Gujarat"
  },
  "Tamil Nadu": {
    spcb: "Tamil Nadu Pollution Control Board (TNPCB)",
    industrialBoard: "State Industries Promotion Corp of Tamil Nadu (SIPCOT) / TIDCO",
    discom: "Tamil Nadu Generation and Distribution Corp (TANGEDCO)",
    municipal: "Greater Chennai Corporation (GCC) / Local Municipality",
    fire: "Tamil Nadu Fire and Rescue Services (TNFRS)",
    labour: "Department of Labour & Employment, Tamil Nadu",
    dish: "Directorate of Industrial Safety & Health (DISH Tamil Nadu)",
    boilers: "Directorate of Boilers, Tamil Nadu"
  },
  "Telangana": {
    spcb: "Telangana State Pollution Control Board (TGPCB)",
    industrialBoard: "Telangana Industrial Infrastructure Corporation (TGIIC)",
    discom: "TSSPDCL / TSNPDCL Power Distribution Company",
    municipal: "Greater Hyderabad Municipal Corporation (GHMC) / Local ULB",
    fire: "Telangana State Disaster Response & Fire Services",
    labour: "Department of Labour, Telangana",
    dish: "Department of Factories, Government of Telangana",
    boilers: "Directorate of Boilers, Telangana"
  },
  "Andhra Pradesh": {
    spcb: "Andhra Pradesh Pollution Control Board (APPCB)",
    industrialBoard: "Andhra Pradesh Industrial Infrastructure Corporation (APIIC)",
    discom: "APSPDCL / APEPDCL Electricity Distribution",
    municipal: "Municipal Administration & Urban Development Department, AP",
    fire: "AP State Disaster Response & Fire Services Department",
    labour: "Labour Department, Government of Andhra Pradesh",
    dish: "Directorate of Factories, Andhra Pradesh",
    boilers: "Directorate of Boilers, Andhra Pradesh"
  },
  "Uttar Pradesh": {
    spcb: "Uttar Pradesh Pollution Control Board (UPPCB)",
    industrialBoard: "UP State Industrial Development Authority (UPSIDA) / NOIDA",
    discom: "UP Power Corporation Limited (UPPCL / PVVNL)",
    municipal: "Nagar Nigam / Directorate of Local Bodies UP",
    fire: "Uttar Pradesh Fire Service Department",
    labour: "Labour Commissionerate, Uttar Pradesh",
    dish: "Directorate of Factories, Uttar Pradesh",
    boilers: "Directorate of Boilers, Uttar Pradesh"
  },
  "Delhi NCR": {
    spcb: "Delhi Pollution Control Committee (DPCC)",
    industrialBoard: "Delhi State Industrial & Infrastructure Dev. Corp (DSIIDC)",
    discom: "BSES Yamuna / Rajdhani Power / Tata Power-DDL",
    municipal: "Municipal Corporation of Delhi (MCD)",
    fire: "Delhi Fire Service (DFS)",
    labour: "Department of Labour, GNCTD",
    dish: "Directorate of Industrial Safety & Health (DISH Delhi)",
    boilers: "Office of Chief Inspector of Boilers, Delhi"
  },
  "Rajasthan": {
    spcb: "Rajasthan State Pollution Control Board (RSPCB)",
    industrialBoard: "Rajasthan State Industrial Development & Investment Corp (RIICO)",
    discom: "Jaipur / Jodhpur / Ajmer Vidyut Vitran Nigam Ltd (JVVNL)",
    municipal: "Municipal Corporation / Local Self Government Dept, Rajasthan",
    fire: "Rajasthan Fire Services",
    labour: "Department of Labour, Rajasthan",
    dish: "Department of Factories & Boilers, Rajasthan",
    boilers: "Office of Chief Inspector of Boilers, Rajasthan"
  },
  "Haryana": {
    spcb: "Haryana State Pollution Control Board (HSPCB)",
    industrialBoard: "Haryana State Industrial & Infrastructure Dev. Corp (HSIIDC)",
    discom: "DHBVN / UHBVN Electricity Distribution",
    municipal: "Municipal Corporation (MCG / MCF) / Directorate of Urban Local Bodies",
    fire: "Haryana Fire and Emergency Services",
    labour: "Labour Department, Haryana",
    dish: "Directorate of Industrial Safety & Health (DISH Haryana)",
    boilers: "Boiler Inspection Department, Haryana"
  },
  "West Bengal": {
    spcb: "West Bengal Pollution Control Board (WBPCB)",
    industrialBoard: "West Bengal Industrial Development Corporation (WBIDC)",
    discom: "WBSEDCL / CESC Limited",
    municipal: "Kolkata Municipal Corporation (KMC) / Local Municipality",
    fire: "West Bengal Fire & Emergency Services",
    labour: "Labour Department, Government of West Bengal",
    dish: "Directorate of Factories, West Bengal",
    boilers: "Directorate of Boilers, West Bengal"
  },
  "Goa": {
    spcb: "Goa State Pollution Control Board (GSPCB)",
    industrialBoard: "Goa Industrial Development Corporation (Goa-IDC)",
    discom: "Electricity Department, Government of Goa",
    municipal: "Corporation of the City of Panaji (CCP) / Village Panchayat",
    fire: "Directorate of Fire and Emergency Services, Goa",
    labour: "Department of Labour & Employment, Goa",
    dish: "Inspectorate of Factories and Boilers, Goa",
    boilers: "Inspectorate of Factories and Boilers, Goa"
  },
  "Other": {
    spcb: "State Pollution Control Board (SPCB)",
    industrialBoard: "State Industrial Development Corporation (SIDC)",
    discom: "State Power Distribution Corporation (DISCOM)",
    municipal: "Municipal Corporation / Urban Local Body",
    fire: "State Fire and Emergency Services Department",
    labour: "Department of Labour",
    dish: "Directorate of Industrial Safety & Health (DISH)",
    boilers: "Directorate of Boilers"
  }
};

const STATUTORY_CATALOG = [
  {
    code: "REQ_TRADE_LICENSE",
    title: "Municipal Trade License",
    deptKey: "municipal",
    defaultDept: "Municipal Corporation / Local Urban Body",
    category: "General Business",
    description: "Mandatory operating permit issued by local municipal authorities verifying commercial zoning compliance.",
    mandatoryDocuments: ["Property Tax Receipt or Lease Deed", "Identity & Address Proof of Proprietor/Directors", "Sanctioned Building Layout"],
    inspectionRequired: false,
    validityYears: 1,
    feeEstimate: "₹5,000 – ₹10,000",
  },
  {
    code: "REQ_FIRE_NOC",
    title: "Fire Safety Certificate (NOC)",
    deptKey: "fire",
    defaultDept: "State Fire and Emergency Services Department",
    category: "Safety & Hazard",
    description: "Statutory clearance certifying premises compliance with the National Building Code (NBC) fire protection measures.",
    mandatoryDocuments: ["Architectural Fire Evacuation Plan", "Hydrant & Sprinkler Test Certificates", "Fire Extinguisher Installation Audit"],
    inspectionRequired: true,
    validityYears: 3,
    feeEstimate: "₹10,000 – ₹25,000",
  },
  {
    code: "REQ_BUILDING_SANCTION",
    title: "Industrial Building Plan Sanction & Occupancy",
    deptKey: "industrialBoard",
    defaultDept: "Industrial Area Development Board / Town Planning Authority",
    category: "Infrastructure",
    description: "Formal sanction of industrial civil structures ensuring structural stability and zoning clearances.",
    mandatoryDocuments: ["Structural Stability Certificate by Chartered Engineer", "Site Elevation & Cross-Section Blueprints", "Land Allotment Order"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹25,000 – ₹75,000",
  },
  {
    code: "REQ_FACTORIES_LICENSE",
    title: "Factory Registration & License (Form 2)",
    deptKey: "dish",
    defaultDept: "Directorate of Industrial Safety & Health (DISH)",
    category: "Labour & Safety",
    description: "Mandatory factory operating license under the Factories Act, 1948 for manufacturing establishments.",
    mandatoryDocuments: ["Approved Factory Plan Drawing", "Machinery Horsepower Schedule", "Ventilation & Lighting Certificate", "Safety Officer Appointment Proof"],
    inspectionRequired: true,
    validityYears: 5,
    feeEstimate: "₹15,000 – ₹40,000",
    condition: (p) => parseInt(p.employeesCount || 0) >= 10 || p.industryType === "Manufacturing",
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
  {
    code: "REQ_BOILER_CERT",
    title: "Industrial Boiler Operation Certificate",
    deptKey: "boilers",
    defaultDept: "Directorate of Steam Boilers",
    category: "Safety & Hazard",
    description: "Statutory annual certificate under Indian Boiler Regulations (IBR) certifying safety of high-pressure vessels.",
    mandatoryDocuments: ["Hydraulic Pressure Test Inspection Report", "Certified Boiler Attendant License", "Steam Piping Isometric Drawings"],
    inspectionRequired: true,
    validityYears: 1,
    feeEstimate: "₹12,000 – ₹30,000",
    condition: (p) => ["Manufacturing", "Chemicals", "Textile"].includes(p.industryType) && ["Medium Enterprise", "Large Enterprise"].includes(p.businessCategory),
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
    feeEstimate: "₹7,500 – ₹15,000",
    condition: (p) => p.industryType === "Food Processing",
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
    feeEstimate: "₹25,000 – ₹50,000",
    condition: (p) => p.industryType === "Chemicals",
  },
];

function computeRequirements(profile, applications = []) {
  if (!profile) return [];
  const stateMapping = STATE_DEPARTMENT_REGISTRY[profile.state] || STATE_DEPARTMENT_REGISTRY["Other"];

  return STATUTORY_CATALOG.filter((item) => {
    if (!item.condition) return true;
    return item.condition(profile);
  }).map((item) => {
    const existingApp = applications.find((a) => a.requirement_code === item.code);
    const resolvedDept = item.deptKey ? (stateMapping[item.deptKey] || item.defaultDept) : item.department;

    return {
      code: item.code,
      title: item.title,
      department: resolvedDept,
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
