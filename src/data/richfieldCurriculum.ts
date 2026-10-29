import { ProgrammeInfo, CurriculumModule, CampusName, ProgrammeId } from '../types';

export const PROGRAMMES: Record<ProgrammeId, ProgrammeInfo> = {
  DIT: {
    id: 'DIT',
    name: 'Diploma in IT',
    fullName: 'Diploma in Information Technology (DIT)',
    saqaId: '88322',
    nqfLevel: 6,
    totalCredits: 365,
    durationYears: 3,
    accreditation: 'Council on Higher Education (CHE) & BAC Accredited',
    specialisations: ['Programming', 'Network Engineering', 'Business Analysis'],
    description: 'Provides a strong foundation across core IT sectors: networks, databases, software systems, and systems analysis with three career elective streams.'
  },
  BSc_IT: {
    id: 'BSc_IT',
    name: 'BSc in IT',
    fullName: 'Bachelor of Science in Information Technology (BSc IT)',
    saqaId: '122369',
    nqfLevel: 7,
    totalCredits: 395,
    durationYears: 3,
    accreditation: 'Council on Higher Education (CHE) & BAC Accredited',
    specialisations: [
      'Programming',
      'Emerging Technologies (Cloud, Big Data, IoT, ML, Robotics, AI)',
      'IT Management',
      'Network Engineering'
    ],
    description: 'Designed for future-focused innovators, merging software engineering with emerging tech: AI, Data Science, Cloud, Robotics, and Advanced IT Strategy.'
  }
};

export const CAMPUS_METADATA: Record<CampusName, { address: string; color: string; label: string; bgClass: string; textClass: string }> = {
  Bryanston: {
    address: '193 Bryanston Dr, The Braes Office Park, JHB',
    color: '#f97316',
    label: 'Bryanston (Orange)',
    bgClass: 'bg-orange-500/10 border-orange-500/30',
    textClass: 'text-orange-500'
  },
  'Newtown Junction': {
    address: '141 Lilian Ngoyi Street, Newtown, JHB',
    color: '#eab308',
    label: 'Newtown Junction (Yellow)',
    bgClass: 'bg-yellow-500/10 border-yellow-500/30',
    textClass: 'text-yellow-600 dark:text-yellow-400'
  },
  Pretoria: {
    address: '291 Helen Joseph Street, Pretoria',
    color: '#22c55e',
    label: 'Pretoria (Green)',
    bgClass: 'bg-emerald-500/10 border-emerald-500/30',
    textClass: 'text-emerald-500'
  },
  Centurion: {
    address: '1269 Gordon Hood Ave, Centurion Mall Offices',
    color: '#a855f7',
    label: 'Centurion (Purple)',
    bgClass: 'bg-purple-500/10 border-purple-500/30',
    textClass: 'text-purple-500'
  },
  Polokwane: {
    address: 'Library Gardens, 61 Hans Van Rensburg St',
    color: '#14b8a6',
    label: 'Polokwane (Teal)',
    bgClass: 'bg-teal-500/10 border-teal-500/30',
    textClass: 'text-teal-500'
  },
  'Cape Town': {
    address: '112 Long Street, 5th Floor City Centre',
    color: '#64748b',
    label: 'Cape Town (Slate/Grey)',
    bgClass: 'bg-slate-500/10 border-slate-500/30',
    textClass: 'text-slate-600 dark:text-slate-300'
  },
  Umhlanga: {
    address: 'Centenary Blvd, Park Square, 5-9 Park Ave, Durban',
    color: '#ec4899',
    label: 'Umhlanga (Pink)',
    bgClass: 'bg-pink-500/10 border-pink-500/30',
    textClass: 'text-pink-500'
  },
  Musgrave: {
    address: '135 Musgrave Road, Musgrave Centre, Durban',
    color: '#55305A',
    label: 'Musgrave (Dark Plum)',
    bgClass: 'bg-[#55305A]/10 border-[#55305A]/30',
    textClass: 'text-[#55305A] dark:text-[#a573aa]'
  },
  'Distance Learning': {
    address: 'Online Nationwide & International Portal',
    color: '#3b82f6',
    label: 'Distance Learning (Blue)',
    bgClass: 'bg-blue-500/10 border-blue-500/30',
    textClass: 'text-blue-500'
  }
};

// DIT Modules (SAQA 88322, NQF 6, 365 Credits)
export const DIT_MODULES: CurriculumModule[] = [
  // Year 1 (Total: 120 credits)
  { code: 'SFD500', name: 'Software Development 500', year: 1, semester: 1, nqfLevel: 5, credits: 10, programme: 'DIT', description: 'Fundamentals of software construction and computational thinking.' },
  { code: 'INF511', name: 'Information Systems 511', year: 1, semester: 1, nqfLevel: 5, credits: 10, programme: 'DIT', description: 'Core principles of organizational data processing systems.' },
  { code: 'PROG511', name: 'Programming 511', year: 1, semester: 1, nqfLevel: 5, credits: 15, programme: 'DIT', description: 'Syntax, variables, conditionals, loops, and control flow in modern languages.', badgePartner: 'Oracle Academy' },
  { code: 'WEB511', name: 'Web Technology 511', year: 1, semester: 1, nqfLevel: 5, credits: 15, programme: 'DIT', description: 'Semantic HTML, CSS layouts, and client-side interactivity.' },
  { code: 'NET511', name: 'Networks 511', year: 1, semester: 1, nqfLevel: 5, credits: 10, programme: 'DIT', description: 'Networking layers, hardware, OSI 7-layer model, and topologies.', badgePartner: 'Cisco Networking Academy' },
  { code: 'BCM500', name: 'Business Communication 500', year: 1, semester: 2, nqfLevel: 5, credits: 10, programme: 'DIT', description: 'Technical documentation, executive presentations, and email etiquette.' },
  { code: 'INF512', name: 'Information Systems 512', year: 1, semester: 2, nqfLevel: 5, credits: 10, programme: 'DIT', description: 'System lifecycles, database concepts, and architecture fundamentals.' },
  { code: 'PROG512', name: 'Programming 512', year: 1, semester: 2, nqfLevel: 5, credits: 15, programme: 'DIT', description: 'Functions, modular programming, array manipulation, and data persistence.' },
  { code: 'WEB512', name: 'Web Technology 512', year: 1, semester: 2, nqfLevel: 5, credits: 15, programme: 'DIT', description: 'Responsive web engineering, DOM events, and REST consumption.' },
  { code: 'NET512', name: 'Networks 512', year: 1, semester: 2, nqfLevel: 5, credits: 10, programme: 'DIT', description: 'TCP/IP routing, address management, and packet transport.' },

  // Year 2 (Total: 120 credits)
  { code: 'MCM621', name: 'M-Commerce 621', year: 2, semester: 1, nqfLevel: 6, credits: 10, programme: 'DIT', description: 'Mobile transaction architectures, security, and payment gateways.' },
  { code: 'INF621', name: 'Information Systems 621', year: 2, semester: 1, nqfLevel: 6, credits: 10, programme: 'DIT', description: 'Enterprise resource planning and transactional integrity.' },
  { code: 'PROG621', name: 'Programming 621', year: 2, semester: 1, nqfLevel: 6, credits: 15, programme: 'DIT', description: 'Object-oriented programming, data structures, and algorithmic optimization.' },
  { code: 'DBS621', name: 'Database Systems 621', year: 2, semester: 1, nqfLevel: 6, credits: 10, programme: 'DIT', description: 'Relational database design, SQL DDL/DML, normalization, and keys.', badgePartner: 'Oracle Academy' },
  { code: 'INT621', name: 'Internet Programming 621', year: 2, semester: 1, nqfLevel: 6, credits: 15, isElective: true, specialisation: 'Programming', programme: 'DIT', description: 'Fullstack web APIs, asynchronous pipelines, and server architecture.' },
  { code: 'NET621', name: 'Networks 621', year: 2, semester: 1, nqfLevel: 6, credits: 15, isElective: true, specialisation: 'Network Engineering', programme: 'DIT', description: 'VLSM CIDR subnetting, router configurations, and switching logic.', badgePartner: 'Cisco Networking Academy' },
  { code: 'BMA621', name: 'Business Management 621', year: 2, semester: 1, nqfLevel: 6, credits: 15, isElective: true, specialisation: 'Business Analysis', programme: 'DIT', description: 'Business model analysis, operational governance, and financial feasibility.' },

  // Year 3 (Total: 125 credits)
  { code: 'QTN600', name: 'Quantitative Techniques 600', year: 3, semester: 1, nqfLevel: 6, credits: 15, programme: 'DIT', description: 'Mathematical and statistical decision-making models for IT projects.' },
  { code: 'SOF600', name: 'Software Engineering 600', year: 3, semester: 1, nqfLevel: 6, credits: 10, programme: 'DIT', description: 'Design patterns, CI/CD pipelines, automated testing, and agile ceremonies.' },
  { code: 'HCI600', name: 'Human Computer Interaction 600', year: 3, semester: 1, nqfLevel: 6, credits: 10, programme: 'DIT', description: 'Usability heuristics, user experience modeling, and accessible design.' },
  { code: 'OPS600', name: 'Operating Systems 600', year: 3, semester: 2, nqfLevel: 6, credits: 10, programme: 'DIT', description: 'Process scheduling, virtual memory, concurrency, and thread safety.' },
  { code: 'PRJ600', name: 'IT Project 600', year: 3, semester: 2, nqfLevel: 6, credits: 10, programme: 'DIT', description: 'Capstone software delivery addressing real client business requirements.' },
  { code: 'MIS600', name: 'Management Information Systems 600', year: 3, semester: 2, nqfLevel: 6, credits: 10, programme: 'DIT', description: 'Strategic tech alignment, cloud governance, and IT audits.' },
  { code: 'PROG631', name: 'Programming 631', year: 3, semester: 1, nqfLevel: 6, credits: 15, isElective: true, specialisation: 'Programming', programme: 'DIT', description: 'Advanced framework development, distributed services, and microservices.' },
  { code: 'NET631', name: 'Networks 631', year: 3, semester: 1, nqfLevel: 6, credits: 15, isElective: true, specialisation: 'Network Engineering', programme: 'DIT', description: 'Network security, firewall ACLs, policy rules, and forensic packet inspection.' },
  { code: 'BUA631', name: 'Business Analysis 631', year: 3, semester: 1, nqfLevel: 6, credits: 15, isElective: true, specialisation: 'Business Analysis', programme: 'DIT', description: 'Elicitation techniques, BPMN 2.0 workflows, and INVEST user stories.' }
];

// BSc IT Modules (SAQA 122369, NQF 7, 395 Credits)
export const BSC_IT_MODULES: CurriculumModule[] = [
  // Year 1 (Total: 130 credits)
  { code: 'PROG511', name: 'Programming 511', year: 1, semester: 1, nqfLevel: 5, credits: 15, programme: 'BSc_IT', description: 'Algorithmic problem-solving, control structures, and memory models.' },
  { code: 'WEB511', name: 'Web Technology 511', year: 1, semester: 1, nqfLevel: 5, credits: 15, programme: 'BSc_IT', description: 'Web architecture, protocols, responsive interface systems.' },
  { code: 'NET511', name: 'Networks 511', year: 1, semester: 1, nqfLevel: 5, credits: 10, programme: 'BSc_IT', description: 'Layered network stack, physical topologies, and Ethernet standards.' },
  { code: 'MAT511', name: 'Mathematics 511', year: 1, semester: 1, nqfLevel: 5, credits: 10, programme: 'BSc_IT', description: 'Discrete mathematics, logic, sets, boolean algebra, and graph theory.' },
  { code: 'INF511', name: 'Information Systems 511', year: 1, semester: 1, nqfLevel: 5, credits: 10, programme: 'BSc_IT', description: 'Enterprise data flows, business process software, and storage models.' },
  { code: 'DSC500', name: 'Data Science 500', year: 1, semester: 2, nqfLevel: 5, credits: 10, programme: 'BSc_IT', description: 'Introduction to data wrangling, descriptive stats, and Python pandas.', badgePartner: 'IBM Skills Academy' },
  { code: 'MAT512', name: 'Mathematics 512', year: 1, semester: 2, nqfLevel: 5, credits: 10, programme: 'BSc_IT', description: 'Linear algebra, vectors, matrices, and probability distributions for computing.' },
  { code: 'PROG512', name: 'Programming 512', year: 1, semester: 2, nqfLevel: 5, credits: 15, programme: 'BSc_IT', description: 'Object structures, file I/O, recursion, and search/sort complexities.' },

  // Year 2 (Total: 120 credits)
  { code: 'PROG621', name: 'Programming 621', year: 2, semester: 1, nqfLevel: 6, credits: 15, programme: 'BSc_IT', description: 'Advanced object-oriented programming, design patterns, and unit tests.' },
  { code: 'DBS600', name: 'Database Systems 600', year: 2, semester: 1, nqfLevel: 6, credits: 10, programme: 'BSc_IT', description: 'Relational algebra, SQL optimizations, indexing, and ACID constraints.', badgePartner: 'Oracle Academy' },
  { code: 'CLD600', name: 'Cloud Computing 600', year: 2, semester: 1, nqfLevel: 6, credits: 10, programme: 'BSc_IT', description: 'AWS infrastructure, virtualization, serverless compute, and S3 partitioning.', badgePartner: 'AWS Academy Partner' },
  { code: 'IOT600', name: 'Big Data & IOT 600', year: 2, semester: 2, nqfLevel: 6, credits: 10, programme: 'BSc_IT', description: 'Distributed data ingestion, sensor networks, and Kafka/MQTT streams.' },
  { code: 'MLN600', name: 'Machine Learning 600', year: 2, semester: 2, nqfLevel: 6, credits: 10, programme: 'BSc_IT', description: 'Supervised & unsupervised learning, regression, classification, and neural nets.', badgePartner: 'IBM Skills Academy' },
  { code: 'DMV600', name: 'Data Manipulation & Visualisation 600', year: 2, semester: 1, nqfLevel: 6, credits: 15, isElective: true, specialisation: 'Emerging Technologies (Cloud, Big Data, IoT, ML, Robotics, AI)', programme: 'BSc_IT', description: 'Exploratory data analysis, Seaborn, Matplotlib, and Power BI dashboards.', badgePartner: 'Microsoft Certified' },
  { code: 'BUA621', name: 'Business Analysis 621', year: 2, semester: 1, nqfLevel: 6, credits: 15, isElective: true, specialisation: 'IT Management', programme: 'BSc_IT', description: 'Enterprise analysis, strategy mapping, and requirements elicitation.', badgePartner: 'CIMA' },

  // Year 3 (Total: 145 credits)
  { code: 'SOF700', name: 'Software Engineering 700', year: 3, semester: 1, nqfLevel: 7, credits: 10, programme: 'BSc_IT', description: 'Enterprise software architecture, microservices, and automated testing.' },
  { code: 'SEC700', name: 'Cyber Security 700', year: 3, semester: 1, nqfLevel: 7, credits: 10, programme: 'BSc_IT', description: 'Intrusion detection, cryptographic protocols, penetration testing, and SIEM.', badgePartner: 'Fortinet / IBM' },
  { code: 'AI700', name: 'Artificial Intelligence 700', year: 3, semester: 1, nqfLevel: 7, credits: 10, programme: 'BSc_IT', description: 'Deep learning models, natural language processing, and heuristic search.', badgePartner: 'IBM Skills Academy' },
  { code: 'HCI700', name: 'Human Computer Interaction 700', year: 3, semester: 1, nqfLevel: 7, credits: 10, programme: 'BSc_IT', description: 'Cognitive models, accessibility WCAG compliance, and interface prototyping.' },
  { code: 'MOB700', name: 'Mobile App Development 700', year: 3, semester: 2, nqfLevel: 7, credits: 10, programme: 'BSc_IT', description: 'Native & cross-platform mobile architecture, offline sync, and device sensors.' },
  { code: 'PRJ700', name: 'IT Project 700', year: 3, semester: 2, nqfLevel: 7, credits: 10, programme: 'BSc_IT', description: 'Honours-pathway capstone building an innovative real-world IT product.' },
  { code: 'ROB700', name: 'Autonomous Systems & Robotics 700', year: 3, semester: 2, nqfLevel: 7, credits: 15, isElective: true, specialisation: 'Emerging Technologies (Cloud, Big Data, IoT, ML, Robotics, AI)', programme: 'BSc_IT', description: 'Robotic control loops, kinematics, path planning, and embedded sensors.' }
];

// Richfield Mark Calculation Logic (40% formative, 60% summative, 50% pass, 40-47% supplementary)
export function calculateRichfieldGrade(formativeScore: number, summativeScore: number) {
  const finalMark = Math.round((formativeScore * 0.40) + (summativeScore * 0.60));
  const passed = finalMark >= 50;
  const allowsSupplementary = !passed && finalMark >= 40 && finalMark <= 47;
  
  let statusText = 'Pass';
  if (finalMark >= 75) statusText = 'Distinction';
  else if (allowsSupplementary) statusText = 'Supplementary Exam Qualified';
  else if (!passed) statusText = 'Fail';

  return {
    finalMark,
    passed,
    allowsSupplementary,
    statusText,
    breakdown: {
      formativeContribution: +(formativeScore * 0.40).toFixed(1),
      summativeContribution: +(summativeScore * 0.60).toFixed(1)
    }
  };
}
