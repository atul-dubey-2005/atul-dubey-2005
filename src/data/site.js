export const PROFILE = {
  name: 'Atul Dubey', role: 'Software Developer & Full-Stack Engineer',
  email: 'atuldubey0214@gmail.com', location: 'Mumbai, India',
  github: 'https://github.com/atul-dubey-2005',
  linkedin: 'https://www.linkedin.com/in/atul-dubey-059197320',
  avatar: 'https://raw.githubusercontent.com/atul-dubey-2005/atul-dubey-2005/main/IMG_20251225_232151.jpg',
  resumes: {
    light: 'https://raw.githubusercontent.com/atul-dubey-2005/atul-dubey-2005/main/atuldubeylightthemeresume.pdf',
    dark: 'https://raw.githubusercontent.com/atul-dubey-2005/atul-dubey-2005/main/atuldubeydarkthemeresume.pdf'
  }
};
export const NAV = [
  ['about','About'],['skills','Expertise'],['projects','Work'],['experience','Journey'],['activity','Activity'],['contact','Contact']
];
export const PROJECTS = [
 {id:1,title:'AI Fraud App Detection',type:'AI & Machine Learning',category:'data',status:'live',description:'An intelligent system designed to detect and flag potentially fraudulent or malicious applications using machine learning and anomaly detection.',tech:['Python','Machine Learning','Data Processing','Railway'],live:'https://ai-fraud-app-detection-production.up.railway.app',source:null,icon:'ShieldCheck',art:'fraud',color:'lime',featured:true},
 {id:2,title:'AuraFitness',type:'Health & Fitness',category:'web',status:'live',description:'A fast, browser-native fitness experience rebuilt from legacy ASP.NET Web Forms, featuring interactive tracking and local storage.',tech:['HTML5','CSS3','JavaScript','localStorage'],live:'https://aura-fitness-mauve.vercel.app/',source:'https://github.com/atul-dubey-2005/AuraFitness',icon:'Activity',art:'fitness',color:'pink',featured:true},
 {id:3,title:'Pro Scientific Calculator',type:'Creative Web Application',category:'web',status:'live',description:'Desktop-grade scientific calculations with isolated sessions, a custom expression parser, memory registers and calculation history.',tech:['JavaScript','CSS','Session Storage'],live:'https://professional-calculator-rosy.vercel.app/',source:'https://github.com/atul-dubey-2005/Professional-Calculator',icon:'Calculator',art:'calculator',color:'violet',featured:true},
 {id:4,title:'Amazon E-Commerce Clone',type:'Full-Stack Commerce',category:'web',status:'source',description:'A complete commerce platform with JWT authentication, product filters, shopping cart, order management and an admin dashboard.',tech:['React','Express','PostgreSQL','JWT'],source:'https://github.com/atul-dubey-2005/amazon_clone',icon:'ShoppingBag',art:'commerce',color:'orange'},
 {id:5,title:'CivicPulse',type:'Civic Technology',category:'web',status:'source',description:'A civic issue reporting and verification system designed for routing reports, managing assignments, and resolving workflows.',tech:['React','Spring Boot','PostgreSQL','FastAPI'],source:'https://github.com/atul-dubey-2005/CivicPulse',icon:'Building2',art:'civic',color:'cyan'},
 {id:6,title:'DepositShield',type:'Fintech & Security',category:'web',status:'source',description:'Mobile-first rental inspections, tamper-evident records, SHA-256 finalization and dual-party signing workflows.',tech:['Next.js','Express','PostgreSQL','Docker'],source:'https://github.com/atul-dubey-2005/DepositShield',icon:'LockKeyhole',art:'shield',color:'mint'},
 {id:7,title:'E-Sports Tournament Portal',type:'Gaming Platform',category:'web',status:'source',description:'A competitive gaming portal for tournament registration, team management, match schedules, brackets and leaderboards.',tech:['React','Node.js','Express'],source:'https://github.com/atul-dubey-2005/e-sports-tournament-portal',icon:'Gamepad2',art:'gaming',color:'pink'},
 {id:8,title:'SmartBook Campus',type:'EdTech Platform',category:'web',status:'source',description:'A campus-wide digital library that helps students discover, borrow, exchange and share academic books and resources.',tech:['Node.js','Express','MongoDB'],source:'https://github.com/atul-dubey-2005/SmartBook_Campus',icon:'BookOpen',art:'book',color:'blue'}
];
export const SKILLS = [
 {title:'Languages & Logic',icon:'Code2',color:'lime',description:'Solid fundamentals across programming paradigms.',items:['Java / Enterprise OOP','Python','C++','JavaScript (ES6+)','R Programming']},
 {title:'Frontend Engineering',icon:'PanelsTopLeft',color:'violet',description:'Responsive, expressive and accessible web experiences.',items:['React.js','HTML5 / CSS3','Responsive Design','REST APIs','JSON']},
 {title:'Backend & Data',icon:'Database',color:'cyan',description:'Reliable application architecture and data flows.',items:['Node.js','MySQL / PostgreSQL','JDBC / DAO','Authentication','Spring Boot']},
 {title:'Cloud & Tooling',icon:'Cloud',color:'orange',description:'The tools that take an idea into production.',items:['Git / GitHub','Vercel','Railway','Postman','VS Code / IntelliJ']},
 {title:'Intelligence & Analytics',icon:'ChartNoAxesCombined',color:'pink',description:'Turning data into impactful decisions.',items:['Pandas / NumPy','Matplotlib','R Shiny','ML Fundamentals','Dashboards']},
 {title:'Design & Workflow',icon:'Figma',color:'blue',description:'From early concepts to maintainable releases.',items:['Jira','UI Prototyping','Canva','Android Studio','Cisco Packet Tracer']}
];
export const SERVICES = [
 {number:'01',icon:'Layers3',title:'Full-Stack Products',description:'From robust Java / MySQL backends to engaging responsive web interfaces.'},
 {number:'02',icon:'ChartSpline',title:'Data Experiences',description:'Visual analytics and interactive dashboards that bring clarity to complex data.'},
 {number:'03',icon:'Workflow',title:'APIs & Integrations',description:'Well-structured endpoints, secure flows, database logic and system integration.'},
 {number:'04',icon:'PenTool',title:'UI Engineering',description:'Thoughtful micro-interactions, rapid prototypes, and polished user experiences.'}
];
export const JOURNEY = [
 {date:'2025 · SEP — OCT',title:'Exam Proctor Intern',subtitle:'EnFuse Solutions · Mumbai',type:'Experience',description:'Supported secure online assessments, verified identities, coordinated exam operations and handled candidate escalations.'},
 {date:'2025 · DEC',title:'Ethical Hacking & ML Workshops',subtitle:'Techfest · IIT Bombay',type:'Workshop',description:'Hands-on exposure to vulnerability assessment, defensive security, supervised and unsupervised learning, and feature engineering.'},
 {date:'2024 — 2027',title:'B.Sc. Information Technology',subtitle:'Thakur College of Science and Commerce · Mumbai',type:'Education',description:'Pursuing software engineering, data structures, databases, web architectures and object-oriented design.'},
 {date:'2024',title:'Higher Secondary · 85%',subtitle:'Shripati International Public School',type:'Education',description:'Science, mathematics and physics.'},
 {date:'2022',title:'Secondary School · 87.6%',subtitle:"St. Xavier's Inter College",type:'Education',description:'Secondary school education.'}
];
export const CERTIFICATIONS = [
 {icon:'BrainCircuit',title:'AI & Security',items:['Introduction to AI Concept · Microsoft','AI Fluency: Framework & Foundations · Anthropic','Ethical Hacking · IIT Bombay'],color:'violet'},
 {icon:'Satellite',title:'Geospatial · ISRO',items:['Urban Environment Modeling','Basics of RS / GIS / GNSS','Natural Resource Management','Ecological Modeling & Simulation'],color:'cyan'},
 {icon:'Award',title:'Programming · Simplilearn',items:['Java Programming for Beginners','Learn Advanced C++'],color:'orange'}
];
export const FAQ = [
 ['Are you open to internships or freelance work?','Yes. I am open to software development roles, internships and interesting freelance collaborations. Get in touch using the form below.'],
 ['How quickly do you usually respond?','I aim to reply to professional messages within 24–48 hours on weekdays.'],
 ['What technologies do you work with?','I work with Java and relational databases for backend-heavy applications, React and modern JavaScript for web UI, and Python and R for data-driven work.'],
 ['Can I explore the source code?','Absolutely. Use the GitHub links in the projects section to see the available public repositories.']
];
