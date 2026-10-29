import { Challenge } from '../types';

export const ALL_CHALLENGES: Challenge[] = [
  // 1. DIT & BSc IT: Programming 511 (Algorithmic Logic & Loops)
  {
    id: 'ch-prog-511',
    title: 'Richfield 40/60 Assessment Grade Normalizer',
    programme: 'BOTH',
    focusArea: 'programming',
    yearLevel: 'Year 1',
    moduleCode: 'PROG511',
    moduleName: 'Programming 511',
    nqfLevel: 5,
    ditCredits: 15,
    difficulty: 'Beginner',
    points: 120,
    framework: 'Core JavaScript & Logic',
    industryPartner: 'Oracle',
    learn: {
      headline: 'Weighted Assessment Formulas & Conditionals',
      estimatedMinutes: 2,
      plainEnglishExplanation: 'At Richfield, final module grades are calculated by applying weights to formative (40%) and summative (60%) assessments. To pass, a student needs >= 50%. A supplementary exam is awarded if the score is between 40% and 47% (inclusive).',
      realWorldAnalogy: 'Think of formative assessments like four practice driving tests and the summative assessment as the final DMV road exam. Both contribute proportionally to your final driving license evaluation.',
      workedExample: {
        title: 'Calculating Weighted Score',
        codeOrDiagram: `const formative = 60;\nconst summative = 70;\nconst finalMark = Math.round((formative * 0.40) + (summative * 0.60)); // = 66% (Pass)`,
        explanation: 'Multiply each component by its decimal weight (0.4 and 0.6), add them together, and check boundary conditions.'
      },
      refresher: {
        topic: 'Conditionals & Logical Operators in JavaScript',
        quickNotes: [
          'Use && for logical AND: score >= 40 && score <= 47',
          'Use >= for inclusive thresholds',
          'Math.round() rounds to the nearest whole integer'
        ],
        cheatSheet: 'if (mark >= 50) { pass(); } else if (mark >= 40 && mark <= 47) { supplementary(); }'
      }
    },
    play: {
      type: 'order_lines',
      prompt: 'Order the execution steps to calculate final mark and check Richfield supplementary exam eligibility:',
      secretGateCode: 'RUBRIC-5047',
      scrambledItems: [
        { id: 'step-3', text: 'Check if mark is between 40 and 47 to grant supplementary exam' },
        { id: 'step-1', text: 'Compute weighted sum: (formative * 0.4) + (summative * 0.6)' },
        { id: 'step-4', text: 'Return final result object with pass and supplementary status' },
        { id: 'step-2', text: 'Check if finalMark >= 50 for direct pass' }
      ],
      correctOrder: ['step-1', 'step-2', 'step-3', 'step-4'],
      explanation: 'First compute the weighted numerical mark, check for direct pass, test the supplementary threshold, and return the report.'
    },
    proveType: 'code',
    starterCode: `function calculateRichfieldGrade(formative, summative) {
  // Return { finalMark, passed, allowsSupplementary }
  // 40% Formative + 60% Summative
  // Pass: >= 50. Supplementary: 40 to 47 inclusive.
  return {
    finalMark: 0,
    passed: false,
    allowsSupplementary: false
  };
}`,
    testCases: [
      {
        id: 'tc-1',
        name: 'Check Standard Pass Mark (70 Formative, 80 Summative)',
        description: 'Should compute 76% pass',
        expectedOutput: '{ finalMark: 76, passed: true, allowsSupplementary: false }',
        check: (code: string) => {
          try {
            const fn = new Function(`${code}; return calculateRichfieldGrade;`)();
            const res = fn(70, 80);
            if (res.finalMark === 76 && res.passed === true && !res.allowsSupplementary) {
              return { passed: true, message: 'Calculated 76% direct pass' };
            }
            return { passed: false, message: `Got finalMark: ${res?.finalMark}, passed: ${res?.passed}` };
          } catch (e: any) {
            return { passed: false, message: e.message };
          }
        }
      },
      {
        id: 'tc-2',
        name: 'Check Supplementary Exam Window (45 Formative, 45 Summative)',
        description: 'Should qualify for 40-47% supplementary window',
        expectedOutput: '{ finalMark: 45, passed: false, allowsSupplementary: true }',
        check: (code: string) => {
          try {
            const fn = new Function(`${code}; return calculateRichfieldGrade;`)();
            const res = fn(45, 45);
            if (res.finalMark === 45 && res.passed === false && res.allowsSupplementary === true) {
              return { passed: true, message: 'Supplementary exam eligibility verified' };
            }
            return { passed: false, message: `Supplementary exam check failed for 45%` };
          } catch (e: any) {
            return { passed: false, message: e.message };
          }
        }
      }
    ],
    hints: {
      nudge: 'Final mark is (formative * 0.40) + (summative * 0.60). Round it using Math.round().',
      direction: 'A student passes if finalMark >= 50. If not passed, check if finalMark >= 40 && finalMark <= 47 for supplementary.',
      pseudocode: `const finalMark = Math.round((formative * 0.4) + (summative * 0.6));\nconst passed = finalMark >= 50;\nconst allowsSupplementary = !passed && finalMark >= 40 && finalMark <= 47;\nreturn { finalMark, passed, allowsSupplementary };`
    },
    sampleSolution: `function calculateRichfieldGrade(formative, summative) {
  const finalMark = Math.round((formative * 0.40) + (summative * 0.60));
  const passed = finalMark >= 50;
  const allowsSupplementary = !passed && finalMark >= 40 && finalMark <= 47;
  return { finalMark, passed, allowsSupplementary };
}`,
    solutionExplanation: 'According to page 11 & 18 of the Richfield Prospectus, formative assessments count 40% and summative exams 60%. Pass mark is 50%, with 40-47% qualifying for supplementary examination.'
  },

  // 2. DIT & BSc IT: Database Systems 621 / 600 (SQL Playground Track)
  {
    id: 'ch-sql-621',
    title: 'SQL: Campus Enrolment & High Achievers Query',
    programme: 'BOTH',
    focusArea: 'databases',
    yearLevel: 'Year 2',
    moduleCode: 'DBS621',
    moduleName: 'Database Systems 621 / 600',
    nqfLevel: 6,
    ditCredits: 10,
    difficulty: 'Intermediate',
    points: 150,
    framework: 'ANSI SQL / Relational DB',
    industryPartner: 'Oracle',
    learn: {
      headline: 'Relational INNER JOINs & Aggregate Filters',
      estimatedMinutes: 2,
      plainEnglishExplanation: 'Relational databases store related entities across separate tables to avoid redundancy. An INNER JOIN links matching primary and foreign keys, allowing combined reporting.',
      realWorldAnalogy: 'Think of students having ID card numbers. Rather than printing campus addresses on every class roster, the roster simply links the student ID to their campus ID.',
      workedExample: {
        title: 'INNER JOIN Example',
        codeOrDiagram: `SELECT s.first_name, c.name AS campus_name\nFROM students s\nINNER JOIN campuses c ON s.campus_id = c.campus_id;`,
        explanation: 'Combines the students table with the campuses table matching campus_id keys.'
      },
      refresher: {
        topic: 'SQL Clauses Hierarchy',
        quickNotes: [
          'SELECT: specifies which columns to display',
          'FROM: source table',
          'JOIN ... ON: matches foreign keys',
          'WHERE: filters before grouping',
          'ORDER BY: sorts results ascending (ASC) or descending (DESC)'
        ],
        cheatSheet: 'SELECT cols FROM t1 JOIN t2 ON t1.id = t2.t1_id WHERE condition ORDER BY col DESC;'
      }
    },
    play: {
      type: 'sql_clause_order',
      prompt: 'Arrange the SQL execution clauses in syntactically correct order:',
      secretGateCode: 'JOIN-8832',
      scrambledItems: [
        { id: 'c-3', text: 'WHERE enrolments.final_mark >= 80' },
        { id: 'c-1', text: 'SELECT students.first_name, enrolments.final_mark' },
        { id: 'c-4', text: 'ORDER BY enrolments.final_mark DESC' },
        { id: 'c-2', text: 'FROM students JOIN enrolments ON students.student_id = enrolments.student_id' }
      ],
      correctOrder: ['c-1', 'c-2', 'c-3', 'c-4'],
      explanation: 'SQL query construction follows: SELECT columns -> FROM table JOIN target ON key -> WHERE filter -> ORDER BY sorting.'
    },
    proveType: 'sql',
    sqlTask: {
      taskDescription: 'Write a SQL query that retrieves all students enrolled at the "Umhlanga" campus who achieved a `final_mark >= 80`. Select the student\'s `first_name`, `last_name`, `module_code`, and `final_mark`. Order the results by `final_mark` descending.',
      schemaHint: 'Tables: students (student_id, first_name, last_name, campus_id), campuses (campus_id, name), enrolments (student_id, module_code, final_mark)',
      starterSql: `SELECT s.first_name, s.last_name, e.module_code, e.final_mark
FROM students s
-- Join campuses and enrolments, then filter
;`,
      expectedQuery: `SELECT s.first_name, s.last_name, e.module_code, e.final_mark
FROM students s
INNER JOIN campuses c ON s.campus_id = c.campus_id
INNER JOIN enrolments e ON s.student_id = e.student_id
WHERE c.name = 'Umhlanga' AND e.final_mark >= 80
ORDER BY e.final_mark DESC;`
    },
    hints: {
      nudge: 'Join students to campuses on s.campus_id = c.campus_id, and to enrolments on s.student_id = e.student_id.',
      direction: 'Add the WHERE clause: WHERE c.name = "Umhlanga" AND e.final_mark >= 80. Then add ORDER BY e.final_mark DESC.',
      pseudocode: `SELECT s.first_name, s.last_name, e.module_code, e.final_mark\nFROM students s\nJOIN campuses c ON s.campus_id = c.campus_id\nJOIN enrolments e ON s.student_id = e.student_id\nWHERE c.name = 'Umhlanga' AND e.final_mark >= 80\nORDER BY e.final_mark DESC;`
    },
    sampleSolution: `SELECT s.first_name, s.last_name, e.module_code, e.final_mark
FROM students s
INNER JOIN campuses c ON s.campus_id = c.campus_id
INNER JOIN enrolments e ON s.student_id = e.student_id
WHERE c.name = 'Umhlanga' AND e.final_mark >= 80
ORDER BY e.final_mark DESC;`,
    solutionExplanation: 'Relational joins link students to their respective campus and academic enrolment records. Filtering by c.name = "Umhlanga" and e.final_mark >= 80 isolates high-performing Umhlanga candidates.'
  },

  // 3. DIT & BSc IT: Business Analysis 631 / 621 (AI Dialogue Simulation Track)
  {
    id: 'ch-ba-631',
    title: 'BA Dialogue Simulation: Campus Bursary Portal Scope Elicitation',
    programme: 'BOTH',
    focusArea: 'business_analysis',
    yearLevel: 'Year 3',
    moduleCode: 'BUA631',
    moduleName: 'Business Analysis 631 / 621',
    nqfLevel: 6,
    ditCredits: 15,
    difficulty: 'Intermediate',
    points: 160,
    framework: 'IIBA BABOK & INVEST User Stories',
    industryPartner: 'CIMA',
    learn: {
      headline: 'Stakeholder Elicitation & Scope Creep Defense',
      estimatedMinutes: 2,
      plainEnglishExplanation: 'In Business Analysis, software failures rarely stem from bad code; they stem from misunderstood requirements. A Business Analyst asks open-ended clarifying questions to uncover root needs rather than blindly accepting superficial feature requests.',
      realWorldAnalogy: 'A patient asks a doctor for a specific surgery. The doctor doesn’t immediately operate; they ask diagnostic questions to diagnose the actual underlying ailment.',
      workedExample: {
        title: 'INVEST User Story Format',
        codeOrDiagram: `As a [persona],\nI want to [action],\nSo that [business outcome / benefit].\n\nAcceptance Criteria:\n1. Given ..., When ..., Then ...`,
        explanation: 'Frames requirements around user value rather than technical implementation details.'
      },
      refresher: {
        topic: 'INVEST Criteria Checklist',
        quickNotes: [
          'Independent: can be delivered separately',
          'Negotiable: captures essence, details open to refinement',
          'Valuable: delivers tangible user or campus benefit',
          'Estimable: clear enough to size in story points',
          'Small: fits comfortably inside a single sprint',
          'Testable: has concrete pass/fail acceptance criteria'
        ],
        cheatSheet: 'As a <user>, I want <goal> so that <benefit>. Criteria: Given/When/Then.'
      }
    },
    play: {
      type: 'bpmn_sort',
      prompt: 'Arrange the BPMN 2.0 flow elements in correct logical order for Bursary Application Processing:',
      secretGateCode: 'BPMN-9182',
      scrambledItems: [
        { id: 'b-3', text: 'Exclusive Gateway (XOR): Matric Average >= 75%?' },
        { id: 'b-1', text: 'Start Event: Student Submits Bursary Form via Richfield Portal' },
        { id: 'b-4', text: 'End Event: Issue Approval Letter & Update Finance Ledger' },
        { id: 'b-2', text: 'User Task: Automated Academic Transcript Verification' }
      ],
      correctOrder: ['b-1', 'b-2', 'b-3', 'b-4'],
      explanation: 'BPMN processes begin at a Start Event, proceed through verification tasks, evaluate conditions via decision gateways, and terminate at End Events.'
    },
    proveType: 'dialogue',
    dialogueTask: {
      stakeholderName: 'Dr. Muni Kooblal',
      stakeholderRole: 'Associate Registrar & Bursary Sponsor',
      personaMood: 'Demanding',
      scenarioBrief: 'Dr. Kooblal wants an automated bursary system launched for the next academic semester across all 8 campuses. However, his initial request is vague: "Just make a magic button where students upload whatever they want, and AI approves money instantly." As the lead Business Analyst, elicit actual requirements, define boundary criteria, prevent fraud, and formalize an INVEST story.',
      initialGreeting: 'Thanks for meeting. We need this bursary portal live in 3 weeks. Students should just click "Apply" and receive funding immediately. What do your developers need from me?',
      sampleElicitationQuestions: [
        'What specific verification documents (ID, Grade 12 results, proof of address) are mandatory per DHET compliance?',
        'How should applications be reviewed if a student does not meet the automatic 75% academic threshold?',
        'What fraud prevention controls or financial means tests must precede fund disbursement?'
      ],
      evalCriteria: {
        elicitationScore: 85,
        investScore: 90,
        scopeManagementScore: 85
      },
      expertDebrief: 'Outstanding Business Analysis! You politely pushed back on unfeasible timelines, clarified compliance constraints (DHET & Richfield policy), identified essential verification documents, and prevented fraudulent instant payouts.'
    },
    hints: {
      nudge: 'Ask what verification documents are required by South African higher education regulations before any money is paid.',
      direction: 'Frame a clarifying question around the approval criteria and audit trail rather than agreeing to instant automatic payout.',
      pseudocode: 'State: "To ensure DHET compliance and audit readiness, what specific criteria and proof of household income must be verified before approval?"'
    },
    sampleSolution: 'Strong BA Response: "To ensure full regulatory compliance with the Department of Higher Education and prevent financial fraud, could you specify the mandatory supporting documents (such as ID, Grade 12 results, and proof of address) and what validation checks our financial aid officers must perform?"',
    solutionExplanation: 'A certified Business Analyst never promises unrealistic instantaneous payouts without understanding compliance requirements, financial audits, and validation criteria.'
  },

  // 4. DIT & BSc IT: Networks 621 (VLSM & Subnetting)
  {
    id: 'ch-net-621',
    title: 'VLSM CIDR Subnet Calculator for Campus Labs',
    programme: 'BOTH',
    focusArea: 'networking',
    yearLevel: 'Year 2',
    moduleCode: 'NET621',
    moduleName: 'Networks 621',
    nqfLevel: 6,
    ditCredits: 15,
    difficulty: 'Intermediate',
    points: 180,
    framework: 'Cisco IOS & Network Addressing',
    industryPartner: 'Cisco',
    learn: {
      headline: 'Variable Length Subnet Masking (VLSM)',
      estimatedMinutes: 2,
      plainEnglishExplanation: 'VLSM breaks a network down into different sized subnets to prevent wasting valuable IPv4 addresses. A prefix like /26 leaves 6 bits for hosts (2^6 - 2 = 62 usable addresses).',
      realWorldAnalogy: 'Think of dividing a large campus lecture hall into modular glass study pods: instead of assigning 250 seats to a team of 4, you partition exact-sized rooms so space is never squandered.',
      workedExample: {
        title: 'Prefix to Mask Conversion',
        codeOrDiagram: `Prefix /26 -> 26 network bits, 6 host bits\nUsable Hosts = 2^(32-26) - 2 = 64 - 2 = 62 hosts\nMask = 255.255.255.192`,
        explanation: 'Each octet has 8 bits. In the fourth octet, 2 bits = 128 + 64 = 192.'
      },
      refresher: {
        topic: 'Dotted Decimal Octet Values',
        quickNotes: [
          '/24 = 255.255.255.0 (254 hosts)',
          '/25 = 255.255.255.128 (126 hosts)',
          '/26 = 255.255.255.192 (62 hosts)',
          '/27 = 255.255.255.224 (30 hosts)',
          '/28 = 255.255.255.240 (14 hosts)'
        ],
        cheatSheet: 'hostBits = 32 - prefix; usable = 2^hostBits - 2'
      }
    },
    play: {
      type: 'subnet_builder',
      prompt: 'Configure the fourth octet bits for a /26 subnet mask (Target: 255.255.255.192):',
      secretGateCode: 'SUBNET-2550',
      targetSubnet: {
        prefix: 26,
        targetMask: '255.255.255.192',
        hostBitsNeeded: 6
      },
      explanation: 'A /26 prefix borrows 2 bits in the 4th octet: 128 + 64 = 192. 6 bits remain for hosts (62 usable).'
    },
    proveType: 'code',
    starterCode: `function calculateSubnet(cidr) {
  // cidr: "192.168.1.0/26"
  // return { prefix: 26, usableHosts: 62, subnetMask: "255.255.255.192" }
  const [ip, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);
  
  return {
    prefix,
    usableHosts: 0,
    subnetMask: '255.255.255.0'
  };
}`,
    testCases: [
      {
        id: 'tc-net-1',
        name: 'Calculate /26 Subnet Mask & Hosts',
        description: 'Should return 62 hosts and 255.255.255.192 mask',
        expectedOutput: '{ prefix: 26, usableHosts: 62, subnetMask: "255.255.255.192" }',
        check: (code: string) => {
          try {
            const fn = new Function(`${code}; return calculateSubnet;`)();
            const res = fn('192.168.1.0/26');
            if (res.usableHosts === 62 && res.subnetMask === '255.255.255.192') {
              return { passed: true, message: 'Correctly verified /26 mask and 62 usable hosts' };
            }
            return { passed: false, message: `Got hosts: ${res?.usableHosts}, mask: ${res?.subnetMask}` };
          } catch (e: any) {
            return { passed: false, message: e.message };
          }
        }
      },
      {
        id: 'tc-net-2',
        name: 'Calculate /28 Subnet Mask & Hosts',
        description: 'Should return 14 hosts and 255.255.255.240 mask',
        expectedOutput: '{ prefix: 28, usableHosts: 14, subnetMask: "255.255.255.240" }',
        check: (code: string) => {
          try {
            const fn = new Function(`${code}; return calculateSubnet;`)();
            const res = fn('10.0.0.0/28');
            if (res.usableHosts === 14 && res.subnetMask === '255.255.255.240') {
              return { passed: true, message: 'Correctly verified /28 mask and 14 usable hosts' };
            }
            return { passed: false, message: `Failed for /28 calculation` };
          } catch (e: any) {
            return { passed: false, message: e.message };
          }
        }
      }
    ],
    hints: {
      nudge: 'hostBits = 32 - prefix. Usable hosts = Math.pow(2, hostBits) - 2.',
      direction: 'To compute mask: let maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0. Extract octets using bitshifts.',
      pseudocode: `const hostBits = 32 - prefix;\nconst usableHosts = hostBits > 1 ? Math.pow(2, hostBits) - 2 : 0;\nconst maskInt = (~0 << (32 - prefix)) >>> 0;\nconst octets = [(maskInt >>> 24) & 255, (maskInt >>> 16) & 255, (maskInt >>> 8) & 255, maskInt & 255];\nreturn { prefix, usableHosts, subnetMask: octets.join('.') };`
    },
    sampleSolution: `function calculateSubnet(cidr) {
  const [ip, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);
  const hostBits = 32 - prefix;
  const usableHosts = hostBits > 1 ? Math.pow(2, hostBits) - 2 : 0;
  let maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const octets = [
    (maskInt >>> 24) & 255,
    (maskInt >>> 16) & 255,
    (maskInt >>> 8) & 255,
    maskInt & 255
  ];
  return { prefix, usableHosts, subnetMask: octets.join('.') };
}`,
    solutionExplanation: 'In IPv4 networking, calculating subnet boundaries with bitwise masks guarantees clean network segmentations without route overlap across campus departments.'
  },

  // 5. BSc IT Exclusive: Mathematics 511 / 512 (Logic & Truth Tables)
  {
    id: 'ch-math-511',
    title: 'Discrete Boolean Logic & Truth Table Evaluator',
    programme: 'BSc_IT',
    focusArea: 'mathematics',
    yearLevel: 'Year 1',
    moduleCode: 'MAT511',
    moduleName: 'Mathematics 511',
    nqfLevel: 5,
    ditCredits: 10,
    difficulty: 'Beginner',
    points: 130,
    framework: 'Discrete Math & Digital Logic',
    industryPartner: 'Microsoft',
    learn: {
      headline: 'Boolean Implication & De Morgan’s Laws',
      estimatedMinutes: 2,
      plainEnglishExplanation: 'Computer circuits and software assertions rest upon propositional logic. Logical implication (P -> Q) states that if P is true, Q must be true; it is false ONLY when P is true and Q is false (equivalent to NOT P OR Q).',
      realWorldAnalogy: 'Think of an institutional rule: "If you enroll in DIT (P), you get free campus Wi-Fi (Q)." The only way the promise is broken is if you enroll but are denied Wi-Fi.',
      workedExample: {
        title: 'Material Implication Equivalence',
        codeOrDiagram: `P -> Q === (!P || Q)\nDe Morgan: !(P && Q) === (!P || !Q)`,
        explanation: 'Allows transforming complex circuit expressions into simplified disjunctive normal form.'
      },
      refresher: {
        topic: 'Propositional Truth Table',
        quickNotes: [
          'P=True, Q=True -> P->Q is True',
          'P=True, Q=False -> P->Q is False',
          'P=False, Q=True -> P->Q is True',
          'P=False, Q=False -> P->Q is True'
        ],
        cheatSheet: 'implies(p, q) === (!p || q)'
      }
    },
    play: {
      type: 'predict_output',
      prompt: 'What is the boolean evaluation of: !A && (B || !C) when A=false, B=false, C=true?',
      secretGateCode: 'LOGIC-1010',
      snippet: `const A = false;\nconst B = false;\nconst C = true;\nconst result = !A && (B || !C);`,
      options: ['false', 'true', 'undefined', 'null'],
      correctOptionIndex: 0,
      explanation: '!A is true. B is false. !C is false. (false || false) is false. true && false evaluates to false.'
    },
    proveType: 'code',
    starterCode: `function evaluateProposition(p, q, r) {
  // Return the boolean outcome of: (P -> Q) AND (!Q -> R)
  // Remember: P -> Q is equivalent to (!P || Q)
  return false;
}`,
    testCases: [
      {
        id: 'tc-m1',
        name: 'Evaluate P=true, Q=true, R=false',
        description: 'Implication (true -> true) is true, !true is false so false->false is true. Result: true',
        expectedOutput: 'true',
        check: (code: string) => {
          try {
            const fn = new Function(`${code}; return evaluateProposition;`)();
            const res = fn(true, true, false);
            if (res === true) return { passed: true, message: 'Passed truth evaluation' };
            return { passed: false, message: `Expected true, received ${res}` };
          } catch (e: any) {
            return { passed: false, message: e.message };
          }
        }
      },
      {
        id: 'tc-m2',
        name: 'Evaluate P=true, Q=false, R=false',
        description: 'Implication (true -> false) is false, making the AND outcome false.',
        expectedOutput: 'false',
        check: (code: string) => {
          try {
            const fn = new Function(`${code}; return evaluateProposition;`)();
            const res = fn(true, false, false);
            if (res === false) return { passed: true, message: 'Implication correctly flagged false' };
            return { passed: false, message: `Expected false, received ${res}` };
          } catch (e: any) {
            return { passed: false, message: e.message };
          }
        }
      }
    ],
    hints: {
      nudge: 'Express (P -> Q) as (!p || q), and (!Q -> R) as (q || r).',
      direction: 'Combine with the AND operator: return (!p || q) && (q || r);',
      pseudocode: `const left = !p || q;\nconst right = q || r;\nreturn left && right;`
    },
    sampleSolution: `function evaluateProposition(p, q, r) {
  const pImpliesQ = !p || q;
  const notQImpliesR = q || r;
  return pImpliesQ && notQImpliesR;
}`,
    solutionExplanation: 'Logical implication P -> Q simplifies to !P || Q. Combining both clauses with AND provides formal mathematical proof.'
  },

  // 6. BSc IT Exclusive: Machine Learning 600 (Gradient Descent & Loss)
  {
    id: 'ch-ml-600',
    title: 'Linear Regression Gradient Descent Optimizer',
    programme: 'BSc_IT',
    focusArea: 'emerging_tech',
    yearLevel: 'Year 2',
    moduleCode: 'MLN600',
    moduleName: 'Machine Learning 600',
    nqfLevel: 6,
    ditCredits: 10,
    difficulty: 'Advanced',
    points: 220,
    framework: 'Python NumPy & ML Foundations',
    industryPartner: 'IBM',
    learn: {
      headline: 'Mean Squared Error & Gradient Updates',
      estimatedMinutes: 2,
      plainEnglishExplanation: 'Machine learning models learn patterns by minimizing error. Gradient descent computes the slope of the loss function and nudges the model parameters (weight and bias) in the direction of steepest descent.',
      realWorldAnalogy: 'Imagine being blindfolded on a foggy hill. To find the bottom of the valley, you feel which way slopes downwards and take a deliberate step in that direction.',
      workedExample: {
        title: 'Single-Step Weight Update',
        codeOrDiagram: `error = y_pred - y_true\ngradient = (2 / N) * sum(error * x)\nnew_weight = weight - (learning_rate * gradient)`,
        explanation: 'The learning rate controls the step size so the model does not overshoot the minimum.'
      },
      refresher: {
        topic: 'Mean Squared Error (MSE)',
        quickNotes: [
          'MSE = (1/N) * sum((y_pred - y_true)^2)',
          'Loss approaches 0 as predictions align with ground truth',
          'A learning rate too large causes divergence'
        ],
        cheatSheet: 'weight -= alpha * dW; bias -= alpha * dB'
      }
    },
    play: {
      type: 'tap_bug',
      prompt: 'Tap the bug in this gradient descent update step (one line has an incorrect operator that causes divergence):',
      secretGateCode: 'GRAD-4921',
      codeLines: [
        { lineNumber: 1, text: 'const error = prediction - actual;', isBug: false, fixHint: 'Correct error difference' },
        { lineNumber: 2, text: 'const gradientW = (2 / n) * (error * x);', isBug: false, fixHint: 'Correct slope formula' },
        { lineNumber: 3, text: 'weight = weight + (learningRate * gradientW);', isBug: true, fixHint: 'Descent must SUBTRACT the gradient, not add it!' },
        { lineNumber: 4, text: 'bias = bias - (learningRate * error);', isBug: false, fixHint: 'Correct bias update' }
      ],
      explanation: 'In gradient descent we must move in the OPPOSITE direction of the gradient (SUBTRACT). Adding the gradient causes gradient ASCENT (divergence).'
    },
    proveType: 'code',
    starterCode: `function stepGradientDescent(x, y, weight, bias, learningRate) {
  // x, y: arrays of numbers of equal length N
  // 1. Calculate prediction: y_hat = weight * x[i] + bias
  // 2. Compute gradients for weight and bias
  // 3. Update and return { weight, bias }
  return { weight, bias };
}`,
    testCases: [
      {
        id: 'tc-ml-1',
        name: 'Single Optimization Step on y = 2x',
        description: 'Should nudge initial weight 0.0 towards 2.0',
        expectedOutput: 'Weight increases toward target 2.0',
        check: (code: string) => {
          try {
            const fn = new Function(`${code}; return stepGradientDescent;`)();
            const x = [1, 2, 3];
            const y = [2, 4, 6];
            const res = fn(x, y, 0.0, 0.0, 0.1);
            if (res.weight > 0.5 && res.weight < 2.0) {
              return { passed: true, message: `Weight updated in right direction: ${res.weight.toFixed(3)}` };
            }
            return { passed: false, message: `Unexpected weight: ${res?.weight}` };
          } catch (e: any) {
            return { passed: false, message: e.message };
          }
        }
      }
    ],
    hints: {
      nudge: 'For each sample i: error = (weight * x[i] + bias) - y[i].',
      direction: 'Accumulate dW += (2 / N) * error * x[i] and dB += (2 / N) * error.',
      pseudocode: `let dW = 0, dB = 0;\nconst N = x.length;\nfor (let i = 0; i < N; i++) {\n  const err = (weight * x[i] + bias) - y[i];\n  dW += (2 / N) * err * x[i];\n  dB += (2 / N) * err;\n}\nreturn { weight: weight - learningRate * dW, bias: bias - learningRate * dB };`
    },
    sampleSolution: `function stepGradientDescent(x, y, weight, bias, learningRate) {
  const N = x.length;
  let dW = 0;
  let dB = 0;
  for (let i = 0; i < N; i++) {
    const pred = weight * x[i] + bias;
    const error = pred - y[i];
    dW += (2 / N) * error * x[i];
    dB += (2 / N) * error;
  }
  return {
    weight: weight - (learningRate * dW),
    bias: bias - (learningRate * dB)
  };
}`,
    solutionExplanation: 'Gradient descent computes partial derivatives with respect to weights and biases, taking small steps proportional to learning rate towards the global cost minimum.'
  },

  // 7. Cyber Security 700 (SIEM Intrusion Analysis)
  {
    id: 'ch-sec-700',
    title: 'SIEM Auth Log Brute-Force Intrusion Detector',
    programme: 'BOTH',
    focusArea: 'cybersecurity',
    yearLevel: 'Year 3',
    moduleCode: 'SEC700',
    moduleName: 'Cyber Security 700',
    nqfLevel: 7,
    ditCredits: 10,
    difficulty: 'Intermediate',
    points: 200,
    framework: 'IBM QRadar / Fortinet NSE',
    industryPartner: 'IBM',
    learn: {
      headline: 'Temporal Attack Correlation & Sliding Windows',
      estimatedMinutes: 2,
      plainEnglishExplanation: 'Security Information and Event Management (SIEM) systems correlate thousands of security events to flag automated credential stuffing and brute-force attacks across network endpoints.',
      realWorldAnalogy: 'If a bank teller sees someone enter a PIN wrong once, it’s normal. If someone tries 5 incorrect PINs in 20 seconds, the ATM swallows the card and sounds an alarm.',
      workedExample: {
        title: 'Sliding Window Check',
        codeOrDiagram: `// IP flagged if 3 or more failed logins occur within 60 seconds\ntimestamps = [10, 25, 40] // 40 - 10 = 30s <= 60s -> FLAG ALARM!`,
        explanation: 'Sorting timestamps lets you check difference between index i and index i + threshold - 1.'
      },
      refresher: {
        topic: 'Brute Force Defense Metrics',
        quickNotes: [
          'Threshold: max failed attempts permitted (e.g. 3)',
          'Window: duration in seconds (e.g. 60s)',
          'Remediation: IP rate-limiting, CAPTCHA, or temporary lockout'
        ],
        cheatSheet: 'if (times[i + k - 1] - times[i] <= window) flag(ip);'
      }
    },
    play: {
      type: 'spot_vulnerability',
      prompt: 'Spot the security vulnerability in this authentication route handler:',
      secretGateCode: 'SHIELD-7001',
      snippet: `app.post('/api/login', async (req, res) => {\n  const { username, password } = req.body;\n  const query = "SELECT * FROM users WHERE user = '" + username + "' AND pass = '" + password + "'";\n  const user = await db.raw(query);\n});`,
      options: [
        'SQL Injection via direct string concatenation',
        'Cross-Site Scripting (XSS) in headers',
        'Missing JSON response status code',
        'Insecure port number'
      ],
      correctOptionIndex: 0,
      explanation: 'Concatenating raw untrusted user input directly into SQL queries creates a critical SQL Injection flaw that allows attackers to bypass authentication.'
    },
    proveType: 'code',
    starterCode: `function detectBruteForce(logs, maxAttempts = 3, windowSeconds = 60) {
  // logs: [{ ip: string, status: "SUCCESS" | "FAILED", timestamp: number }]
  // Flag IP if >= maxAttempts "FAILED" within windowSeconds
  const flagged = new Set();
  
  return Array.from(flagged).sort();
}`,
    testCases: [
      {
        id: 'tc-sec-1',
        name: 'Flags IP 192.168.1.99 with 3 failures in 30s',
        description: 'Should identify attacking IP within threshold',
        expectedOutput: '["192.168.1.99"]',
        check: (code: string) => {
          try {
            const fn = new Function(`${code}; return detectBruteForce;`)();
            const logs = [
              { ip: '192.168.1.99', status: 'FAILED', timestamp: 10 },
              { ip: '192.168.1.99', status: 'FAILED', timestamp: 25 },
              { ip: '192.168.1.99', status: 'FAILED', timestamp: 40 },
              { ip: '10.0.0.5', status: 'SUCCESS', timestamp: 12 }
            ];
            const res = fn(logs, 3, 60);
            if (Array.isArray(res) && res.includes('192.168.1.99') && !res.includes('10.0.0.5')) {
              return { passed: true, message: 'Malicious IP accurately detected' };
            }
            return { passed: false, message: `Result was: ${JSON.stringify(res)}` };
          } catch (e: any) {
            return { passed: false, message: e.message };
          }
        }
      }
    ],
    hints: {
      nudge: 'Group all failure timestamps by IP in an object or Map.',
      direction: 'For each IP with at least maxAttempts failures, sort timestamps numerically. Then check if timestamps[i + maxAttempts - 1] - timestamps[i] <= windowSeconds.',
      pseudocode: `const failed = {};\nlogs.filter(l => l.status === 'FAILED').forEach(l => {\n  failed[l.ip] = failed[l.ip] || [];\n  failed[l.ip].push(l.timestamp);\n});\n// Check sliding window\n// Return sorted unique IPs`
    },
    sampleSolution: `function detectBruteForce(logs, maxAttempts = 3, windowSeconds = 60) {
  const failedByIp = {};
  for (const log of logs) {
    if (log.status === 'FAILED') {
      if (!failedByIp[log.ip]) failedByIp[log.ip] = [];
      failedByIp[log.ip].push(log.timestamp);
    }
  }
  const flagged = new Set();
  for (const [ip, times] of Object.entries(failedByIp)) {
    times.sort((a, b) => a - b);
    for (let i = 0; i <= times.length - maxAttempts; i++) {
      if (times[i + maxAttempts - 1] - times[i] <= windowSeconds) {
        flagged.add(ip);
        break;
      }
    }
  }
  return Array.from(flagged).sort();
}`,
    solutionExplanation: 'Sliding time window algorithms are foundational to enterprise SIEM tools like IBM QRadar, identifying coordinated attacks while filtering out benign random user mistakes.'
  }
];
