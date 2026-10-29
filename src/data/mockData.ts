import { DITFocusArea, FocusAreaMeta, FrameworkTrack, Badge } from '../types';

export const FOCUS_AREAS: Record<DITFocusArea, FocusAreaMeta> = {
  programming: {
    id: 'programming',
    label: 'Software Development & Programming',
    shortLabel: 'Programming',
    description: 'Master desktop, web, and mobile development using Python, JavaScript, Java, and C#.',
    color: '#38bdf8',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgLight: 'bg-sky-500/10',
    prospectusModuleCode: 'PROG511, PROG621, INT621, PROG631',
    electiveStream: 'Stream A: Programming',
    careerPaths: ['Application Programmer', 'Python Developer', 'Web Developer', 'Software Engineer', 'Games Developer']
  },
  networking: {
    id: 'networking',
    label: 'Network Engineering & Infrastructure',
    shortLabel: 'Networking',
    description: 'Configure and secure networks, resolve troubleshooting, calculate VLSM, and manage servers.',
    color: '#34d399',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgLight: 'bg-emerald-500/10',
    prospectusModuleCode: 'NET511, NET621, NET631, SRV600',
    electiveStream: 'Stream B: Network Engineering',
    careerPaths: ['Network Engineer', 'Network Administrator', 'Systems Administrator', 'Server Administrator', 'IT Technician']
  },
  business_analysis: {
    id: 'business_analysis',
    label: 'Business & Systems Analysis',
    shortLabel: 'Business Analysis',
    description: 'Bridge business needs with IT systems, model processes with BPMN, formulate INVEST user stories, and optimize ROI.',
    color: '#fbbf24',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgLight: 'bg-amber-500/10',
    prospectusModuleCode: 'BUA621, BUA631, BUA632, INF511',
    electiveStream: 'Stream C: Business Analysis',
    careerPaths: ['Business Analyst', 'Systems Analyst', 'Business Advisor', 'Risk Analyst', 'IT Project Coordinator']
  },
  cybersecurity: {
    id: 'cybersecurity',
    label: 'Cyber Security & Forensics',
    shortLabel: 'Cyber Security',
    description: 'Defend organizational systems, audit logs, detect brute-force incursions, and enforce cryptographic standards.',
    color: '#f87171',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgLight: 'bg-rose-500/10',
    prospectusModuleCode: 'SEC700, FOR500 (IBM/Fortinet Badge)',
    electiveStream: 'Core Faculty Badge',
    careerPaths: ['Cyber Security Specialist', 'Computer Forensics Investigator', 'Cybercrime Prevention Analyst']
  },
  emerging_tech: {
    id: 'emerging_tech',
    label: 'Cloud & Emerging Technologies',
    shortLabel: 'Cloud & AI',
    description: 'Build serverless microservices, IoT streams, data science pipelines, and intelligent automated workflows.',
    color: '#a78bfa',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgLight: 'bg-purple-500/10',
    prospectusModuleCode: 'CLD600, DAT500 (AWS Academy Badge)',
    electiveStream: 'Core Faculty Badge',
    careerPaths: ['Cloud Developer', 'Machine Learning Engineer', 'Data Analyst', 'DevOps Specialist']
  },
  databases: {
    id: 'databases',
    label: 'Relational Database Systems & SQL',
    shortLabel: 'SQL & DB',
    description: 'Design schemas, execute ANSI SQL queries, normalize to 3NF, and manage relational constraints.',
    color: '#3FA7B8',
    textColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    bgLight: 'bg-teal-500/10',
    prospectusModuleCode: 'DBS621 / DBS600 (Oracle Academy)',
    electiveStream: 'Core Faculty Requirement',
    careerPaths: ['Database Administrator', 'Data Engineer', 'SQL Developer']
  },
  mathematics: {
    id: 'mathematics',
    label: 'Mathematics & Formal Logic for IT',
    shortLabel: 'Math for IT',
    description: 'Master discrete boolean logic, set theory, linear algebra, and probability distributions.',
    color: '#f59e0b',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgLight: 'bg-amber-500/10',
    prospectusModuleCode: 'MAT511 / MAT512 (BSc IT Core)',
    electiveStream: 'BSc IT Foundational Core',
    careerPaths: ['Algorithm Engineer', 'Data Scientist', 'Cryptographer']
  }
};

export const FRAMEWORK_TRACKS: FrameworkTrack[] = [
  {
    id: 'fw-fastapi',
    name: 'FastAPI & Async Python 3.12',
    focusArea: 'programming',
    category: 'Backend Microservices',
    partnerBadge: 'Oracle & Python Institute',
    level: 'Specialist',
    totalXp: 320,
    badgeIcon: '⚡',
    description: 'Learn modern Python asynchronous web APIs, Pydantic v2 data models, and dependency injection patterns mapped to DIT Programming Stream.',
    lessons: [
      {
        id: 'fa-1',
        title: 'Asynchronous Handlers & Pydantic Validation',
        duration: '10 min',
        xp: 80,
        completed: false,
        conceptSummary: 'FastAPI leverages Python type hints and Starlette ASGI to offer high concurrency with automated OpenAPI documentation and validation schemas.',
        codeSnippet: `from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Richfield Student API")

class ModuleRegistration(BaseModel):
    student_id: str = Field(..., pattern=r"^RGI\\d{6}$")
    module_code: str = Field(..., example="PROG631")
    semester: int = Field(ge=1, le=2)

@app.post("/register")
async def register_student(reg: ModuleRegistration):
    return {"status": "enrolled", "student": reg.student_id, "module": reg.module_code}`,
        keyPoints: [
          'Automatic request serialization and 422 Unprocessable Entity error payloads.',
          'Native async/await handling allows high I/O throughput without blocking worker threads.',
          'Built-in Interactive Swagger UI at /docs.'
        ],
        quiz: {
          question: 'What happens when a client sends invalid JSON types to a FastAPI route with a Pydantic model?',
          options: [
            'FastAPI returns a 422 Unprocessable Entity with exact field errors automatically',
            'The server crashes with an unhandled TypeError 500',
            'It ignores the wrong fields and sets them to None',
            'It asks the client to resend via a 302 redirect'
          ],
          correctAnswer: 0,
          explanation: 'FastAPI automatically catches validation errors from Pydantic and returns a standard HTTP 422 with structured field path and error messages.'
        }
      },
      {
        id: 'fa-2',
        title: 'Dependency Injection for Database & Security',
        duration: '12 min',
        xp: 100,
        completed: false,
        conceptSummary: 'FastAPI provides a declarative dependency injection mechanism (Depends) to handle authentication scopes, DB session lifecycles, and tenant resolution.',
        codeSnippet: `from fastapi.security import OAuth2PasswordBearer
from fastapi import Security, Depends, HTTPException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_student(token: str = Depends(oauth2_scheme)):
    user = verify_jwt_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    return user

@app.get("/student/transcript")
async def read_transcript(student = Depends(get_current_student)):
    return {"qualification": "Diploma in IT", "student": student.name, "creditsEarned": 240}`,
        keyPoints: [
          'Dependencies can be reused across hundreds of routes without boilerplate.',
          'Supports yield dependencies for resource cleanup (e.g. database transactions).',
          'Nested dependencies resolve automatically in dependency graphs.'
        ],
        quiz: {
          question: 'Why is Depends() preferred in FastAPI for database sessions?',
          options: [
            'It manages the lifecycle of the connection, ensuring sessions open and close reliably per request',
            'It makes database calls 100x faster than standard SQL',
            'It eliminates the need for passwords in connection strings',
            'It converts SQL queries into TypeScript types automatically'
          ],
          correctAnswer: 0,
          explanation: 'Depends() ensures standard setup and teardown via Python context managers, closing database connections even if request handlers raise exceptions.'
        }
      }
    ]
  },
  {
    id: 'fw-cisco-automation',
    name: 'Cisco PyATS & Netmiko Network Automation',
    focusArea: 'networking',
    category: 'Software-Defined Networking',
    partnerBadge: 'Cisco Networking Academy',
    level: 'Specialist',
    totalXp: 300,
    badgeIcon: '🌐',
    description: 'Transition from manual CLI configurations to declarative network automation using Python, Netmiko, and Cisco IOS-XE APIs in DIT Network Stream.',
    lessons: [
      {
        id: 'cisco-1',
        title: 'Declarative Switch & Router Provisioning with Netmiko',
        duration: '10 min',
        xp: 80,
        completed: false,
        conceptSummary: 'Netmiko provides an SSH abstraction layer for multi-vendor network hardware, allowing automated VLAN provisioning across Richfield campus switches.',
        codeSnippet: `from netmiko import ConnectHandler

campus_core_switch = {
    'device_type': 'cisco_ios',
    'host': '192.168.10.1',
    'username': 'admin',
    'password': 'CampusSecretPassword'
}

net_connect = ConnectHandler(**campus_core_switch)
commands = [
    'vlan 200', 
    'name RICHFIELD_LAB_VLAN', 
    'exit'
]
output = net_connect.send_config_set(commands)
print(output)`,
        keyPoints: [
          'Automates batch configuration updates across switches simultaneously.',
          'Eliminates manual CLI typing mistakes and configuration drift.',
          'Enables automated network compliance audits.'
        ],
        quiz: {
          question: 'What is a primary risk of manual network configuration that Netmiko automation eliminates?',
          options: [
            'Human configuration drift and syntax discrepancies across campus core switches',
            'Overheating of switch power supplies',
            'Fiber optic cable attenuation over long distances',
            'Physical port pin oxidation'
          ],
          correctAnswer: 0,
          explanation: 'Automating network configurations with tested code templates guarantees consistency across devices, preventing drift and outages caused by typing typos.'
        }
      }
    ]
  },
  {
    id: 'fw-aws-cdk',
    name: 'AWS Cloud Development Kit (CDK)',
    focusArea: 'emerging_tech',
    category: 'Cloud Infrastructure as Code',
    partnerBadge: 'AWS Academy Partner',
    level: 'Specialist',
    totalXp: 340,
    badgeIcon: '☁️',
    description: 'Define cloud infrastructure using TypeScript constructs, directly fulfilling Richfield AWS Academy Cloud Computing requirements.',
    lessons: [
      {
        id: 'aws-1',
        title: 'Synthesizing Serverless Stacks with TypeScript',
        duration: '15 min',
        xp: 90,
        completed: false,
        conceptSummary: 'AWS CDK compiles high-level constructs into AWS CloudFormation templates, providing compile-time type safety for VPCs, Lambdas, and DynamoDB tables.',
        codeSnippet: `import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class RichfieldDevQuestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const leaderboardTable = new dynamodb.Table(this, 'LeaderboardTable', {
      partitionKey: { name: 'studentId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }
}`,
        keyPoints: [
          'Object-oriented constructs with default enterprise security best practices.',
          'IDE autocompletion and type checking for cloud infrastructure parameters.',
          'Reusable custom construct libraries for team standardizations.'
        ],
        quiz: {
          question: 'How does AWS CDK differ from raw AWS CloudFormation JSON/YAML?',
          options: [
            'CDK lets you use expressive programming languages (TypeScript/Python) with loops, type safety, and abstractions',
            'CDK only works on local laptops and cannot deploy to real AWS regions',
            'CloudFormation does not support AWS Lambda',
            'CDK requires a paid license from Amazon'
          ],
          correctAnswer: 0,
          explanation: 'CDK empowers developers with standard software engineering capabilities (classes, inheritance, type checking, tests) that synthesize down into CloudFormation.'
        }
      }
    ]
  },
  {
    id: 'fw-bpmn-analysis',
    name: 'BPMN 2.0 & Agile Process Modeling',
    focusArea: 'business_analysis',
    category: 'Enterprise Architecture & Requirements',
    partnerBadge: 'CIMA & Business Analysis Stream',
    level: 'Foundational',
    totalXp: 280,
    badgeIcon: '📊',
    description: 'Learn standard Business Process Model and Notation (BPMN 2.0) to document workflows, swimlanes, and automated business decisions.',
    lessons: [
      {
        id: 'bpmn-1',
        title: 'Swimlanes, Exclusive Gateways (XOR) & Event Triggers',
        duration: '10 min',
        xp: 70,
        completed: false,
        conceptSummary: 'BPMN 2.0 provides an unambiguous graphical notation for end-to-end business workflows, bridging business stakeholders and software engineers.',
        codeSnippet: `// Example BPMN Execution Rule Definition
const StudentBursaryApplication = {
  startEvent: "ApplicationReceived",
  exclusiveGateway: (applicant) => {
    if (applicant.matricAverage >= 75) {
      return "DirectFacultyMeritAward";
    } else {
      return "MeansTestReviewCommittee";
    }
  },
  endEvent: "AwardNotificationDispatched"
};`,
        keyPoints: [
          'Swimlanes allocate organizational responsibility across departments.',
          'Gateways dictate branching logic (Exclusive XOR, Parallel AND, Inclusive OR).',
          'Reduces requirements misunderstanding between analysts and developers.'
        ],
        quiz: {
          question: 'In BPMN 2.0, what does an Exclusive Gateway (XOR) represent?',
          options: [
            'A decision point where exactly ONE outbound sequence flow is followed based on a condition',
            'A parallel fork where every outbound branch executes concurrently',
            'A message broker queue for async messages',
            'A database table transaction boundary'
          ],
          correctAnswer: 0,
          explanation: 'An Exclusive Gateway routes token flow down exactly one mutually exclusive branch.'
        }
      }
    ]
  }
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'b-initiate',
    name: 'Richfield Matriculant',
    description: 'Enrolled in an accredited Richfield IT qualification and passed your first coding lab.',
    icon: '🎓',
    category: 'General',
    isUnlocked: true,
    unlockedAt: '2026-10-18'
  },
  {
    id: 'b-prog-master',
    name: 'Programming Stream Artisan',
    description: 'Demonstrated mastery in core programming, algorithms, and OOP data structures.',
    icon: '💻',
    category: 'programming',
    partner: 'Oracle Academy Member',
    isUnlocked: true,
    unlockedAt: '2026-10-20'
  },
  {
    id: 'b-cisco-net',
    name: 'Cisco NetAcad Specialist',
    description: 'Mastered subnetting, routing tables, and interface security policies.',
    icon: '🌐',
    category: 'networking',
    partner: 'CISCO Networking Academy',
    isUnlocked: false
  },
  {
    id: 'b-cloud-architect',
    name: 'AWS Academy Cloud Badge',
    description: 'Synthesized serverless cloud pipelines and DynamoDB constructs.',
    icon: '☁️',
    category: 'emerging_tech',
    partner: 'AWS Academy Partner',
    isUnlocked: false
  },
  {
    id: 'b-ba-analyst',
    name: 'CIMA Process Modeler',
    description: 'Formulated INVEST user stories and optimized enterprise BPMN workflows.',
    icon: '📈',
    category: 'business_analysis',
    partner: 'CIMA / SAQA 88322',
    isUnlocked: false
  },
  {
    id: 'b-sec-shield',
    name: 'IBM Cyber Defense Badge',
    description: 'Detected intrusion anomalies and fortified log forensic architectures.',
    icon: '🛡️',
    category: 'cybersecurity',
    partner: 'IBM Skills Academy Partner',
    isUnlocked: false
  },
  {
    id: 'b-streak-week',
    name: '7-Day Study Streak',
    description: 'Maintained consecutive Richfield professional development activity for a full week.',
    icon: '🔥',
    category: 'General',
    isUnlocked: true,
    unlockedAt: '2026-10-24'
  }
];
