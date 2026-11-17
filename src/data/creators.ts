export interface CreatorEducation {
  institution: string;
  period: string;
  detail: string;
}

export interface CreatorAchievement {
  title: string;
  issuer: string;
  detail?: string;
}

export interface CreatorExperience {
  role: string;
  organization: string;
  period: string;
  bullets: string[];
}

export interface CreatorProfile {
  id: string;
  indexCode: string;
  name: string;
  monogram: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  pdfUrl: string;
  pdfFilename: string;
  about: string;
  keyHighlight: string;
  languages: string[];
  skills: string[];
  education: CreatorEducation[];
  achievements: CreatorAchievement[];
  experience: CreatorExperience[];
}

export const CREATORS: CreatorProfile[] = [
  {
    id: 'calvin',
    indexCode: 'CREATOR 01',
    name: 'Calvin Pratama',
    monogram: 'CP',
    headline: 'High School Student · Multilingual Achiever · 4x Competition Medalist',
    location: 'Bandung, Indonesia',
    email: 'calvinpratama12301@gmail.com',
    phone: '+62 81386073445',
    pdfUrl: '/assets/aistudio/CV_Calvin_Pratama_76313734.pdf',
    pdfFilename: 'CV_Calvin_Pratama.pdf',
    about:
      'High school student with experience in organizational activities, leadership, and event coordination. Possesses strong communication skills, effective time management, and a high level of curiosity. Able to work professionally, stay organized, and adapt quickly in dynamic environments, with a strong willingness to learn and contribute positively.',
    keyHighlight: 'Gold Medalist Mathematics Olympiad (OSP 2025) · Mandarin Subtitle Translator & OSIS Coordinator',
    languages: [
      'Indonesian (Native / Primary)',
      'English (Professional & Academic)',
      'Mandarin (Translation & Localization)',
    ],
    skills: [
      'Foreign Languages',
      'Communication',
      'Critical Thinking',
      'Problem-Solving',
      'Aegisub (Subtitling & Timing)',
      'Canva (Design & Visual Assets)',
      'Google Workspace',
      'Microsoft Office',
    ],
    education: [
      {
        institution: 'SMP BPK PENABUR HOLIS',
        period: '2021 – 2024 · Junior High School',
        detail:
          'Graduated with strong academic performance, actively developing foundational analytical capabilities, bilingual fluency, and problem-solving discipline.',
      },
      {
        institution: 'SDK BPK PENABUR HOLIS',
        period: '2015 – 2021 · Elementary School',
        detail:
          'Completed primary education with high distinction, laying early roots in mathematics, linguistics, and collaborative school activities.',
      },
    ],
    achievements: [
      {
        title: 'Gold Medalist — Mathematics Olympiad (OSP)',
        issuer: 'Olimpiade Sains Plus (OSP) · 2025',
      },
      {
        title: 'Silver Medalist — Mechatronics Competition',
        issuer: 'Parahyangan Catholic University (UNPAR) · 2025',
      },
      {
        title: 'Silver Medalist — YCMS Competition',
        issuer: 'Youth Creative & Mathematics / Science (YCMS) · 2025',
      },
      {
        title: 'Silver Medalist — Business Plan Competition',
        issuer: 'Parahyangan Catholic University (UNPAR) · 2025',
      },
    ],
    experience: [
      {
        role: 'Translator Edufair China',
        organization: 'Edufair China Exhibition & Exchange',
        period: 'Project Term',
        bullets: [
          'Created video content ideas and managed production schedules to ensure consistent and timely uploads.',
          'Supervised and coordinated the end-to-end content creation process, from shooting to publishing.',
          'Facilitated cross-cultural linguistic bridging and international education communication between Indonesian and Chinese educational partners.',
        ],
      },
      {
        role: 'Project Manager — School Social Media Account',
        organization: 'School Media & Public Relations Division',
        period: '2025 – NOW',
        bullets: [
          'Created video content ideas and managed production schedules to ensure consistent and timely uploads.',
          'Supervised and coordinated the end-to-end content creation process, from shooting to publishing.',
          'Drove audience engagement, content consistency, and high production quality across digital school platforms.',
        ],
      },
      {
        role: 'Freelancer Subtitle Specialist',
        organization: 'Independent Professional Freelance',
        period: '2025 – NOW',
        bullets: [
          'Translate Chinese subtitles into Indonesian while maintaining contextual accuracy, cultural nuances, and natural language flow.',
          'Edit and synchronize subtitles using professional subtitling software such as Aegisub.',
          'Ensure strict adherence to timecode constraints, reading speed thresholds, and line-break readability.',
        ],
      },
      {
        role: 'Koordinator OSIS Bidang 6',
        organization: 'OSIS SION',
        period: '2024 – NOW',
        bullets: [
          'Served as Koordinator OSIS Bidang 6, leading division members in planning and executing school-wide events and student welfare initiatives.',
          'Coordinated cross-divisional logistics, scheduling, member alignment, and communications with teachers and stakeholders.',
          'Demonstrated high adaptability, organizational discipline, and proactive conflict resolution under dynamic deadlines.',
        ],
      },
    ],
  },
  {
    id: 'elianna',
    indexCode: 'CREATOR 02',
    name: 'Elianna Gabriella Tanalin',
    monogram: 'EG',
    headline: 'Robotics & Automation Enthusiast · Professional Photographer',
    location: 'Bandung, Indonesia',
    email: 'eliannagabriellacds@gmail.com',
    phone: '+6281997891277',
    pdfUrl: '/assets/aistudio/ELIANNA_CV2_eec70318.pdf',
    pdfFilename: 'ELIANNA_CV2.pdf',
    about:
      'A high school student passionate about electrical engineering, automation, and emerging technologies. Experienced in hands-on technical projects and competitions, with a creative perspective shaped by photography and art. Dedicated to continuous learning, problem-solving, and developing innovative solutions that can create meaningful impact.',
    keyHighlight: '2nd Winner Mechatronics Product Design (UNPAR 2025) · Mandarin HSK 5 & Freelance Photographer',
    languages: [
      'Mandarin / 普通话 (HSK 5 / 汉语水平考试五级)',
      'English (B2+)',
    ],
    skills: [
      'Adobe Photoshop',
      'Adobe Lightroom',
      'Photography',
      'Videography',
      'Graphic Design',
      'Art',
      'Ultrasonic Sensor Automation',
      '3D Modeling',
    ],
    education: [
      {
        institution: 'Natural Sciences Major, SMA BPK PENABUR HOLIS',
        period: '2024 – Present',
        detail:
          'Active in Photography & Videography Extracurricular (visual storytelling) and PSP Project: AidKit+ (graphic design and 3D modeling blending technical precision with artistic expression).',
      },
    ],
    achievements: [
      {
        title: 'Mechatronics Product Design Competition — 2nd Winner',
        issuer: 'Parahyangan University, Bandung · 2025',
        detail:
          'Designed and prototyped a smart city lighting system using ultrasonic sensors to detect vehicle traffic density in real time, automatically adjusting street lighting to improve energy efficiency and optimize urban infrastructure.',
      },
    ],
    experience: [
      {
        role: 'Freelancer — MC Content Creation Team, Photographer',
        organization: 'Independent Creative Practice',
        period: 'July 2025 – Present',
        bullets: [
          'Capture moments during wedding and betrothal ceremonies.',
          'Document key highlights of events for content creation purposes.',
          'Work closely with the team to deliver photos that fit the event’s storytelling and atmosphere.',
        ],
      },
      {
        role: 'Freelancer — Event Photographer',
        organization: 'Independent Creative Practice',
        period: 'July 2024 – Present',
        bullets: [
          'Capture and document key moments, activities, and interactions throughout various events.',
          'Communicate with clients to understand expectations, event requirements, and preferred photography style.',
          'Select and edit photographs to create a cohesive visual collection reflecting each event’s atmosphere.',
        ],
      },
      {
        role: 'English & Documentation',
        organization: 'OSIS Hebron',
        period: '2025 – 2026',
        bullets: [
          'Supported cultural and artistic activities through event documentation, photography, and English-language communication.',
        ],
      },
      {
        role: 'Committee Member',
        organization: 'Anti-Bullying Committee',
        period: '2022 – 2023',
        bullets: [
          'Promoted kindness, raised awareness, and supported affected students.',
        ],
      },
    ],
  },
  {
    id: 'vyonne',
    indexCode: 'CREATOR 03',
    name: 'Vyonne Calista Youvanka',
    monogram: 'VC',
    headline: 'Mandarin Communicator · Cultural Ambassador · Competition Finalist',
    location: 'Bandung, Indonesia (THI 1, blok E2 no. 18)',
    email: 'youvankavyonne@gmail.com',
    phone: '+62 895-2896-5782',
    pdfUrl: '/assets/aistudio/0-2256825825015997840_09bbef6b.pdf',
    pdfFilename: 'CV_Vyonne_Calista_Youvanka.pdf',
    about:
      'Senior high school student with strong Mandarin communication skills and a genuine passion for language learning and teaching. Achieved 2nd Place in the 2025 Chinese Bridge Competition and earned a fully funded study camp opportunity in China. Experienced in leadership roles, public speaking, and teamwork through various school organizations. Patient, responsible, and enthusiastic about creating a positive and engaging learning environment.',
    keyHighlight: '2nd Place Chinese Bridge West Java 2025 & Fully Funded Chengdu Study Camp · PBMUN 2026 Honorable Mention',
    languages: [
      'English (Fluent)',
      'Chinese / Mandarin (B1, studying HSK 5)',
    ],
    skills: [
      'Chinese Speaking',
      'Problem Solving',
      'Social Media Marketing',
      'Marketing Strategy',
      'Great Communication',
      'Teamwork',
      'Editing',
    ],
    education: [
      {
        institution: 'SMPK BPK PENABUR HOLIS',
        period: '2021 – 2024',
        detail: 'Consistently stayed in the top academic class rankings (2021–2024).',
      },
      {
        institution: 'SDK BPK PENABUR HOLIS',
        period: '2015 – 2021',
        detail: 'Primary education.',
      },
      {
        institution: 'TK SUTOMO 1 MEDAN',
        period: '2013 – 2015',
        detail: 'Early education.',
      },
    ],
    achievements: [
      {
        title: 'Chinese Bridge West Java 2025 — 2nd Place',
        issuer: 'Chinese Bridge Competition · 2025',
        detail: 'Awarded a fully funded Study Camp in Chengdu, China after placing in the Chinese Bridge competition.',
      },
      {
        title: 'Maestro FM — Top 2 Finalist',
        issuer: 'Maestro FM Broadcasting & Public Speaking · 2025',
        detail: 'Selected as a Top 2 finalist out of ~40 contestants for excellence in broadcasting, content creation, and public speaking.',
      },
      {
        title: 'UKDW National English Content Creation Competition — 2nd Place',
        issuer: 'Universitas Kristen Duta Wacana · 2025',
      },
      {
        title: 'PBMUN 2026 — Honorable Mention Delegation',
        issuer: 'Model United Nations · 2026',
        detail: 'Awarded for excellence in diplomacy and negotiation.',
      },
      {
        title: 'UGM Mathematics and Science Olympic — Gold (Math) & Silver (Science)',
        issuer: 'Universitas Gadjah Mada · 2021–2024',
      },
      {
        title: 'School Ambassador & Top Class Ranking',
        issuer: 'BPK PENABUR Network · 2021–2024',
        detail: 'Handpicked as the sole representative from school for the Penabur network; promoted school programs.',
      },
    ],
    experience: [
      {
        role: 'Member & Head of Culture Division',
        organization: 'Student Councils',
        period: '2024 – 2026',
        bullets: [
          'Led cultural initiatives, coordinated cross-grade activities, and represented student cultural programming.',
        ],
      },
      {
        role: 'Head Division of Substance',
        organization: 'Ecobloom — Environment Organization',
        period: '2026',
        bullets: [
          'Directed environmental campaign substance, educational outreach, and sustainability messaging.',
        ],
      },
      {
        role: 'Actress & Scriptwriter',
        organization: 'Elite-Pro Mandarin',
        period: '2026',
        bullets: [
          'Wrote Mandarin scripts and performed in language-immersion and cultural media productions.',
        ],
      },
      {
        role: 'Volunteer Organizer',
        organization: 'Orphanage Donation Initiative',
        period: '2024',
        bullets: [
          'Organized community fundraising and logistical coordination for local orphanage donations.',
        ],
      },
      {
        role: 'Church Organizer (Usher)',
        organization: 'Church Community Service',
        period: '2023 – 2024',
        bullets: [
          'Welcomed attendees and coordinated weekly congregation hospitality.',
        ],
      },
    ],
  },
];
