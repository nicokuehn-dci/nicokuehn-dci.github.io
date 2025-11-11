
import React, { useState, useEffect, useRef, useMemo } from 'react';
// Dashboard3D removed — placeholder module deleted to simplify the build and deployment.

declare const html2pdf: any;

// --- TYPE DEFINITIONS ---
interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  github: string;
  githubLink: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  date: string;
  location: string;
  courses: string[];
  description: string;
}

interface WorkExperienceItem {
  role: string;
  company: string;
  date: string;
  location: string;
  description: string;
  responsibilities: string[];
  subRole?: string;
}

interface ProjectItem {
  name: string;
  date: string;
  description: string;
}

interface LanguageItem {
  name: string;
  proficiency: string;
}

interface ResumeData {
  name: string;
  title: string;
  summary: string;
  profilePictureUrl: string;
  contact: ContactInfo;
  education: EducationItem[];
  workExperience: WorkExperienceItem[];
  skills: string[];
  personalProjects: ProjectItem[];
  languages: LanguageItem[];
  interests: string[];
}

interface SkillDetail {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  experience: number; // in years
}

interface SkillsData {
  technical: SkillDetail[];
  soft: SkillDetail[];
  tools: SkillDetail[];
}

interface ShowcaseProject {
  name: string;
  date: string;
  description: string;
  link: string;
}


// --- SVG ICONS ---
const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className}>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// --- LIGHTNING ICON (accent used in Skills) ---
const LightningIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="#FACC15" />
    </svg>
);

const LeftArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const RightArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

// --- LOGO ICONS (replace emoji with crisp SVG logos) ---
const PythonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path fill="#3776AB" d="M12 2.5c-1.5 0-2.9.5-3.9 1.4-.3.3-.4.7-.4 1.1v2.1h6.8v-.1c0-1.2-.9-2.2-2-2.2H9.7c-.6 0-1 .5-1 1v.5h4.6c1.4 0 2.6 1.1 2.6 2.4v1.8c0 1.4-1.2 2.6-2.6 2.6H8.3c-.6 0-1 .4-1 1v1.8c0 .4.2.8.5 1.1 1 1 2.4 1.6 3.9 1.6 4 0 6-2.1 6-5.9V8.4C18 4.6 16 2.5 12 2.5z"/>
        <path fill="#FFD43B" d="M12 21.5c1.5 0 2.9-.5 3.9-1.4.3-.3.4-.7.4-1.1v-2.1H9.5v.1c0 1.2.9 2.2 2 2.2h1.4c.6 0 1-.5 1-1v-.5H9.5c-1.4 0-2.6-1.1-2.6-2.4V12c0-1.4 1.2-2.6 2.6-2.6h6.3c.6 0 1-.4 1-1V6.1c0-.4-.2-.8-.5-1.1-1-1-2.4-1.6-3.9-1.6-4 0-6 2.1-6 5.9v6.6c0 3.8 2 5.9 6 5.9z"/>
    </svg>
);

const DjangoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#092E20" />
        <path d="M6 9h2v6H6zM9.5 9h2v6h-2zM13 9h6v1h-5v2h4v1h-4v2h5v1h-6z" fill="#7CC244" />
    </svg>
);

const ReactLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 256 256" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <g fill="none" stroke="#61DAFB" strokeWidth="12">
            <ellipse cx="128" cy="128" rx="88" ry="40" transform="rotate(0 128 128)" />
            <ellipse cx="128" cy="128" rx="88" ry="40" transform="rotate(60 128 128)" />
            <ellipse cx="128" cy="128" rx="88" ry="40" transform="rotate(120 128 128)" />
        </g>
        <circle cx="128" cy="128" r="18" fill="#61DAFB" />
    </svg>
);

const DockerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M3 13h2v2H3zM6 13h2v2H6zM9 13h2v2H9zM12 13h2v2h-2z" fill="#0db7ed" />
        <path d="M21 14.3c-.5-.2-1.1-.3-1.6-.3-.9 0-1.8.2-2.6.6-.4.2-.8.3-1.2.3H14c-.8 0-1.6-.3-2.3-.8-.6-.5-1.2-.8-2-.8H7c-.8 0-1.6.3-2.3.8C3 15 2.2 15.3 1.6 15.3V17c0 .6.4 1 1 1h17.4c.2 0 .6-.4.6-1.1v-1.7c0-.6-.1-1.1-.6-1.2z" fill="#0db7ed"/>
    </svg>
);

const GitIconSmall: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M12 2l3 3-2 2 4 4-3 3-4-4-2 2L2 12l10-10z" fill="#F05032" />
    </svg>
);

const JsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect width="24" height="24" rx="3" fill="#F7DF1E" />
        <path d="M9.3 17.5c.9 1.4 1.9 2.4 3.9 2.4 1.9 0 3.1-.9 3.1-2.5 0-1.7-1.3-2.2-2.9-3-1.2-.6-2-1-2-1.7 0-.6.5-1 1.2-1 .7 0 1.2.2 1.6.8l1.6-1c-.8-1.2-1.9-1.6-3.5-1.6-2 0-3.4 1.1-3.4 2.8 0 1.8 1 2.6 2.7 3.4 1.1.6 1.8 1 1.8 1.8 0 .6-.5 1-1.3 1-.9 0-1.5-.3-2.1-.9zM16.6 17.5c-.4.9-1 1.5-2.1 1.5-1.1 0-1.8-.5-1.8-1.5 0-1 .6-1.3 2.1-1.9 1.1-.4 1.8-.8 1.8-1.9 0-.9-.7-1.6-1.8-1.6-1 0-1.7.4-2.2 1.3l1.5.9c.2-.5.7-.8 1.1-.8.6 0 1 .4 1 1 0 .8-.6 1.2-2 1.8-1.1.4-1.8.8-1.8 1.9 0 1.1.9 1.8 2.7 1.8 1.5 0 2.4-.6 2.7-1.5l-1.1-.6z" fill="#000" />
    </svg>
);

const ToolIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M2 21l21-9L11 2 2 21z" fill="#9CA3AF" />
    </svg>
);

// --- RESUME DATA ---
const resumeData: ResumeData = {
    name: "nico_kuehn",
    title: "Python Backend Programmer / Musician / Producer",
    summary: "20 years of experience in Musicproduction in the Box + Outgear Musicproduction",
    // use GitHub avatar URL so the image loads without requiring a local file
    profilePictureUrl: "https://avatars.githubusercontent.com/nicokuehn-dci",
    contact: { email: "nico.code.evo@gmail.com", phone: "first get in contact", location: "Aue-Bad Schlema, DE", github: "github.com/nicokuehn-dci", githubLink: "https://github.com/nicokuehn-dci?tab=repositories" },
    education: [{ degree: "Python Backend Programmer", institution: "DCI - Digital Career Institute", date: "03/2025 - 03/2026", location: "Berlin", courses: ["Python Backend Programming"], description: "Accomplishing a one-year-full-time training including Python Basics, Databases, Django Framework, APIs & Cloud Services" }],
    workExperience: [
        { role: "Security Guard", company: "Pond Security", date: "04/2016 - 04/2017", location: "Kassel (Calden)", description: "Expert in highly sensitive security areas", subRole: "Site Manager Old Kassel Airport (Migrationcenter)", responsibilities: ["Create daily work plans for security personnel", "Monitor the premises Solve and fix problems", "Supervise and enforce house rules", "daily contact and talk with government", "teaching new staff members", "applying established organizational framework to different locations (Migration-Centers)", "providing hands-on training at those locations."] },
        { role: "Security Guard", company: "private Security", date: "01/2011 - 03/2016", location: "Munich", description: "Bayern Kasserne München", subRole: "Achievements/Tasks", responsibilities: ["Clerk / Recorder", "Patrol Duty", "Negotiation in Problem Cases", "Patrolling", "Interactions with authorities, when necessary"] }
    ],
    skills: ["Soundengineering", "Songwriting", "Music-production", "Rest", "Next", "React - Framework", "API Usage and Integration", "CI-CD", "unittest", "pytest", "smoketest", "Javascript", "Http", "OOP", "Databases (Postgres, DBeaver)", "AI Poweruser (AI Agents)", "handling explizit/difficult Situations"],
    personalProjects: [{ name: "Finegrind & Benson", date: "01/2010 - 10/2025", description: "Music related project (Housemusic)" }, { name: "Nick de Nitro", date: "01/2008 - 11/2025", description: "Music related (Techno) project" }],
    languages: [{ name: "English", proficiency: "Full Professional Proficiency" }, { name: "German", proficiency: "Native or Bilingual Proficiency" }],
    interests: ["Musicproduction", "programming", "Songwriting", "Creativity"]
};

const skillsData: SkillsData = {
    technical: [
        { name: 'Python', proficiency: 'Advanced', experience: 1 },
        { name: 'Django', proficiency: 'Intermediate', experience: 0.5 },
        { name: 'Databases (Postgres, DBeaver)', proficiency: 'Intermediate', experience: 1 },
        { name: 'REST APIs', proficiency: 'Advanced', experience: 1 },
        { name: 'JavaScript', proficiency: 'Intermediate', experience: 1 },
        { name: 'React', proficiency: 'Beginner', experience: 0.5 },
    ],
        soft: [
            { name: 'Problem Solving', proficiency: 'Advanced', experience: 10 },
            { name: 'Communication', proficiency: 'Expert', experience: 10 },
            { name: 'Teamwork', proficiency: 'Expert', experience: 10 },
            { name: 'Adaptability', proficiency: 'Advanced', experience: 10 },
        ],
        tools: [
            { name: 'Git & GitHub', proficiency: 'Advanced', experience: 1 },
            { name: 'Docker', proficiency: 'Beginner', experience: 0.5 },
            { name: 'Pytest', proficiency: 'Intermediate', experience: 1 },
            { name: 'AI Poweruser (AI Agents)', proficiency: 'Expert', experience: 2 },
    ]
};

// Taglines per skill (used in compact cards)
const skillTaglines: Record<string, string> = {
    'Problem Solving': 'Resolve complex issues, debugging, root-cause analysis and system design.',
    'Communication': 'Clear technical writing and stakeholder communication across teams.',
    'Teamwork': 'Collaborative development, code reviews, and mentoring teammates.',
    'Adaptability': 'Quickly learn new tools, frameworks and adjust to shifting priorities.',
    'Git & GitHub': 'Branching strategies, PR reviews, and CI integration.',
    'Docker': 'Containerizing apps for consistent dev and deployment environments.',
    'Pytest': 'Unit and integration testing with fixtures and parametric tests.',
    'AI Poweruser (AI Agents)': 'Building and orchestrating AI agents to automate workflows.',
};

// --- UI HELPER COMPONENTS ---
const SkillTag: React.FC<{ skill: string }> = ({ skill }) => (
    <span 
        className="shimmer-zone pulse-highlight inline-block bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full transform hover:-translate-y-1 hover:scale-105 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 cursor-default"
        style={{
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 0 8px rgba(255,255,255,0.2), 0 0 16px rgba(255,255,255,0.1)'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 12px rgba(255,255,255,0.4), 0 0 24px rgba(255,255,255,0.2), 0 0 36px rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 8px rgba(255,255,255,0.2), 0 0 16px rgba(255,255,255,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        }}
    >{skill}</span>
);

const InterestTag: React.FC<{ interest: string }> = ({ interest }) => (
    <span 
        className="shimmer-zone pulse-highlight inline-block bg-transparent border border-gray-300 text-gray-600 dark:bg-transparent dark:border-gray-600 dark:text-gray-400 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full transform hover:-translate-y-1 transition-transform duration-200 cursor-default"
        style={{
            boxShadow: '0 0 8px rgba(255,255,255,0.15), 0 0 16px rgba(255,255,255,0.08)'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 12px rgba(255,255,255,0.3), 0 0 24px rgba(255,255,255,0.15), 0 0 36px rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 8px rgba(255,255,255,0.15), 0 0 16px rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = '';
        }}
    >{interest}</span>
);

const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="inline-block font-serif text-2xl font-bold text-white mb-4 py-2 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">{title}</h3>
        {children}
    </div>
);

// --- PAGE COMPONENTS ---

const ResumePage: React.FC<{ data: ResumeData, onDownloadPdf: () => void, onOpenContactForm: () => void }> = ({ data, onDownloadPdf, onOpenContactForm }) => (
    <>
        <div className="about-contact-page p-4 md:p-6 min-h-[50vh]">
            <div className="max-w-6xl mx-auto">
                {/* Header with profile */}
                <div className="about-header-glow mb-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-shrink-0">
                            <img src={data.profilePictureUrl} alt={data.name} className="profile-pic w-44 h-44 rounded-full rounded-3d object-cover border-4 border-gray-200 dark:border-gray-700 shadow-lg transform hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h1 className="content-title-3d text-6xl md:text-7xl mb-2" style={{
                                letterSpacing: '0.05em'
                            }}>- nico_kuehn -</h1>
                            <h2 className="content-title-3d text-2xl mb-2">{data.title}</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">{data.summary}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left Column - Education & Experience */}
                    <div className="md:col-span-2 space-y-4">
                        {/* Education Card */}
                        <div className="lounge-card">
                            <h2 className="content-title-3d mb-3">Education</h2>
                            {data.education.map((edu, index) => (
                                <div key={index} className="spotlight-zone border-glow-zone mb-4 p-4 rounded-lg">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="content-title-3d text-xl">{edu.degree}</h3>
                                        <p className="text-sm font-light text-gray-400">{edu.location}</p>
                                    </div>
                                    <p className="font-medium text-gray-300">{edu.institution}</p>
                                    <p className="text-sm text-gray-400 mb-2">{edu.date}</p>
                                    <p className="text-gray-300 mb-1 italic font-semibold">Courses</p>
                                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                                        <li className="text-highlight-zone">{edu.courses.join(', ')}</li>
                                        <li className="text-highlight-zone">{edu.description}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Work Experience Card */}
                        <div className="lounge-card">
                            <h2 className="content-title-3d mb-3">Work Experience</h2>
                            {data.workExperience.map((job, index) => (
                                <div key={index} className="spotlight-zone border-glow-zone mb-4 p-4 bg-neutral-800/40 rounded-lg border border-gray-600/30 shadow-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="content-title-3d text-xl">{job.role}</h3>
                                            <p className="font-semibold text-gray-300">{job.company}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 pl-4">
                                            <p className="font-medium text-gray-400">{job.date}</p>
                                            <p className="text-sm font-light text-gray-500">{job.location}</p>
                                        </div>
                                    </div>
                                    <p className="italic text-gray-400 my-2">{job.description}</p>
                                    <p className="font-semibold text-gray-300">{job.subRole}</p>
                                    <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1 marker:text-gray-500">
                                        {job.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="sticky top-8 space-y-4">
                            {/* Contact Card */}
                            <div className="lounge-card">
                                <h3 className="content-title-3d mb-4 text-xl">Contact</h3>
                                <button onClick={onOpenContactForm} className="interactive-zone shimmer-zone flex items-center mb-3 text-gray-300 hover:text-white transition-colors w-full text-left rounded-lg p-2">
                                    <MailIcon className="w-5 h-5 mr-3 text-gray-500" />
                                    <span className="text-highlight-zone">{data.contact.email}</span>
                                </button>
                                <div className="interactive-zone flex items-center mb-3 text-gray-300 rounded-lg p-2">
                                    <PhoneIcon className="w-5 h-5 mr-3 text-gray-500" />
                                    <span className="text-highlight-zone">{data.contact.phone}</span>
                                </div>
                                <div className="interactive-zone flex items-center mb-3 text-gray-300 rounded-lg p-2">
                                    <LocationIcon className="w-5 h-5 mr-3 text-gray-500" />
                                    <span className="text-highlight-zone">{data.contact.location}</span>
                                </div>
                                <a href={data.contact.githubLink} target="_blank" rel="noopener noreferrer" className="interactive-zone shimmer-zone flex items-center text-gray-300 hover:text-white transition-colors rounded-lg p-2">
                                    <GithubIcon className="w-5 h-5 mr-3 text-gray-500" />
                                    <span className="text-highlight-zone">{data.contact.github}</span>
                                </a>
                                <button onClick={onDownloadPdf} className="interactive-zone shimmer-zone border-glow-zone flex items-center mt-4 w-full text-left text-gray-300 hover:text-white transition-colors rounded-lg p-2">
                                    <DownloadIcon className="w-5 h-5 mr-3 text-gray-500" />
                                    <span className="text-highlight-zone">Download as PDF</span>
                                </button>
                            </div>

                            {/* Skills Card */}
                            <div className="lounge-card">
                                <h3 className="content-title-3d mb-4 text-xl">Skills</h3>
                                <div className="flex flex-wrap">{data.skills.map((skill, index) => <SkillTag key={index} skill={skill} />)}</div>
                            </div>

                            {/* Personal Projects Card */}
                            <div className="lounge-card">
                                <h3 className="content-title-3d mb-4 text-xl">Personal Projects</h3>
                                {data.personalProjects.map((project, index) => (
                                    <div key={index} className="interactive-zone border-glow-zone mb-4 p-3 rounded-lg">
                                        <h4 className="font-semibold text-gray-300 text-highlight-zone">
                                            {project.name} <span className="text-sm font-light text-gray-500">({project.date})</span>
                                        </h4>
                                        <p className="text-gray-400 text-sm">{project.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Languages Card */}
                            <div className="lounge-card">
                                <h3 className="content-title-3d mb-4 text-xl">Languages</h3>
                                {data.languages.map((lang, index) => (
                                    <div key={index} className="interactive-zone spotlight-zone mb-2 p-3 rounded-lg">
                                        <p className="font-semibold text-gray-300 text-highlight-zone">{lang.name}</p>
                                        <p className="text-sm text-gray-400">{lang.proficiency}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Interests Card */}
                            <div className="lounge-card">
                                <h3 className="content-title-3d mb-4 text-xl">Interests</h3>
                                <div className="flex flex-wrap">{data.interests.map((interest, index) => <InterestTag key={index} interest={interest} />)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

const PlaceholderPage: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 min-h-[80vh] text-center bg-white dark:bg-gray-800 transition-colors duration-500">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{children}</p>
    </div>
);

// My Creative Work Page
const MyCreativeWorkPage: React.FC = () => (
    <div className="creative-work-page p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="content-title-3d text-6xl md:text-7xl mb-2" style={{
                    letterSpacing: '0.05em'
                }}>
                    - my_creative_work -
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    House & Techno music production spanning over a decade. Releases, collaborations, and live performances.
                </p>
            </div>

            {/* Main Content Card */}
            <div className="content-card-3d max-w-4xl mx-auto">
                <div className="content-card-header mb-8">
                    <h2 className="content-title-glow text-3xl">🎵 Listen on Spotify</h2>
                    <div className="title-underline-glow"></div>
                </div>

                <p className="content-text-3d text-lg mb-8 leading-relaxed">
                    Explore my discography featuring house and techno productions. From deep grooves to driving beats, 
                    each track represents years of passion and dedication to electronic music.
                </p>

                {/* Spotify Embed */}
                <div className="spotify-embed-container rounded-2xl overflow-hidden shadow-2xl border-4 border-white/40 dark:border-gray-600/40 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <iframe 
                        data-testid="embed-iframe" 
                        style={{ borderRadius: '16px' }} 
                        src="https://open.spotify.com/embed/artist/3xtYO8Za3Cs51PZVapJU9G?utm_source=generator&theme=0" 
                        width="100%" 
                        height="380" 
                        frameBorder="0" 
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                    />
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50">
                        <h3 className="content-title-3d text-xl mb-3">🎧 Genres</h3>
                        <p className="text-gray-700 dark:text-gray-300">House, Techno, Deep House, Tech House</p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50">
                        <h3 className="content-title-3d text-xl mb-3">📅 Active Since</h3>
                        <p className="text-gray-700 dark:text-gray-300">2010 – Present (15+ years)</p>
                    </div>
                </div>

                {/* Projects */}
                <div className="mt-4 p-6 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600">
                    <h3 className="content-title-3d text-2xl mb-4">Featured Projects</h3>
                    <ul className="space-y-3">
                        <li className="interactive-zone spotlight-zone border-glow-zone flex items-start gap-3 p-4 rounded-lg">
                            <span className="text-2xl">🎹</span>
                            <div>
                                <strong className="text-gray-900 dark:text-white text-highlight-zone">Finegrind & Benson</strong>
                                <p className="text-gray-600 dark:text-gray-400">House music project – Production, releases and live sets</p>
                            </div>
                        </li>
                        <li className="interactive-zone spotlight-zone border-glow-zone flex items-start gap-3 p-4 rounded-lg">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <strong className="text-gray-900 dark:text-white text-highlight-zone">Nick de Nitro</strong>
                                <p className="text-gray-600 dark:text-gray-400">Techno music project – Releases and collaborations</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const AboutContactPage: React.FC<{ data: ResumeData, onOpenContactForm: () => void }> = ({ data, onOpenContactForm }) => {
    const [showLocationPopup, setShowLocationPopup] = useState(false);

    return (
    <div className="about-contact-page p-4 md:p-6 min-h-[70vh] transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
            {/* Glowing header */}
            <div className="about-header-glow mb-6 text-center">
                <h1 className="content-title-3d text-6xl md:text-7xl mb-4" style={{
                    letterSpacing: '0.05em'
                }}>- about_me -</h1>
                <div className="content-title-3d text-2xl">Get to know me better</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                {/* Profile Card - 3D Floating */}
                <div className="profile-card-3d">
                    <div className="profile-card-inner">
                        <div className="profile-image-container">
                            <div className="profile-glow-ring"></div>
                            <img src={data.profilePictureUrl} alt={data.name} className="profile-img-3d" />
                            <div className="profile-shimmer"></div>
                        </div>
                        <h2 className="profile-name-3d">{data.name}</h2>
                        <p className="profile-title-3d">{data.title}</p>
                        
                        {/* Contact info with glowing icons */}
                        <div className="contact-list-3d">
                            <div className="contact-item-glow">
                                <div className="contact-icon-wrapper">
                                    <MailIcon className="contact-icon" />
                                </div>
                                <button 
                                    onClick={onOpenContactForm} 
                                    className="contact-link" 
                                    type="button"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    aria-label="Open contact form"
                                >
                                    get in contact
                                </button>
                            </div>
                            <div className="contact-item-glow">
                                <div className="contact-icon-wrapper">
                                    <PhoneIcon className="contact-icon" />
                                </div>
                                <button 
                                    onClick={onOpenContactForm} 
                                    className="contact-link" 
                                    type="button"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    aria-label="Open contact form"
                                >
                                    get in contact first
                                </button>
                            </div>
                            <div className="contact-item-glow">
                                <div className="contact-icon-wrapper">
                                    <LocationIcon className="contact-icon" />
                                </div>
                                                                                                                                                          <button 
                                    onClick={() => setShowLocationPopup(true)}
                                    className="contact-link" 
                                    type="button"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    aria-label="View location information"
                                >
                                    {data.contact.location}
                                </button>
                            </div>
                            <div className="contact-item-glow">
                                <div className="contact-icon-wrapper">
                                    <GithubIcon className="contact-icon" />
                                </div>
                                <a href={data.contact.githubLink} target="_blank" rel="noreferrer noopener" className="contact-link">{data.contact.github}</a>
                            </div>
                        </div>
                        
                        {/* CTA Button with 3D effect */}
                        <div className="mt-6" style={{ position: 'relative', zIndex: 10 }}>
                            <button 
                                onClick={onOpenContactForm} 
                                className="cta-button-3d" 
                                style={{ position: 'relative', zIndex: 10 }}
                                type="button"
                                aria-label="Open contact form"
                            >
                                <span className="cta-text">Email me</span>
                                <span className="cta-glow"></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Cards - 3D Panels */}
                <div className="lg:col-span-2 space-y-4">
                    {/* About Section */}
                    <div className="lounge-card">
                        <div className="content-card-header">
                            <h3 className="content-title-glow">About me</h3>
                            <div className="title-underline-glow"></div>
                        </div>
                        <p className="content-text-3d">{data.summary} I combine music production, backend development knowledge and a pragmatic approach to deliver working solutions. I'm passionate about building reliable systems and creating music that moves people.</p>
                    </div>

                    {/* Career Goals */}
                    <div className="lounge-card">
                        <div className="content-card-header">
                            <h4 className="content-title-glow">Career goals</h4>
                            <div className="title-underline-glow"></div>
                        </div>
                        <ul className="goals-list-3d">
                            <li className="goal-item-glow">
                                <span className="goal-bullet"></span>
                                <span>Grow as a backend engineer working with Django and modern cloud tooling.</span>
                            </li>
                            <li className="goal-item-glow">
                                <span className="goal-bullet"></span>
                                <span>Ship production-ready APIs and improve automation/CI workflows.</span>
                            </li>
                            <li className="goal-item-glow">
                                <span className="goal-bullet"></span>
                                <span>Continue releasing music and collaborate with other creators.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Availability */}
                    <div className="lounge-card availability-card-highlight">
                        <div className="content-card-header">
                            <h4 className="content-title-glow">Availability</h4>
                            <div className="title-underline-glow"></div>
                        </div>
                        <p className="content-text-3d">Open to freelance or contract backend roles, collaborations on audio projects, and mentoring opportunities. Reach out via email for enquiries.</p>
                        <div className="availability-badge-3d">
                            <span className="badge-pulse"></span>
                            <span className="badge-text">Available for hire</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Location Info Popup */}
        {showLocationPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowLocationPopup(false)}>
                <div 
                    className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fadeIn" 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        border: '2px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4), 0 20px 60px rgba(0,0,0,0.5)'
                    }}
                >
                    <button 
                        onClick={() => setShowLocationPopup(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold transition-all duration-300"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                    
                    <h2 
                        className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6"
                        style={{
                            textShadow: '0 0 10px rgba(255,255,255,0.3)'
                        }}
                    >
                        📍 Aue-Bad Schlema, Germany
                    </h2>
                    
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🏔️ Location</h3>
                            <p>Aue-Bad Schlema is a town in the Erzgebirgskreis district, in Saxony, Germany. It's located in the picturesque Ore Mountains (Erzgebirge) region.</p>
                        </div>
                        
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">ℹ️ About</h3>
                            <p>The town was formed in 2019 through the merger of Aue and Bad Schlema. It's known for its rich mining history and beautiful mountain landscapes.</p>
                        </div>
                        
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">🌍 Region</h3>
                            <p><strong>State:</strong> Saxony (Sachsen)<br/>
                            <strong>District:</strong> Erzgebirgskreis<br/>
                            <strong>Area:</strong> Ore Mountains Region</p>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <a 
                                href="https://www.google.com/maps/place/Aue-Bad+Schlema,+Germany"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-center"
                            >
                                🗺️ View on Maps
                            </a>
                            <a 
                                href="https://www.google.com/search?q=aue+bad+schlema"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-center"
                            >
                                🔍 Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};

const proficiencyStyles: { [key in SkillDetail['proficiency']]: { width: string; color: string } } = {
    Beginner: { width: '25%', color: 'bg-orange-500' },
    Intermediate: { width: '50%', color: 'bg-blue-500' },
    Advanced: { width: '75%', color: 'bg-indigo-600' },
    Expert: { width: '100%', color: 'bg-green-600' },
};

// Shared gradient map for proficiency levels (used by discs and stats panel)
const proficiencyGradientMap: Record<SkillDetail['proficiency'], { start: string; end: string; shadow: string }> = {
    Expert: { start: '#16a34a', end: '#22c55e', shadow: 'rgba(22,163,74,0.3)' },
    Advanced: { start: '#4f46e5', end: '#6366f1', shadow: 'rgba(79,70,229,0.3)' },
    Intermediate: { start: '#3b82f6', end: '#60a5fa', shadow: 'rgba(59,130,246,0.3)' },
    Beginner: { start: '#f97316', end: '#fb923c', shadow: 'rgba(249,115,22,0.3)' },
};

const getSkillEmoji = (name: string) => {
    const key = name.toLowerCase();
    const cls = 'w-6 h-6';
    if (key.includes('python')) return <PythonIcon className={cls} />;
    if (key.includes('django')) return <DjangoIcon className={cls} />;
    if (key.includes('react')) return <ReactLogoIcon className={cls} />;
    if (key.includes('docker')) return <DockerIcon className={cls} />;
    if (key.includes('git')) return <GitIconSmall className={cls} />;
    if (key.includes('javascript')) return <JsIcon className={cls} />;
    return <ToolIcon className={cls} />;
}

const SkillDetailItem: React.FC<{ skill: SkillDetail; selected?: boolean }> = ({ skill, selected }) => {
    const { width } = proficiencyStyles[skill.proficiency];
    const fillClass = skill.proficiency === 'Expert' ? 'gradient-green' : skill.proficiency === 'Advanced' ? 'gradient-blue' : skill.proficiency === 'Intermediate' ? 'gradient-yellow' : 'gradient-red';
    const ref = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);

    // handle simple mouse tilt effect (respect prefers-reduced-motion)
    useEffect(() => {
        const el = ref.current;
        const inner = innerRef.current;
        if (!el || !inner) return;
        const prefersReduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduce) return; // skip interactive motion for reduced-motion users
        let frame: number | null = null;
        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;
            const px = (x / rect.width) - 0.5;
            const py = (y / rect.height) - 0.5;
            const rotY = px * 6; // degrees
            const rotX = -py * 6;
            if (frame) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                if (inner) inner.style.transform = `translateZ(20px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });
        };
        const onLeave = () => {
            if (frame) cancelAnimationFrame(frame);
            if (inner) inner.style.transform = `translateZ(0) rotateX(0) rotateY(0)`;
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div ref={ref} className={`skill-card skill-card--interactive ${selected ? 'selected' : ''} ${typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : ''}`}>
            <div ref={innerRef} className="skill-inner">
                <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                        <div className="skill-icon" aria-hidden>{getSkillEmoji(skill.name)}</div>
                        <h4 className="skill-title">{skill.name}</h4>
                    </div>
                    <div className="text-right">
                        <div className={`skill-badge ${skill.proficiency === 'Expert' ? 'bg-emerald-100 text-emerald-800' : skill.proficiency === 'Advanced' ? 'bg-sky-100 text-indigo-800' : skill.proficiency === 'Intermediate' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{skill.proficiency}</div>
                        <div className="skill-meta">{skill.experience} {skill.experience === 1 ? 'year' : 'years'}</div>
                    </div>
                </div>
                <p className="skill-tagline mb-2">{skillTaglines[skill.name] ?? 'A concise one-line highlight about this skill — key frameworks, usage or context.'}</p>
                <div className="skill-progress">
                    <div className={`fill ${fillClass}`} style={{ width }}></div>
                </div>
            </div>
        </div>
    );
};

// Interactive circular disc component that displays a ring for proficiency
const SkillDisc: React.FC<{ skill: SkillDetail; size?: number; onSelect: (name: string) => void; selected?: boolean }> = ({ skill, size = 210, onSelect, selected }) => {
    const stroke = 18; // stronger ring
    const radius = (size / 2) - stroke; // account for stroke width
    const circumference = 2 * Math.PI * radius;
    const pct = proficiencyStyles[skill.proficiency] ? parseInt(proficiencyStyles[skill.proficiency].width) : 50;
    const offset = circumference * (1 - pct / 100);
    // nicer color gradients per proficiency
    // Steampunk palette: warm bronze and patina accents
    const gradientMap: Record<string, { start: string; end: string; shadow: string }> = {
        Expert: { start: '#b87333', end: '#d4a373', shadow: 'rgba(184,115,51,0.28)' }, // bright bronze -> warm gold
        Advanced: { start: '#8b5e3c', end: '#c09a62', shadow: 'rgba(140,94,60,0.26)' }, // deep bronze -> brass
        Intermediate: { start: '#c9a66b', end: '#7b5a36', shadow: 'rgba(201,166,107,0.22)' }, // antique brass -> dark patina
        Beginner: { start: '#7b4b2a', end: '#b66a3a', shadow: 'rgba(123,75,42,0.22)' }, // dark brown -> copper
    };
    const map = gradientMap[skill.proficiency] ?? gradientMap['Intermediate'];
    const color = map.start;
    const secondStop = map.end;
    const [showTip, setShowTip] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(skill.name);
        }
    };

    // Calculate animation speed based on proficiency - higher proficiency = faster pulse
    const pulseSpeed = 4 - (pct / 33); // Range: ~1s (Expert 100%) to ~3s (Beginner 25%)

    return (
        <div
            className={`skill-disc ${selected ? 'highlight' : ''} ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => { setShowTip(true); setIsHovered(true); }}
            onMouseLeave={() => { setShowTip(false); setIsHovered(false); }}
            onClick={() => onSelect(skill.name)}
            title={skill.name}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            onKeyDown={handleKey}
            style={{
                animation: `disc-pulse-orange ${pulseSpeed}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 0.5}s` // Slight random delay for organic feel
            }}
        >
            {/* lightning accent for energy/visual flair */}
            <div className="disc-lightning-wrap" aria-hidden>
                <LightningIcon className="disc-lightning" />
            </div>

            {/* Percentage overlay */}
            <div className="disc-percentage" style={{ opacity: isHovered || selected ? 1 : 0 }}>
                {pct}%
            </div>

            {/* Experience badge */}
            <div className="disc-experience-badge" style={{ opacity: isHovered || selected ? 1 : 0 }}>
                {skill.experience}y
            </div>

            <svg viewBox={`0 0 ${size} ${size}`}>
                    <defs>
                    <linearGradient id={`ringGrad-${skill.name.replace(/\s+/g,'')}`} x1="0%" y1="0%" x2="100%" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={secondStop} stopOpacity="0.96" />
                    </linearGradient>
                    <radialGradient id={`diskGloss-${skill.name.replace(/\s+/g,'')}`} cx="30%" cy="25%" r="60%">
                        <stop offset="0%" stopColor="#302c2cff" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#fff" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                    </radialGradient>
                    {/* Animated shimmer for hover */}
                    <linearGradient id={`shimmer-${skill.name.replace(/\s+/g,'')}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <g transform={`translate(0,0)`}> 
                    <circle className="ring-bg" cx={size/2} cy={size/2} r={radius} />
                    <circle className="ring" cx={size/2} cy={size/2} r={radius} stroke={`url(#ringGrad-${skill.name.replace(/\s+/g,'')})`} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.2,.9,.2,1), transform .35s', filter: `drop-shadow(0 18px 36px ${map.shadow})` }} />
                    <circle className="inner" cx={size/2} cy={size/2} r={radius * 0.68} />
                    {/* Shimmer overlay on hover */}
                    {isHovered && <circle className="shimmer-overlay" cx={size/2} cy={size/2} r={radius * 0.68} fill={`url(#shimmer-${skill.name.replace(/\s+/g,'')})`} opacity="0.4" />}
                    <circle className="gloss" cx={size/2.45} cy={size/3.35} r={radius * 0.5} />
                </g>
            </svg>
            <div className="label"><span className="proficiency-only">{skill.proficiency}</span></div>
            <div className="disc-caption" aria-hidden>{skill.name}</div>
            <div className="tooltip" role="status" aria-hidden={!showTip} style={{ opacity: showTip ? 1 : 0 }}>{skill.name} — {skill.experience} {skill.experience === 1 ? 'year' : 'years'}</div>
        </div>
    )
}


const SkillsDeepDivePage: React.FC<{ data: SkillsData }> = ({ data }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [sortMode, setSortMode] = useState<'default'|'proficiency'|'experience'|'name'>('default');
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-slideshow stats data
    const statsSlides = [
        { 
            label: 'GitHub Profile', 
            value: 'nicokuehn-dci', 
            unit: 'Active Developer',
            subtitle: 'Building with Python, JavaScript & React',
            icon: '👨‍💻'
        },
        { 
            label: 'Project Portfolio', 
            value: '25+', 
            unit: 'Projects Completed',
            subtitle: '500+ commits across repositories',
            icon: '📦'
        },
        { 
            label: 'Code Volume', 
            value: '1200+', 
            unit: 'Lines of Code',
            subtitle: '12 active repos, 6 deployed apps',
            icon: '💻'
        },
        { 
            label: 'Skill Mastery', 
            value: '37%', 
            unit: 'Overall Proficiency',
            subtitle: 'Averaged across all technical skills',
            icon: '📊'
        },
        { 
            label: 'Tech Stack', 
            value: '15', 
            unit: 'Technologies',
            subtitle: '8 frameworks & 180+ hours coded',
            icon: '🛠️'
        },
        { 
            label: 'Primary Languages', 
            value: 'Py • JS • TS', 
            unit: 'Core Stack',
            subtitle: 'Python, JavaScript, TypeScript expertise',
            icon: '⚡'
        },
        { 
            label: 'Deployment', 
            value: '6', 
            unit: 'Apps Live',
            subtitle: 'Production-ready applications',
            icon: '🌐'
        }
    ];

    // Auto-advance slideshow every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % statsSlides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [statsSlides.length]);

    const sortedTech = useMemo(() => {
        const base = [...data.technical];
        if (sortMode === 'default') return base;
        if (sortMode === 'name') return base.sort((a, b) => a.name.localeCompare(b.name));
        if (sortMode === 'experience') return base.sort((a, b) => b.experience - a.experience);
        if (sortMode === 'proficiency') {
            const order = { 'Expert': 3, 'Advanced': 2, 'Intermediate': 1, 'Beginner': 0 } as Record<string, number>;
            return base.sort((a, b) => (order[b.proficiency] || 0) - (order[a.proficiency] || 0));
        }
        return base;
    }, [data.technical, sortMode]);

    return (
        <div className="about-contact-page p-4 md:p-6 min-h-[70vh] transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                {/* Glowing header - About Me style */}
                <div className="about-header-glow mb-6 text-center">
                    <h1 className="content-title-3d text-6xl md:text-7xl mb-2" style={{
                        letterSpacing: '0.05em'
                    }}>- skills_deep_dive -</h1>
                    <div className="content-title-3d text-2xl">Explore my technical expertise</div>
                </div>

                {/* Dynamic Commercial Stats Banner - Grid Layout with Sliding Ticker */}
                <div 
                    className="content-card-3d mb-4 overflow-hidden commercial-banner" 
                    style={{ 
                        position: 'relative', 
                        minHeight: '160px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 280px',
                        gap: '1rem',
                        padding: '1rem',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        const banner = document.querySelector('.commercial-banner');
                        if (banner) banner.classList.add('banner-hovered');
                        const glow = document.querySelector('.banner-glow-bg') as HTMLElement;
                        if (glow) {
                            glow.style.background = 'radial-gradient(ellipse at center, rgba(100,200,255,0.35), rgba(255,255,255,0.15) 40%, transparent 70%)';
                            glow.style.filter = 'blur(50px)';
                        }
                        e.currentTarget.style.transform = 'scale(1.01)';
                        e.currentTarget.style.boxShadow = '0 0 60px rgba(255,255,255,0.4), 0 0 100px rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        const banner = document.querySelector('.commercial-banner');
                        if (banner) banner.classList.remove('banner-hovered');
                        const glow = document.querySelector('.banner-glow-bg') as HTMLElement;
                        if (glow) {
                            glow.style.background = 'radial-gradient(ellipse at center, rgba(100,200,255,0.2), rgba(255,255,255,0.1) 40%, transparent 70%)';
                            glow.style.filter = 'blur(40px)';
                        }
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '';
                    }}
                    onClick={(e) => {
                        // Create ripple effect
                        const ripple = document.createElement('div');
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        ripple.style.position = 'absolute';
                        ripple.style.left = x + 'px';
                        ripple.style.top = y + 'px';
                        ripple.style.width = '10px';
                        ripple.style.height = '10px';
                        ripple.style.borderRadius = '50%';
                        ripple.style.background = 'rgba(255,255,255,0.6)';
                        ripple.style.transform = 'scale(0)';
                        ripple.style.animation = 'ripple-expand 0.8s ease-out';
                        ripple.style.pointerEvents = 'none';
                        ripple.style.zIndex = '999';
                        
                        e.currentTarget.appendChild(ripple);
                        setTimeout(() => ripple.remove(), 800);
                    }}
                >
                    {/* Pulsating Background Light */}
                    <div className="banner-glow-bg" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120%',
                        height: '140%',
                        background: 'radial-gradient(ellipse at center, rgba(100,200,255,0.2), rgba(255,255,255,0.1) 40%, transparent 70%)',
                        animation: 'pulse-bg-glow 3s ease-in-out infinite',
                        pointerEvents: 'none',
                        zIndex: 0,
                        filter: 'blur(40px)',
                        transition: 'all 0.5s ease'
                    }} />

                    {/* Animated Particles */}
                    {[...Array(8)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.6)',
                            boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float-particle-${(i % 3) + 1} ${3 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                            pointerEvents: 'none',
                            zIndex: 1
                        }} />
                    ))}

                    {/* Animated Corner Glows */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle at top left, rgba(255,255,255,0.2), transparent 60%)',
                        animation: 'corner-glow-1 5s ease-in-out infinite',
                        pointerEvents: 'none',
                        zIndex: 0,
                        filter: 'blur(20px)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.2), transparent 60%)',
                        animation: 'corner-glow-2 5s ease-in-out infinite',
                        animationDelay: '2.5s',
                        pointerEvents: 'none',
                        zIndex: 0,
                        filter: 'blur(20px)'
                    }} />
                    {/* Left Side - 3D Surrounding Stats Grid */}
                    <div style={{ 
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gap: '1rem',
                        alignItems: 'center',
                        zIndex: 1
                    }}>
                        {/* Top Row Stats */}
                        <div className="stat-3d-card playful-card" 
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
                                borderRadius: '16px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                                transformStyle: 'preserve-3d',
                                animation: 'float-subtle-1 6s ease-in-out infinite'
                            }}
                            onClick={(e) => {
                                e.currentTarget.style.animation = 'bounce-playful 0.6s ease';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(100,200,255,0.3), rgba(50,150,255,0.2))';
                                e.currentTarget.style.border = '2px solid rgba(100,200,255,0.6)';
                                setTimeout(() => {
                                    e.currentTarget.style.animation = 'float-subtle-1 6s ease-in-out infinite';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))';
                                    e.currentTarget.style.border = '2px solid rgba(255,255,255,0.3)';
                                }, 600);
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(8deg) rotateX(-3deg) translateZ(25px) scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5), 0 0 50px rgba(100,200,255,0.6), inset 0 1px 0 rgba(255,255,255,0.6)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))';
                                e.currentTarget.style.border = '2px solid rgba(100,200,255,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))';
                                e.currentTarget.style.border = '2px solid rgba(255,255,255,0.3)';
                            }}
                        >
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: '#ffffff',
                                textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.5)',
                                marginBottom: '0.25rem',
                                transition: 'all 0.3s ease'
                            }}>🚀 0.5+</div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: '#d0d0d0',
                                textShadow: '0 0 8px rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.3s ease'
                            }}>Years</div>
                        </div>

                        <div className="stat-3d-card playful-card" 
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
                                borderRadius: '16px',
                                border: '2px solid rgba(255,255,255,0.25)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                                transformStyle: 'preserve-3d',
                                animation: 'float-subtle-2 7s ease-in-out infinite'
                            }}
                            onClick={(e) => {
                                e.currentTarget.style.animation = 'wiggle 0.6s ease';
                                setTimeout(() => {
                                    e.currentTarget.style.animation = 'float-subtle-2 7s ease-in-out infinite';
                                }, 600);
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(3deg) translateZ(25px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.6)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.13))';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))';
                            }}
                        >
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: '#ffffff',
                                textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.5)',
                                marginBottom: '0.25rem',
                                transition: 'all 0.3s ease'
                            }}>📦 25+</div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: '#d0d0d0',
                                textShadow: '0 0 8px rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.3s ease'
                            }}>Projects</div>
                        </div>

                        <div className="stat-3d-card playful-card" 
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.07))',
                                borderRadius: '16px',
                                border: '2px solid rgba(255,255,255,0.28)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.28)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                                transformStyle: 'preserve-3d',
                                animation: 'float-subtle-3 8s ease-in-out infinite'
                            }}
                            onClick={(e) => {
                                e.currentTarget.style.animation = 'spin-playful 0.7s ease';
                                setTimeout(() => {
                                    e.currentTarget.style.animation = 'float-subtle-3 8s ease-in-out infinite';
                                }, 700);
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(8deg) rotateX(-3deg) translateZ(25px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.6)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.14))';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.28)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.07))';
                            }}
                        >
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: '#ffffff',
                                textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.5)',
                                marginBottom: '0.25rem',
                                transition: 'all 0.3s ease'
                            }}>🌐 6</div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: '#d0d0d0',
                                textShadow: '0 0 8px rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.3s ease'
                            }}>Apps Live</div>
                        </div>

                        {/* Bottom Row Stats */}
                        <div className="stat-3d-card playful-card" 
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.11), rgba(255,255,255,0.05))',
                                borderRadius: '16px',
                                border: '2px solid rgba(255,255,255,0.23)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.23)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                                transformStyle: 'preserve-3d',
                                animation: 'float-subtle-4 6.5s ease-in-out infinite'
                            }}
                            onClick={(e) => {
                                e.currentTarget.style.animation = 'bounce-playful 0.6s ease';
                                setTimeout(() => {
                                    e.currentTarget.style.animation = 'float-subtle-4 6.5s ease-in-out infinite';
                                }, 600);
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(3deg) translateZ(25px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.6)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.21), rgba(255,255,255,0.12))';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.23)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.11), rgba(255,255,255,0.05))';
                            }}
                        >
                            <div style={{
                                fontSize: '1.2rem',
                                fontWeight: 900,
                                color: '#ffffff',
                                textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.5)',
                                marginBottom: '0.25rem',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                gap: '0.5rem',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <span>Py</span>
                                <span style={{ color: '#888' }}>•</span>
                                <span>JS</span>
                                <span style={{ color: '#888' }}>•</span>
                                <span>TS</span>
                            </div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: '#d0d0d0',
                                textShadow: '0 0 8px rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.3s ease'
                            }}>Languages</div>
                        </div>

                        <div className="stat-3d-card playful-card" 
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.06))',
                                borderRadius: '16px',
                                border: '2px solid rgba(255,255,255,0.26)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.26)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                                transformStyle: 'preserve-3d',
                                animation: 'float-subtle-5 7.5s ease-in-out infinite'
                            }}
                            onClick={(e) => {
                                e.currentTarget.style.animation = 'wiggle 0.6s ease';
                                setTimeout(() => {
                                    e.currentTarget.style.animation = 'float-subtle-5 7.5s ease-in-out infinite';
                                }, 600);
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(8deg) rotateX(-3deg) translateZ(25px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.6)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.23), rgba(255,255,255,0.13))';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.26)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.06))';
                            }}
                        >
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: '#ffffff',
                                textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.5)',
                                marginBottom: '0.25rem',
                                transition: 'all 0.3s ease'
                            }}>�️ 15</div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: '#d0d0d0',
                                textShadow: '0 0 8px rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.3s ease'
                            }}>Tech Stack</div>
                        </div>

                        <div className="stat-3d-card playful-card" 
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                borderRadius: '16px',
                                border: '2px solid rgba(255,255,255,0.22)',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.22)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                                transformStyle: 'preserve-3d',
                                animation: 'float-subtle-6 8.5s ease-in-out infinite'
                            }}
                            onClick={(e) => {
                                e.currentTarget.style.animation = 'spin-playful 0.7s ease';
                                setTimeout(() => {
                                    e.currentTarget.style.animation = 'float-subtle-6 8.5s ease-in-out infinite';
                                }, 700);
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(3deg) translateZ(25px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.6)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.22)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))';
                            }}
                        >
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 900,
                                color: '#ffffff',
                                textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.5)',
                                marginBottom: '0.25rem',
                                transition: 'all 0.3s ease'
                            }}>💻 500+</div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: '#d0d0d0',
                                textShadow: '0 0 8px rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.3s ease'
                            }}>Commits</div>
                        </div>
                    </div>

                    {/* Right Side - Vertical Sliding Ticker */}
                    <div 
                        className="ticker-panel-playful"
                        style={{
                            position: 'relative',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.12))',
                            borderRadius: '20px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            backdropFilter: 'blur(15px)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                            padding: '1.5rem',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            zIndex: 1,
                            animation: 'ticker-breathing 3s ease-in-out infinite'
                        }}
                        onClick={(e) => {
                            setCurrentSlideIndex((prev) => (prev + 1) % statsSlides.length);
                            e.currentTarget.style.animation = 'ticker-pop 0.4s ease';
                            setTimeout(() => {
                                e.currentTarget.style.animation = 'ticker-breathing 3s ease-in-out infinite';
                            }, 400);
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05) rotate(1deg)';
                            e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.6), 0 0 60px rgba(255,255,255,0.6), inset 0 3px 6px rgba(255,255,255,0.4)';
                            e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.22))';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)';
                            e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.12))';
                        }}
                    >
                        {/* Sliding Value Container */}
                        <div style={{
                            position: 'relative',
                            height: '80px',
                            width: '100%',
                            overflow: 'hidden',
                            marginBottom: '0.75rem'
                        }}>
                            {statsSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transform: currentSlideIndex === index 
                                            ? 'translateY(0) scale(1)' 
                                            : currentSlideIndex > index 
                                                ? 'translateY(-100%) scale(0.8)' 
                                                : 'translateY(100%) scale(0.8)',
                                        opacity: currentSlideIndex === index ? 1 : 0,
                                        transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '3rem',
                                        fontWeight: 900,
                                        color: '#ffffff',
                                        textShadow: '0 0 25px rgba(255,255,255,0.9), 0 0 50px rgba(255,255,255,0.7), 0 0 75px rgba(255,255,255,0.5)',
                                        letterSpacing: '0.05em',
                                        animation: currentSlideIndex === index ? 'pulse-glow 3s ease-in-out infinite' : 'none'
                                    }}>
                                        {slide.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sliding Label Container */}
                        <div style={{
                            position: 'relative',
                            height: '50px',
                            width: '100%',
                            overflow: 'hidden'
                        }}>
                            {statsSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transform: currentSlideIndex === index 
                                            ? 'translateY(0)' 
                                            : currentSlideIndex > index 
                                                ? 'translateY(-100%)' 
                                                : 'translateY(100%)',
                                        opacity: currentSlideIndex === index ? 1 : 0,
                                        transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: '#e0e0e0',
                                        textShadow: '0 0 15px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                        textAlign: 'center',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {slide.label}
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#c0c0c0',
                                        textShadow: '0 0 10px rgba(255,255,255,0.3)',
                                        textAlign: 'center'
                                    }}>
                                        {slide.unit}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Progress Indicators */}
                        <div style={{
                            marginTop: '1rem',
                            display: 'flex',
                            gap: '0.4rem',
                            justifyContent: 'center'
                        }}>
                            {statsSlides.map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: '6px',
                                        height: currentSlideIndex === index ? '24px' : '6px',
                                        borderRadius: '3px',
                                        background: currentSlideIndex === index 
                                            ? 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))'
                                            : 'rgba(255,255,255,0.3)',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        boxShadow: currentSlideIndex === index 
                                            ? '0 0 8px rgba(255,255,255,0.6), 0 0 16px rgba(255,255,255,0.3)'
                                            : 'none',
                                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sorting controls in content card style */}
                <div className="content-card-3d mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold" style={{
                                color: '#ffffff',
                                textShadow: '0 0 10px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.4), 0 0 30px rgba(255,255,255,0.2)'
                            }}>Sort:</div>
                            <div className="sort-controls inline-flex gap-2">
                                <button className={`sort-button px-4 py-2 rounded-md text-base ${sortMode==='default' ? 'bg-white/10' : 'bg-white/6'}`} onClick={() => setSortMode('default')}>Default</button>
                                <button className={`sort-button px-4 py-2 rounded-md text-base ${sortMode==='proficiency' ? 'bg-white/10' : 'bg-white/6'}`} onClick={() => setSortMode('proficiency')}>Proficiency</button>
                                <button className={`sort-button px-4 py-2 rounded-md text-base ${sortMode==='experience' ? 'bg-white/10' : 'bg-white/6'}`} onClick={() => setSortMode('experience')}>Experience</button>
                                <button className={`sort-button px-4 py-2 rounded-md text-base ${sortMode==='name' ? 'bg-white/10' : 'bg-white/6'}`} onClick={() => setSortMode('name')}>Name</button>
                            </div>
                        </div>
                        <div className="text-xs italic" style={{
                            color: '#d0d0d0',
                            textShadow: '0 0 8px rgba(255,255,255,0.3)'
                        }}>Click a disc to view details</div>
                    </div>
                </div>

                {/* Interactive discs row in content card */}
                <div className="lounge-card">
                    <h2 className="content-title-3d text-3xl mb-6">Technical Skills</h2>
                    <div className="skill-disc-row" role="list">
                        {sortedTech.slice(0,6).map((skill, i) => (
                            <SkillDisc key={'t-'+i} skill={skill} onSelect={(n) => setSelected(n)} selected={selected === skill.name} />
                        ))}
                    </div>
                </div>

                {/* Interactive detailed stats panel */}
                {selected && (() => {
                const allSkills = [...data.technical, ...data.soft, ...data.tools];
                const skill = allSkills.find(s => s.name === selected);
                if (!skill) return null;
                
                const proficiencyPercent = {
                    'Beginner': 25,
                    'Intermediate': 50,
                    'Advanced': 75,
                    'Expert': 100
                }[skill.proficiency];

                const proficiencyColor = {
                    'Beginner': 'from-cyan-400 via-blue-500 to-indigo-600',
                    'Intermediate': 'from-amber-400 via-orange-500 to-red-500',
                    'Advanced': 'from-emerald-400 via-green-500 to-teal-600',
                    'Expert': 'from-purple-400 via-pink-500 to-rose-600'
                }[skill.proficiency];

                const cardBorderColor = {
                    'Beginner': 'border-blue-500/40 hover:border-blue-400/60',
                    'Intermediate': 'border-orange-500/40 hover:border-orange-400/60',
                    'Advanced': 'border-green-500/40 hover:border-green-400/60',
                    'Expert': 'border-pink-500/40 hover:border-pink-400/60'
                }[skill.proficiency];

                const cardBgGlow = {
                    'Beginner': 'from-blue-900/20 via-indigo-900/20 to-stone-950',
                    'Intermediate': 'from-orange-900/20 via-red-900/20 to-stone-950',
                    'Advanced': 'from-green-900/20 via-emerald-900/20 to-stone-950',
                    'Expert': 'from-purple-900/20 via-pink-900/20 to-stone-950'
                }[skill.proficiency];

                const progressBarColor = {
                    'Beginner': 'from-cyan-300 via-blue-400 to-indigo-500',
                    'Intermediate': 'from-amber-300 via-orange-400 to-red-500',
                    'Advanced': 'from-emerald-300 via-green-400 to-teal-500',
                    'Expert': 'from-purple-300 via-pink-400 to-rose-500'
                }[skill.proficiency];

                return (
                    <div className={`mt-8 p-8 rounded-3xl bg-gradient-to-br ${cardBgGlow} border-2 ${cardBorderColor} shadow-2xl backdrop-blur-sm animate-fadeIn relative overflow-hidden transition-all duration-300`}>
                        {/* Modern gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h3 className="content-title-3d text-4xl mb-3">
                                        {skill.name}
                                    </h3>
                                    <p className="text-gray-300 italic text-base leading-relaxed">
                                        {skillTaglines[skill.name] || 'A valuable skill in the modern tech landscape.'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelected(null)}
                                    className={`ml-4 w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 text-gray-300 hover:text-white transition-all shadow-lg hover:shadow-xl border ${cardBorderColor} flex items-center justify-center font-bold text-lg hover:scale-110`}
                                    aria-label="Close details"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {/* Proficiency Card */}
                                <div className={`group p-6 rounded-2xl bg-gradient-to-br from-neutral-800/60 via-zinc-800/60 to-stone-900/60 border-2 ${cardBorderColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm`}>
                                    <div className="uppercase tracking-widest mb-3 font-bold" style={{
                                        fontSize: '0.75rem',
                                        color: '#ffffff',
                                        textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)'
                                    }}>Proficiency Level</div>
                                    <div className={`text-3xl font-black bg-gradient-to-r ${proficiencyColor} bg-clip-text text-transparent mb-4 drop-shadow-md group-hover:scale-110 transition-transform`}>
                                        {skill.proficiency}
                                    </div>
                                    <div className="w-full bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-full h-5 overflow-hidden shadow-inner border border-neutral-700/50 relative">
                                        <div 
                                            className="h-full bg-gradient-to-r from-white via-gray-50 to-white rounded-full transition-all duration-1000 relative overflow-hidden"
                                            style={{width: `${proficiencyPercent}%`}}
                                        >
                                            {/* Multi-layer white glow */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-white/70"></div>
                                            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                                            {/* Inner white glow shadow */}
                                            <div className="absolute inset-0 shadow-[0_0_25px_rgba(255,255,255,0.9),inset_0_0_25px_rgba(255,255,255,0.7)]"></div>
                                            {/* Top highlight */}
                                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
                                        </div>
                                        {/* Outer glow effect */}
                                        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]" style={{width: `${proficiencyPercent}%`}}></div>
                                    </div>
                                    <div className="text-right text-sm text-gray-400 mt-2 font-bold">{proficiencyPercent}%</div>
                                </div>

                                {/* Experience Card */}
                                <div className={`group p-6 rounded-2xl bg-gradient-to-br from-neutral-800/60 via-zinc-800/60 to-stone-900/60 border-2 ${cardBorderColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm`}>
                                    <div className="uppercase tracking-widest mb-3 font-bold" style={{
                                        fontSize: '0.75rem',
                                        color: '#ffffff',
                                        textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)'
                                    }}>Experience</div>
                                    <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${proficiencyColor} drop-shadow-lg group-hover:scale-110 transition-transform`}>
                                        {skill.experience}
                                    </div>
                                    <div className="text-sm text-gray-300 mt-2 font-medium">
                                        {skill.experience === 1 ? 'year' : 'years'} of hands-on work
                                    </div>
                                </div>

                                {/* Mastery Score Card */}
                                <div className={`group p-6 rounded-2xl bg-gradient-to-br from-neutral-800/60 via-zinc-800/60 to-stone-900/60 border-2 ${cardBorderColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm`}>
                                    <div className="uppercase tracking-widest mb-3 font-bold" style={{
                                        fontSize: '0.75rem',
                                        color: '#ffffff',
                                        textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)'
                                    }}>Mastery Score</div>
                                    <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${proficiencyColor} drop-shadow-lg group-hover:scale-110 transition-transform`}>
                                        {Math.round(proficiencyPercent * 0.7 + skill.experience * 3)}
                                    </div>
                                    <div className="text-sm text-gray-300 mt-2 font-medium">
                                        Combined rating
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className={`p-5 rounded-2xl bg-gradient-to-r from-neutral-800/60 via-zinc-800/60 to-stone-900/60 border-2 ${cardBorderColor} shadow-lg backdrop-blur-sm transition-all`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${proficiencyColor} flex items-center justify-center text-3xl shadow-xl border-2 border-white/20`}>
                                        ⚡
                                    </div>
                                    <div>
                                        <div className={`text-sm font-bold mb-1 tracking-wide bg-gradient-to-r ${proficiencyColor} bg-clip-text text-transparent`}>Pro Tip</div>
                                        <div className="text-gray-300 text-sm leading-relaxed">
                                            Click other discs to compare skills or use Tab + Enter for keyboard navigation
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
            </div>
        </div>
    );
};

interface ProjectShowcasePageProps {
    projects: ShowcaseProject[];
    onProjectChange: (index: number, field: keyof ShowcaseProject, value: string) => void;
    onAddProject: () => void;
    onRemoveProject: (index: number) => void;
    onImportRepo?: (repo: ShowcaseProject) => void; // import a repo into the local showcase
    initialUsername?: string; // optional username or URL to auto-load
    autoLoad?: boolean; // whether to fetch on mount
    onNotify?: (msg: string) => void; // simple notification callback
}

const ProjectShowcasePage: React.FC<ProjectShowcasePageProps> = ({ projects, onProjectChange, onAddProject, onRemoveProject, onImportRepo, initialUsername, autoLoad, onNotify }) => {
    // local state for GitHub overview
    const [username, setUsername] = useState('nicokuehn-dci');
    const [repos, setRepos] = useState<any[]>([]);
    const [userStats, setUserStats] = useState<any | null>(null);
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const extractUsername = (input: string) => {
        // accept either a plain username or a GitHub profile/url like https://github.com/username or github.com/username
        if (!input) return '';
        try {
            const u = input.trim();
            // if looks like a URL
            if (u.includes('github.com')) {
                // remove protocol and query
                const parts = u.replace(/https?:\/\//, '').replace(/www\./, '').split('/');
                const idx = parts.indexOf('github.com');
                if (idx >= 0 && parts.length > idx + 1) return parts[idx + 1];
                // fallback: take second segment
                if (parts.length >= 2) return parts[1];
            }
            // otherwise assume username
            return u.split(/[\s\/]+/)[0];
        } catch (e) { return input; }
    }

    const fetchRepos = async (userInput: string) => {
        const user = extractUsername(userInput);
        if (!user) return;
        setLoading(true);
        setError(null);
        setRepos([]);
        setUserStats(null);
        try {
            // fetch public repos (max 100) sorted by updated
            const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`);
            if (!res.ok) {
                if (res.status === 404) throw new Error('User not found');
                if (res.status === 403) throw new Error('Rate limited by GitHub API (try again later)');
                throw new Error(`GitHub API error: ${res.status}`);
            }
            const data = await res.json();
            // map to useful fields
            const mapped = data.map((r: any) => ({
                id: r.id,
                name: r.name,
                full_name: r.full_name,
                description: r.description,
                html_url: r.html_url,
                language: r.language,
                stargazers_count: r.stargazers_count,
                forks_count: r.forks_count,
                updated_at: r.updated_at,
                created_at: r.created_at,
            }));
            setRepos(mapped);
            // also fetch account-level stats
            try {
                const headers: any = {};
                if (token) headers['Authorization'] = `token ${token}`;
                const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`, { headers });
                if (userRes.ok) {
                    const udata = await userRes.json();
                    setUserStats({ login: udata.login, name: udata.name, followers: udata.followers, following: udata.following, public_repos: udata.public_repos, public_gists: udata.public_gists, avatar_url: udata.avatar_url });
                }
            } catch (e) {
                // ignore non-critical failure
            }
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    // auto-load GitHub repos on mount
    useEffect(() => {
        fetchRepos(username);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const nextSlide = () => {
        if (repos.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % repos.length);
    };

    const prevSlide = () => {
        if (repos.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + repos.length) % repos.length);
    };

    return (
        <div className="project-showcase-page p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="content-title-3d text-6xl md:text-7xl mb-2" style={{
                        letterSpacing: '0.05em'
                    }}>
                        - github_projects -
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                        Showcasing repositories from <span className="font-bold text-gray-900 dark:text-white">nico.kuehn</span>
                    </p>
                    
                    {/* Username Input */}
                    <div className="max-w-2xl mx-auto mb-4 flex gap-3">
                        <input 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="GitHub username (e.g., nicokuehn-dci)" 
                            className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                        />
                        <button 
                            onClick={() => fetchRepos(username.trim())} 
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            Fetch Repos
                        </button>
                    </div>
                </div>

                {loading && <div className="text-center text-gray-500 mb-4 text-lg">Loading repositories…</div>}
                {error && <div className="text-center text-red-500 mb-4 text-lg">{error}</div>}

                {/* Showcase Stats Card - Always visible with Glitch Effect */}
                <div className="max-w-4xl mx-auto mb-6">
                    <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-900 shadow-2xl border-2 border-white/60 dark:border-gray-600/60 overflow-hidden glitch-container">
                        {/* Glitch Overlay Effects */}
                        <div className="glitch-overlay glitch-overlay-1"></div>
                        <div className="glitch-overlay glitch-overlay-2"></div>
                        
                        {/* Scanline Effect */}
                        <div className="scanline"></div>
                        
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/40 pointer-events-none"></div>
                    </div>
                </div>

                {/* 3D Carousel for GitHub Repos */}
                {repos.length > 0 && (
                    <>
                        {/* User Stats Card */}
                        {userStats && (
                            <div className="flex items-center justify-center gap-6 mb-6 p-6 rounded-3xl bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shadow-2xl border border-white/50 dark:border-gray-600/50">
                                <img src={userStats.avatar_url} alt={userStats.login} className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-600 shadow-xl" />
                                <div>
                                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">{userStats.name ?? userStats.login}</div>
                                    <div className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                                        <span className="font-bold">{userStats.followers}</span> followers · 
                                        <span className="font-bold ml-2">{userStats.public_repos}</span> public repos
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3D Carousel - Increased distance */}
                        <div className="relative mb-16 mt-4" style={{ perspective: '2000px', height: '500px' }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {repos.map((repo, index) => {
                                    const offset = (index - currentSlide + repos.length) % repos.length;
                                    const isActive = offset === 0;
                                    const isPrev = offset === repos.length - 1;
                                    const isNext = offset === 1;
                                    const isVisible = isActive || isPrev || isNext;

                                    let transform = '';
                                    let opacity = 0;
                                    let zIndex = 0;

                                    if (isActive) {
                                        transform = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)';
                                        opacity = 1;
                                        zIndex = 10;
                                    } else if (isPrev) {
                                        transform = 'translateX(-550px) translateZ(-350px) rotateY(40deg) scale(0.7)';
                                        opacity = 0.35;
                                        zIndex = 5;
                                    } else if (isNext) {
                                        transform = 'translateX(550px) translateZ(-350px) rotateY(-40deg) scale(0.7)';
                                        opacity = 0.35;
                                        zIndex = 5;
                                    } else {
                                        transform = 'translateX(0) translateZ(-700px) scale(0.3)';
                                        opacity = 0;
                                        zIndex = 0;
                                    }

                                    // Get language color
                                    const getLanguageColor = (lang: string | null) => {
                                        if (!lang) return 'from-gray-500 to-gray-600';
                                        const colors: Record<string, string> = {
                                            'JavaScript': 'from-yellow-400 to-yellow-600',
                                            'TypeScript': 'from-blue-500 to-blue-700',
                                            'Python': 'from-blue-400 to-blue-600',
                                            'Java': 'from-red-500 to-orange-600',
                                            'HTML': 'from-orange-500 to-red-600',
                                            'CSS': 'from-blue-500 to-purple-600',
                                            'Go': 'from-cyan-400 to-cyan-600',
                                            'Rust': 'from-orange-500 to-orange-700',
                                            'Shell': 'from-green-500 to-green-700',
                                        };
                                        return colors[lang] || 'from-gray-500 to-gray-600';
                                    };

                                    return (
                                        <div
                                            key={repo.id}
                                            className="absolute w-[600px] h-[400px] rounded-3xl transition-all duration-700 ease-out"
                                            style={{
                                                transform,
                                                opacity,
                                                zIndex,
                                                pointerEvents: isActive ? 'auto' : 'none',
                                                filter: isActive ? 'drop-shadow(0 0 40px rgba(255,255,255,0.6))' : 'none'
                                            }}
                                        >
                                            {/* 3D Card with Enhanced White Glow */}
                                            <div 
                                                className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-900 border-2 transition-all duration-500 cursor-pointer"
                                                style={{
                                                    borderColor: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                                                    boxShadow: isActive 
                                                        ? '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.7), 0 0 80px rgba(255,255,255,0.5), 0 0 120px rgba(255,255,255,0.3), inset 0 0 60px rgba(255,255,255,0.2)'
                                                        : '0 10px 40px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (isActive) {
                                                        e.currentTarget.style.transform = 'scale(1.02) translateY(-8px)';
                                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,1)';
                                                        e.currentTarget.style.boxShadow = '0 25px 70px rgba(0,0,0,0.5), 0 0 50px rgba(255,255,255,0.9), 0 0 100px rgba(255,255,255,0.7), 0 0 150px rgba(255,255,255,0.5), inset 0 0 80px rgba(255,255,255,0.3)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (isActive) {
                                                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
                                                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.7), 0 0 80px rgba(255,255,255,0.5), 0 0 120px rgba(255,255,255,0.3), inset 0 0 60px rgba(255,255,255,0.2)';
                                                    }
                                                }}
                                            >
                                                {/* Enhanced Glow Layers */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-transparent to-white/50 pointer-events-none"></div>
                                                <div 
                                                    className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500"
                                                    style={{
                                                        opacity: isActive ? 1 : 0.5
                                                    }}
                                                ></div>
                                                
                                                {/* Card Content */}
                                                <div className="relative z-10 p-8 h-full flex flex-col">
                                                    {/* Header with Language */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <h3 className="content-title-3d text-3xl flex-1 pr-4 leading-tight">
                                                            {repo.name}
                                                        </h3>
                                                        {repo.language && (
                                                            <span 
                                                                className={`px-4 py-2 rounded-full bg-gradient-to-r ${getLanguageColor(repo.language)} text-white text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-default`}
                                                                style={{
                                                                    border: '1px solid rgba(255,255,255,0.4)',
                                                                    boxShadow: '0 0 15px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.3)'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                                                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.2), 0 6px 16px rgba(0,0,0,0.4)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.3)';
                                                                }}
                                                            >
                                                                {repo.language}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-gray-700 dark:text-gray-300 text-base mb-6 flex-grow line-clamp-4 text-highlight-zone">
                                                        {repo.description || 'No description provided'}
                                                    </p>

                                                    {/* Stats */}
                                                    <div className="flex items-center gap-6 mb-6">
                                                        <div className="interactive-zone flex items-center gap-2 p-2 rounded-lg">
                                                            <span className="text-2xl">⭐</span>
                                                            <strong className="text-lg text-gray-800 dark:text-gray-200">{repo.stargazers_count}</strong>
                                                        </div>
                                                        <div className="interactive-zone flex items-center gap-2 p-2 rounded-lg">
                                                            <span className="text-2xl">🍴</span>
                                                            <strong className="text-lg text-gray-800 dark:text-gray-200">{repo.forks_count}</strong>
                                                        </div>
                                                        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                                                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    {/* View Button */}
                                                    <a 
                                                        href={repo.html_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg transition-all duration-300"
                                                        style={{
                                                            border: '2px solid rgba(255,255,255,0.4)',
                                                            boxShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.4)',
                                                            textShadow: '0 0 10px rgba(255,255,255,0.3)'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
                                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
                                                            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.5), 0 0 90px rgba(255,255,255,0.3), 0 12px 32px rgba(0,0,0,0.5)';
                                                            e.currentTarget.style.textShadow = '0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                                            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.4)';
                                                            e.currentTarget.style.textShadow = '0 0 10px rgba(255,255,255,0.3)';
                                                        }}
                                                        onMouseDown={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                                                        }}
                                                        onMouseUp={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
                                                        }}
                                                    >
                                                        View on GitHub →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Navigation Controls - Bottom Centered */}
                            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
                                {/* Previous Button */}
                                <button 
                                    onClick={prevSlide} 
                                    className="px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center gap-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #ffffff, #f0f0f0, #e0e0e0)',
                                        color: '#000000',
                                        boxShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.4)',
                                        border: '2px solid rgba(255,255,255,0.8)',
                                        textShadow: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.7), 0 0 90px rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.5)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #ffffff, #f5f5f5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.4)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #f0f0f0, #e0e0e0)';
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = 'scale(0.95) translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.5)';
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.7), 0 0 90px rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.5)';
                                    }}
                                    aria-label="Previous repository"
                                >
                                    ‹ PREV
                                </button>

                                {/* Slide Indicator */}
                                <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700 transition-all duration-300 hover:border-gray-600 hover:bg-gradient-to-r hover:from-gray-800/90 hover:to-gray-900/90">
                                    <span className="text-2xl font-black text-white transition-all duration-300" style={{
                                        textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)',
                                        filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                                    }}>
                                        {currentSlide + 1}
                                    </span>
                                    <span className="text-gray-400 text-sm font-medium">/</span>
                                    <span className="text-gray-300 text-lg font-bold">{repos.length}</span>
                                </div>

                                {/* Next Button */}
                                <button 
                                    onClick={nextSlide} 
                                    className="px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center gap-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #ffffff, #f0f0f0, #e0e0e0)',
                                        color: '#000000',
                                        boxShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.4)',
                                        border: '2px solid rgba(255,255,255,0.8)',
                                        textShadow: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.7), 0 0 90px rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.5)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #ffffff, #f5f5f5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.4)';
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #f0f0f0, #e0e0e0)';
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = 'scale(0.95) translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.5)';
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.7), 0 0 90px rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.5)';
                                    }}
                                    aria-label="Next repository"
                                >
                                    NEXT ›
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {!loading && repos.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-500 dark:text-gray-400 mb-4">No repositories found</p>
                        <p className="text-gray-400 dark:text-gray-500">Enter a GitHub username and click "Fetch Repos"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [currentPage, setCurrentPage] = useState(0);
    const [githubUsername, setGithubUsername] = useState<string | undefined>(resumeData.contact.githubLink || undefined);
    const [githubToken, setGithubToken] = useState<string | undefined>(undefined);
    const [showcaseProjects, setShowcaseProjects] = useState<ShowcaseProject[]>([
        { name: 'Digital Resume', date: '2024', description: 'A dynamic, multi-page digital resume application built with React and Tailwind CSS, featuring light/dark modes and PDF export functionality.', link: 'https://github.com/nicokuehn-dci/digital-resume' },
        { name: 'Finegrind & Benson', date: '2010–2025', description: 'House music project — production, releases and live sets.', link: '' },
        { name: 'Nick de Nitro', date: '2008–2025', description: 'Techno music project — releases and collaborations.', link: '' },
        { name: 'Personal Portfolio', date: '2025', description: 'Static portfolio and demo site (GitHub Pages).', link: 'https://nicokuehn-dci.github.io' }
    ]);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactFormData, setContactFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [currentTime, setCurrentTime] = useState(new Date());


    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleDownloadPdf = () => {
        const element = document.getElementById('page-content');
        if (element) {
            const opt = { margin: 0.2, filename: 'nico_kuehn_resume.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } };
            html2pdf().from(element).set(opt).save();
        }
    };
    
    const handleShowcaseProjectChange = (index: number, field: keyof ShowcaseProject, value: string) => {
        const newProjects = [...showcaseProjects];
        newProjects[index][field] = value;
        setShowcaseProjects(newProjects);
    };

    const addShowcaseProject = () => {
        setShowcaseProjects([...showcaseProjects, { name: '', date: '', description: '', link: '' }]);
    };
    const importShowcaseProject = (repo: ShowcaseProject) => {
        // avoid duplicates by link or name
        const exists = showcaseProjects.some(p => p.link === repo.link || (p.name && p.name === repo.name));
        if (exists) return;
        setShowcaseProjects(prev => [...prev, repo]);
    };

    // --- simple toast/snackbar ---
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const toastTimer = useRef<number | null>(null);
    const showToast = (msg: string, ms = 3000) => {
        setToastMsg(msg);
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToastMsg(null), ms);
    };
    
    const removeShowcaseProject = (index: number) => {
        const newProjects = showcaseProjects.filter((_, i) => i !== index);
        setShowcaseProjects(newProjects);
    };

    const handleContactFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Create mailto link with form data
        const subject = encodeURIComponent(contactFormData.subject || 'Contact from Resume');
        const body = encodeURIComponent(
            `Name: ${contactFormData.name}\nEmail: ${contactFormData.email}\n\n${contactFormData.message}`
        );
        window.location.href = `mailto:${resumeData.contact.email}?subject=${subject}&body=${body}`;
        setShowContactForm(false);
        setContactFormData({ name: '', email: '', subject: '', message: '' });
    };


    const pages = [
        <ResumePage key={0} data={resumeData} onDownloadPdf={handleDownloadPdf} onOpenContactForm={() => setShowContactForm(true)} />,
        <ProjectShowcasePage 
            key={1} 
            projects={showcaseProjects}
            onProjectChange={handleShowcaseProjectChange}
            onAddProject={addShowcaseProject}
            onRemoveProject={removeShowcaseProject}
            onImportRepo={importShowcaseProject}
            initialUsername={resumeData.contact.githubLink}
            autoLoad={true}
            onNotify={(m:string) => showToast(m)}
        />,
        <SkillsDeepDivePage key={2} data={skillsData} />,
        <MyCreativeWorkPage key={3} />,
        <AboutContactPage key={4} data={resumeData} onOpenContactForm={() => setShowContactForm(true)} />,
    ];

    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0));

    const ThemeToggle = () => (
      <button onClick={toggleTheme} className="fixed top-6 right-6 z-50 p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500" aria-label="Toggle theme">
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
      </button>
    );
    
    return (
        <>
                                    <style>{`
                                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                                        .animate-fadeIn { animation: fadeIn 0.6s ease-in-out forwards; }

                                        @keyframes pulse {
                                            0%, 100% { transform: scale(1); opacity: 1; }
                                            50% { transform: scale(1.1); opacity: 0.9; }
                                        }

                                        @keyframes pulse-glow {
                                            0%, 100% { 
                                                textShadow: 0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.5);
                                            }
                                            50% { 
                                                textShadow: 0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,255,255,0.9), 0 0 90px rgba(255,255,255,0.7);
                                            }
                                        }

                                        /* Subtle floating animations for commercial banner */
                                        @keyframes float-subtle-1 {
                                            0%, 100% { transform: translate(0, 0); }
                                            50% { transform: translate(8px, -5px); }
                                        }

                                        @keyframes float-subtle-2 {
                                            0%, 100% { transform: translate(0, 0); }
                                            50% { transform: translate(-6px, 4px); }
                                        }

                                        @keyframes float-subtle-3 {
                                            0%, 100% { transform: translate(0, 0); }
                                            50% { transform: translate(7px, 6px); }
                                        }

                                        @keyframes float-subtle-4 {
                                            0%, 100% { transform: translate(0, 0); }
                                            50% { transform: translate(-8px, -4px); }
                                        }

                                        @keyframes float-subtle-5 {
                                            0%, 100% { transform: translate(0, 0); }
                                            50% { transform: translate(10px, 5px); }
                                        }

                                        @keyframes float-subtle-6 {
                                            0%, 100% { transform: translate(0, 0); }
                                            50% { transform: translate(-9px, -6px); }
                                        }

                                        /* Playful bounce animation for click */
                                        @keyframes bounce-playful {
                                            0%, 100% { transform: perspective(1000px) scale(1) translateY(0); }
                                            25% { transform: perspective(1000px) scale(1.1) translateY(-15px); }
                                            50% { transform: perspective(1000px) scale(0.95) translateY(0); }
                                            75% { transform: perspective(1000px) scale(1.05) translateY(-5px); }
                                        }

                                        /* Wiggle animation */
                                        @keyframes wiggle {
                                            0%, 100% { transform: perspective(1000px) rotate(0deg); }
                                            25% { transform: perspective(1000px) rotate(5deg) scale(1.05); }
                                            50% { transform: perspective(1000px) rotate(-5deg) scale(1.05); }
                                            75% { transform: perspective(1000px) rotate(3deg) scale(1.05); }
                                        }

                                        /* Spin playful animation */
                                        @keyframes spin-playful {
                                            0% { transform: perspective(1000px) rotateY(0deg) scale(1); }
                                            50% { transform: perspective(1000px) rotateY(180deg) scale(1.1); }
                                            100% { transform: perspective(1000px) rotateY(360deg) scale(1); }
                                        }

                                        /* Pulsating background glow */
                                        @keyframes pulse-bg-glow {
                                            0%, 100% { 
                                                opacity: 0.6;
                                                transform: translate(-50%, -50%) scale(1);
                                            }
                                            50% { 
                                                opacity: 1;
                                                transform: translate(-50%, -50%) scale(1.1);
                                            }
                                        }

                                        /* Ripple effect animation */
                                        @keyframes ripple-expand {
                                            0% {
                                                transform: scale(0);
                                                opacity: 1;
                                            }
                                            100% {
                                                transform: scale(50);
                                                opacity: 0;
                                            }
                                        }

                                        /* Banner hover effect */
                                        .banner-hovered {
                                            border-color: rgba(100,200,255,0.6) !important;
                                            box-shadow: 0 0 80px rgba(100,200,255,0.4), 0 0 120px rgba(100,200,255,0.2) !important;
                                        }

                                        /* Floating particle animations */
                                        @keyframes float-particle-1 {
                                            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                                            25% { transform: translate(10px, -15px) scale(1.2); opacity: 0.8; }
                                            50% { transform: translate(-5px, -25px) scale(0.9); opacity: 0.5; }
                                            75% { transform: translate(-15px, -10px) scale(1.1); opacity: 0.7; }
                                        }
                                        
                                        @keyframes float-particle-2 {
                                            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                                            33% { transform: translate(-12px, -20px) scale(1.1); opacity: 0.9; }
                                            66% { transform: translate(8px, -30px) scale(0.8); opacity: 0.6; }
                                        }
                                        
                                        @keyframes float-particle-3 {
                                            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                                            40% { transform: translate(15px, -10px) scale(1.3); opacity: 0.7; }
                                            80% { transform: translate(-10px, -20px) scale(0.9); opacity: 0.5; }
                                        }

                                        /* Corner glows */
                                        @keyframes corner-glow-1 {
                                            0%, 100% { opacity: 0.4; }
                                            50% { opacity: 0.8; }
                                        }

                                        @keyframes corner-glow-2 {
                                            0%, 100% { opacity: 0.3; }
                                            50% { opacity: 0.7; }
                                        }

                                        /* Ticker breathing animation */
                                        @keyframes ticker-breathing {
                                            0%, 100% { 
                                                transform: scale(1);
                                                box-shadow: 0 10px 30px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2);
                                            }
                                            50% { 
                                                transform: scale(1.01);
                                                box-shadow: 0 12px 35px rgba(0,0,0,0.45), 0 0 20px rgba(255,255,255,0.2), inset 0 2px 4px rgba(255,255,255,0.25);
                                            }
                                        }

                                        /* Ticker pop animation */
                                        @keyframes ticker-pop {
                                            0%, 100% { transform: scale(1) rotate(0deg); }
                                            50% { transform: scale(1.08) rotate(-2deg); }
                                        }

                                        /* Orange pulse for skill discs - continuous */
                                        @keyframes disc-pulse-orange {
                                            0%, 100% {
                                                box-shadow: 
                                                    0 10px 30px rgba(0,0,0,0.4),
                                                    0 0 20px rgba(205,127,50,0.3),
                                                    0 0 40px rgba(205,127,50,0.15),
                                                    inset 0 2px 4px rgba(255,255,255,0.05);
                                            }
                                            50% {
                                                box-shadow: 
                                                    0 10px 30px rgba(0,0,0,0.4),
                                                    0 0 35px rgba(205,127,50,0.6),
                                                    0 0 70px rgba(205,127,50,0.4),
                                                    0 0 100px rgba(205,127,50,0.2),
                                                    inset 0 2px 4px rgba(255,255,255,0.05);
                                            }
                                        }

                                        /* Ultraviolet clock animations */
                                        @keyframes uv-glow {
                                            0%, 100% {
                                                box-shadow: 0 8px 32px rgba(138,43,226,0.3), inset 0 2px 4px rgba(138,43,226,0.2), 0 0 40px rgba(138,43,226,0.2);
                                                border-color: rgba(138,43,226,0.4);
                                            }
                                            50% {
                                                box-shadow: 0 12px 48px rgba(138,43,226,0.5), inset 0 2px 4px rgba(138,43,226,0.3), 0 0 60px rgba(138,43,226,0.4);
                                                border-color: rgba(138,43,226,0.6);
                                            }
                                        }

                                        @keyframes uv-pulse {
                                            0% { transform: scale(1); }
                                            50% { transform: scale(1.1) rotateY(10deg); }
                                            100% { transform: scale(1); }
                                        }

                                        @keyframes uv-orb-pulse {
                                            0%, 100% {
                                                opacity: 0.5;
                                                transform: translate(-50%, -50%) scale(1);
                                            }
                                            50% {
                                                opacity: 0.8;
                                                transform: translate(-50%, -50%) scale(1.15);
                                            }
                                        }

                                        @keyframes uv-ring-rotate {
                                            0% { transform: translate(-50%, -50%) rotate(0deg); }
                                            100% { transform: translate(-50%, -50%) rotate(360deg); }
                                        }

                                        @keyframes uv-ring-rotate-reverse {
                                            0% { transform: translate(-50%, -50%) rotate(360deg); }
                                            100% { transform: translate(-50%, -50%) rotate(0deg); }
                                        }

                                        /* Hover effect for stat bubbles */
                                        .stat-hover:hover > div {
                                            background: rgba(255,255,255,0.25) !important;
                                            box-shadow: 0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.4) !important;
                                            border-color: rgba(255,255,255,0.7) !important;
                                        }

                                        /* Banner hover effect - pause animations */
                                        .banner-hovered .floating-stat {
                                            animation-play-state: paused;
                                        }

                                        @keyframes float-diagonal-1 {
                                            0%, 100% { 
                                                transform: translate(0, 0) rotate(0deg);
                                                opacity: 0.9;
                                            }
                                            25% { 
                                                transform: translate(30px, -15px) rotate(2deg);
                                                opacity: 1;
                                            }
                                            50% { 
                                                transform: translate(60px, -10px) rotate(-1deg);
                                                opacity: 0.85;
                                            }
                                            75% { 
                                                transform: translate(30px, 5px) rotate(1deg);
                                                opacity: 1;
                                            }
                                        }

                                        @keyframes float-diagonal-2 {
                                            0%, 100% { 
                                                transform: translate(0, 0) rotate(0deg);
                                                opacity: 0.85;
                                            }
                                            33% { 
                                                transform: translate(-40px, 20px) rotate(-2deg);
                                                opacity: 1;
                                            }
                                            66% { 
                                                transform: translate(-20px, -10px) rotate(1deg);
                                                opacity: 0.9;
                                            }
                                        }

                                        @keyframes float-diagonal-3 {
                                            0%, 100% { 
                                                transform: translate(0, 0) rotate(0deg);
                                                opacity: 0.8;
                                            }
                                            40% { 
                                                transform: translate(50px, -20px) rotate(3deg);
                                                opacity: 1;
                                            }
                                            80% { 
                                                transform: translate(25px, 10px) rotate(-2deg);
                                                opacity: 0.9;
                                            }
                                        }

                                        @keyframes float-diagonal-4 {
                                            0%, 100% { 
                                                transform: translate(0, 0) rotate(0deg);
                                                opacity: 0.9;
                                            }
                                            30% { 
                                                transform: translate(-35px, -25px) rotate(-2deg);
                                                opacity: 1;
                                            }
                                            70% { 
                                                transform: translate(-50px, 15px) rotate(2deg);
                                                opacity: 0.85;
                                            }
                                        }

                                        @keyframes float-center {
                                            0%, 100% { 
                                                transform: translateY(-50%) scale(1);
                                                opacity: 0.7;
                                            }
                                            50% { 
                                                transform: translateY(-50%) scale(1.05);
                                                opacity: 1;
                                            }
                                        }

                                        /* Skills Deep Dive: steampunk theme with leather/bronze textures and warm brass glow */
                                        .skills-deep-container {
                                            position: relative;
                                            padding: 3rem 2rem;
                                            border-radius: 18px;
                                            overflow: visible;
                                            /* layered leather -> dark wood -> brass vignette */
                                            background-color: #17120d;
                                            background-image: 
                                              linear-gradient(180deg, rgba(255,238,210,0.02), rgba(0,0,0,0.18)),
                                              repeating-linear-gradient(45deg, rgba(255,255,255,0.006) 0 2px, rgba(0,0,0,0.004) 2px 6px),
                                              radial-gradient(600px 220px at 20% 10%, rgba(187,142,80,0.06), transparent 18%),
                                              radial-gradient(600px 220px at 80% 85%, rgba(80,58,36,0.04), transparent 18%);
                                            color: #efd8b3; /* warm parchment text color */
                                            border: 1px solid rgba(200,160,100,0.06);
                                            box-shadow: inset 0 1px 0 rgba(255,255,255,0.02), 0 18px 60px rgba(2,2,2,0.6);
                                        }

                                        /* subtle warm brass glow behind the grid */
                                        .skills-deep-container::before {
                                            content: '';
                                            position: absolute;
                                            left: 50%;
                                            top: 18%;
                                            transform: translateX(-50%);
                                            width: 900px;
                                            height: 380px;
                                            border-radius: 50%;
                                            background: radial-gradient(closest-side, rgba(180,120,60,0.12), rgba(120,80,40,0.04) 30%, transparent 60%);
                                            filter: blur(34px) saturate(110%);
                                            z-index: 0;
                                            pointer-events: none;
                                        }

                                        @media (prefers-color-scheme: dark) {
                                            .skills-deep-container::before {
                                                background: radial-gradient(closest-side, rgba(160,110,60,0.12), rgba(120,80,40,0.04) 30%, transparent 60%);
                                            }
                                        }

                                        .skill-grid { position: relative; z-index: 1; }


                                                        .skill-card {
                                                            position: relative;
                                                            border-radius: 14px;
                                                            padding: 1rem; /* roomier */
                                                            overflow: visible;
                                                            transition: transform .28s cubic-bezier(.2,.9,.2,1), box-shadow .28s;
                                                            transform-style: preserve-3d;
                                                            /* steampunk card surface: dark brushed metal with subtle patina */
                                                            background: linear-gradient(180deg, rgba(40,30,24,0.56), rgba(18,12,8,0.6));
                                                            box-shadow: inset 0 1px 0 rgba(255,230,190,0.03), 0 18px 48px rgba(8,4,2,0.6);
                                                            border: 1px solid rgba(200,160,90,0.08);
                                                            color: #efd8b3;
                                                            backdrop-filter: blur(2px);
                                                        }

                                        .skill-card.dark {
                                            background: linear-gradient(180deg, rgba(8,10,18,0.6), rgba(6,8,15,0.45));
                                            border: 1px solid rgba(99,102,241,0.08);
                                            box-shadow: 0 30px 80px rgba(2,6,23,0.6), 0 8px 24px rgba(2,6,23,0.25);
                                        }

                                        /* white halo + colored glow behind each card */

                                                        .skill-card::before {
                                                                            content: '';
                                                                            position: absolute;
                                                                            inset: -8px;
                                                                            z-index: -2;
                                                                            border-radius: 14px;
                                                                            /* warm brass halo */
                                                                            background: radial-gradient(closest-side, rgba(180,120,60,0.12), rgba(120,80,40,0.04) 28%, transparent 56%);
                                                                            filter: blur(24px) saturate(110%);
                                                                            opacity: 0.95;
                                                                            transition: opacity .28s, transform .28s;
                                                                            transform: translateZ(-16px) scale(0.99);
                                                                            pointer-events: none;
                                                                        }

                                                        .skill-card::after {
                                                            content: '';
                                                            position: absolute;
                                                            inset: -6px;
                                                            z-index: -1;
                                                            border-radius: 16px;
                                                            background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(236,72,153,0.04));
                                                            filter: blur(14px);
                                                            opacity: 0.95;
                                                            transition: opacity .35s, transform .35s;
                                                        }


                                        .skill-card:hover { transform: translateY(-8px) rotateX(3deg); }
                                        .skill-card:hover::after { opacity: 1; filter: blur(18px); transform: translateY(-2px) scale(1.02); }
                                        .skill-card:hover::before { transform: translateZ(-18px) scale(1.02); opacity: 1; }

                                        /* informal rotation for a casual, scattered feel (kept subtle for steampunk) */
                                        .informal-grid .skill-card:nth-child(3n+1) { transform: rotate(-0.6deg); }
                                        .informal-grid .skill-card:nth-child(3n+2) { transform: rotate(0.6deg); }
                                        .informal-grid .skill-card:nth-child(3n+3) { transform: rotate(-0.35deg); }
                                        .informal-grid .skill-card:hover { transform: rotate(0deg) translateY(-10px) scale(1.02); }

                                        /* sort control styles (brass buttons) */
                                        .sort-controls .sort-button { background: linear-gradient(180deg,#3b2b20,#22160f); color: #f1e3c4; border: 1px solid rgba(200,150,80,0.12); padding: 0.35rem 0.6rem; box-shadow: 0 6px 20px rgba(0,0,0,0.45) inset; }
                                        .sort-controls .sort-button:hover { filter: brightness(1.06); transform: translateY(-1px); }

                                          .skill-title { font-weight: 700; font-size: 1rem; color: #0f172a; display:flex; align-items:center; gap:0.5rem }
                                          .skill-meta { font-size: 0.78rem; color: #6b7280; }

                                          /* icon and badge */
                                          .skill-icon { width:40px; height:40px; display:inline-flex; align-items:center; justify-content:center; border-radius:10px; background:rgba(255,255,255,0.92); box-shadow: 0 8px 24px rgba(12,14,20,0.08), 0 0 10px rgba(255,255,255,0.3); transition: all 0.3s ease; }
                                          .skill-icon:hover { box-shadow: 0 12px 32px rgba(12,14,20,0.12), 0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3); transform: translateY(-2px); }
                                          .skill-badge { 
                                              padding: .18rem .5rem; 
                                              border-radius: 9999px; 
                                              font-size: .7rem; 
                                              font-weight: 700; 
                                              display: inline-block;
                                              border: 1px solid rgba(255,255,255,0.3);
                                              box-shadow: 0 0 10px rgba(255,255,255,0.2), 0 0 20px rgba(255,255,255,0.1);
                                              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                          }
                                          .skill-badge:hover {
                                              border-color: rgba(255,255,255,0.5);
                                              box-shadow: 0 0 15px rgba(255,255,255,0.4), 0 0 30px rgba(255,255,255,0.2), 0 0 45px rgba(255,255,255,0.1);
                                              transform: translateY(-1px) scale(1.05);
                                          }

                                          /* interactive tilt helpers */
                                          .skill-card--interactive { will-change: transform; transform-style:preserve-3d; }
                                          .skill-card--interactive .skill-inner { transform: translateZ(0); transition: transform .18s cubic-bezier(.2,.9,.2,1); }
                                          /* tagline hidden to save space; revealed on hover */
                                          .skill-tagline { color: #6b7280; font-size: .82rem; display:block; height:1.1rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; opacity:0.95 }
                                          .skill-card:hover .skill-tagline { white-space:normal; height:auto; display:block }

                                          /* mount animation */
                                          .skill-card { opacity:0; transform: translateY(8px); animation: card-in .45s ease forwards; }
                                          @keyframes card-in { to { opacity:1; transform: translateY(0); } }

                                        .skill-progress { height: 10px; background: rgba(15,23,42,0.06); border-radius: 9999px; overflow: hidden; margin-top: .5rem; }
                                        .skill-progress .fill { height: 100%; border-radius: 9999px; transition: width .6s cubic-bezier(.2,.9,.2,1); box-shadow: inset 0 -4px 8px rgba(0,0,0,0.12); }

                                        .fill.gradient-blue { background: linear-gradient(90deg,#38bdf8,#7c3aed); }
                                        .fill.gradient-green { background: linear-gradient(90deg,#10b981,#06b6d4); }
                                        .fill.gradient-yellow { background: linear-gradient(90deg,#f59e0b,#fb923c); }
                                        .fill.gradient-red { background: linear-gradient(90deg,#fb7185,#f43f5e); }

                                        @media (prefers-color-scheme: dark) {
                                            .skill-title { color: #e6eef8; }
                                            .skill-meta { color: #9ca3af; }
                                            .skill-card::after { background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(236,72,153,0.05)); }
                                            .skill-card::before { background: radial-gradient(closest-side, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 30%, transparent 55%); }
                                        }

                                        /* skill disc chart */
                                        .skill-disc-row { 
                                            display: grid; 
                                            grid-template-columns: repeat(3, 1fr); 
                                            gap: 2.5rem; 
                                            justify-items: center; 
                                            margin-bottom: 2rem; 
                                            max-width: 900px;
                                            margin-left: auto;
                                            margin-right: auto;
                                        }
                                        /* Enhanced discs with multi-layer depth effects */
                                        .skill-disc { 
                                            width: 210px; 
                                            height: 210px; 
                                            display: inline-block; 
                                            position: relative; 
                                            cursor: pointer; 
                                            border-radius: 999px; 
                                            perspective: 1200px; 
                                            margin: 0.6rem;
                                            background: linear-gradient(145deg, rgba(40,40,40,0.8), rgba(20,20,20,0.95));
                                            border: 2px solid rgba(255,255,255,0.15);
                                            box-shadow: 
                                                0 10px 30px rgba(0, 0, 0, 0.5),
                                                0 0 20px rgba(255, 255, 255, 0.08),
                                                0 0 40px rgba(255, 255, 255, 0.05),
                                                inset 0 2px 4px rgba(255, 255, 255, 0.08),
                                                inset 0 -2px 6px rgba(0, 0, 0, 0.3);
                                            transition: all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
                                        }
                                        .skill-disc::before {
                                            content: '';
                                            position: absolute;
                                            inset: -4px;
                                            border-radius: 999px;
                                            background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%);
                                            opacity: 0;
                                            transition: opacity 0.4s ease;
                                            pointer-events: none;
                                            z-index: -1;
                                        }
                                        .skill-disc::after {
                                            content: '';
                                            position: absolute;
                                            inset: 10%;
                                            border-radius: 999px;
                                            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 60%);
                                            opacity: 0.5;
                                            pointer-events: none;
                                        }
                                        .skill-disc:hover,
                                        .skill-disc.highlight { 
                                            transform: translateY(-8px) scale(1.05);
                                            border-color: rgba(255,255,255,0.4);
                                            background: linear-gradient(145deg, rgba(50,50,50,0.9), rgba(25,25,25,1));
                                            box-shadow: 
                                                0 20px 60px rgba(0, 0, 0, 0.7),
                                                0 0 30px rgba(255, 255, 255, 0.2),
                                                0 0 60px rgba(255, 255, 255, 0.15),
                                                0 0 90px rgba(255, 255, 255, 0.1),
                                                inset 0 4px 8px rgba(255, 255, 255, 0.12),
                                                inset 0 -4px 10px rgba(0, 0, 0, 0.4);
                                        }
                                        .skill-disc:hover::before,
                                        .skill-disc.highlight::before {
                                            opacity: 1;
                                        }
                                        .skill-disc svg { width:100%; height:100%; transform:rotate(-90deg); display:block; transition: transform .35s cubic-bezier(.2,.9,.2,1); }
                                        .skill-disc .label { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); font-size:1.1rem; font-weight:900; color:#000000; text-align:center; pointer-events:none; text-shadow: 0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.7), 0 0 24px rgba(255,255,255,0.5); -webkit-text-stroke: 1px rgba(255,255,255,0.3); }
                                        .skill-disc.highlight .label { color: #000000; text-shadow: 0 0 12px rgba(255,255,255,1), 0 0 24px rgba(255,255,255,0.8), 0 0 36px rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.3); }
                                        .skill-disc .sub { display:block; font-size:0.72rem; font-weight:600; color:#6b7280 }
                                        .skill-disc .tooltip { position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.95); color:#fff; padding:6px 8px; border-radius:6px; font-size:0.78rem; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .15s; z-index:30 }
                                        .skill-disc:hover .tooltip, .skill-disc:focus .tooltip { opacity:1 }
                                        .skill-disc .ring-bg { stroke: rgba(15,23,42,0.06); stroke-width:22; fill:none }
                                        .skill-disc .ring { stroke-linecap:round; stroke-width:22; fill:none; filter: drop-shadow(0 12px 20px rgba(0,0,0,0.5)); transform-origin:50% 50%; transition: filter .28s, transform .28s, opacity .28s, stroke .28s; opacity: 0.7; stroke: #5a4a3a; }
                                        /* Center disk: dark grey with subtle soft outline */
                                        .skill-disc .inner { fill:#0f1724; opacity:1; stroke: rgba(255,255,255,0.06); stroke-width:4; filter: drop-shadow(0 8px 20px rgba(255,255,255,0.03)); }
                                        .skill-disc.highlight .inner { stroke: rgba(205,127,50,0.35); filter: drop-shadow(0 22px 54px rgba(205,127,50,0.25)); }
                                        .skill-disc .gloss { fill: url(#diskGloss); opacity: 0.18; pointer-events: none; mix-blend-mode: overlay }
                                        .skill-disc.highlight { transform: translateZ(28px) scale(1.06); }
                                        /* highlighted ring: steampunk bronze/copper/gold glow with full opacity */
                                        .skill-disc.highlight .ring { opacity: 1; transform: scale(1.08); stroke: #CD7F32; filter: drop-shadow(0 18px 40px rgba(205,127,50,0.35)) drop-shadow(0 28px 72px rgba(218,165,32,0.45)) drop-shadow(0 0 35px rgba(255,215,0,0.25)); }
                                        /* non-highlighted rings slightly dimmed */
                                        .skill-disc:not(.highlight) .ring { opacity: 0.5 }
                                        .skill-disc:focus { outline: none; box-shadow: 0 16px 48px rgba(99,102,241,0.12); transform: translateY(-8px) rotateX(4deg); }
                                        .skill-disc:hover svg { transform: rotate(-90deg) translateZ(14px) rotateX(6deg); }

                                        /* New interactive overlays - Black text with white glow */
                                        .disc-percentage {
                                            position: absolute;
                                            top: 20%;
                                            left: 50%;
                                            transform: translateX(-50%);
                                            font-size: 2.5rem;
                                            font-weight: 900;
                                            color: #000000;
                                            text-shadow: 
                                                0 0 8px rgba(255, 255, 255, 0.9),
                                                0 0 16px rgba(255, 255, 255, 0.7),
                                                0 0 24px rgba(255, 255, 255, 0.5),
                                                0 2px 4px rgba(0, 0, 0, 0.3);
                                            pointer-events: none;
                                            transition: opacity 0.3s ease, transform 0.3s ease;
                                            z-index: 10;
                                            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
                                        }
                                        .skill-disc.hovered .disc-percentage,
                                        .skill-disc.highlight .disc-percentage {
                                            transform: translateX(-50%) translateY(-4px) scale(1.15);
                                            text-shadow: 
                                                0 0 12px rgba(255, 255, 255, 1),
                                                0 0 24px rgba(255, 255, 255, 0.8),
                                                0 0 36px rgba(255, 255, 255, 0.6),
                                                0 4px 8px rgba(0, 0, 0, 0.4);
                                        }

                                        .disc-experience-badge {
                                            position: absolute;
                                            bottom: 15%;
                                            right: 12%;
                                            background: linear-gradient(145deg, #ffffff, #e5e7eb);
                                            color: #000000;
                                            padding: 6px 12px;
                                            border-radius: 16px;
                                            font-size: 0.8rem;
                                            font-weight: 900;
                                            box-shadow: 
                                                0 6px 16px rgba(0, 0, 0, 0.3),
                                                0 0 20px rgba(255, 255, 255, 0.6),
                                                inset 0 2px 4px rgba(255, 255, 255, 0.5),
                                                inset 0 -2px 4px rgba(0, 0, 0, 0.1);
                                            pointer-events: none;
                                            transition: opacity 0.3s ease, transform 0.3s ease;
                                            z-index: 10;
                                            border: 2px solid rgba(255, 255, 255, 0.8);
                                            text-shadow: 
                                                0 0 4px rgba(255, 255, 255, 0.6),
                                                0 1px 2px rgba(0, 0, 0, 0.2);
                                        }

                                        /* Skill name caption below disc */
                                        .disc-caption {
                                            position: absolute;
                                            bottom: -35px;
                                            left: 50%;
                                            transform: translateX(-50%);
                                            font-size: 0.85rem;
                                            font-weight: 700;
                                            color: #ffffff;
                                            text-align: center;
                                            white-space: nowrap;
                                            text-shadow: 
                                                0 0 10px rgba(255,255,255,0.8),
                                                0 0 20px rgba(255,255,255,0.6),
                                                0 0 30px rgba(255,255,255,0.4);
                                            z-index: 10;
                                            pointer-events: none;
                                        }

                                        .skill-disc.hovered .disc-experience-badge,
                                        .skill-disc.highlight .disc-experience-badge {
                                            transform: scale(1.2) rotate(-5deg);
                                            box-shadow: 
                                                0 8px 24px rgba(0, 0, 0, 0.4),
                                                0 0 30px rgba(255, 255, 255, 0.9),
                                                inset 0 2px 4px rgba(255, 255, 255, 0.6),
                                                inset 0 -2px 4px rgba(0, 0, 0, 0.15);
                                        }

                                        /* Shimmer animation */
                                        .shimmer-overlay {
                                            animation: shimmer-pulse 2s ease-in-out infinite;
                                        }
                                        @keyframes shimmer-pulse {
                                            0%, 100% { opacity: 0.2; }
                                            50% { opacity: 0.5; }
                                        }

                                        /* Pulsing glow for highlighted/hovered discs */
                                        @keyframes glow-pulse {
                                            0%, 100% {
                                                box-shadow: 
                                                    0 0 20px rgba(205,127,50,0.4),
                                                    0 0 40px rgba(212,163,115,0.3),
                                                    0 12px 40px rgba(0,0,0,0.5);
                                            }
                                            50% {
                                                box-shadow: 
                                                    0 0 40px rgba(205,127,50,0.8),
                                                    0 0 80px rgba(212,163,115,0.6),
                                                    0 16px 60px rgba(205,127,50,0.4);
                                            }
                                        }
                                        .skill-disc.highlight,
                                        .skill-disc.hovered {
                                            animation: glow-pulse 2.5s ease-in-out infinite;
                                        }

                                        /* 3D rounded depth effect on disc container */
                                        .skill-disc {
                                            box-shadow: 
                                                0 10px 30px rgba(0,0,0,0.4),
                                                inset 0 2px 4px rgba(255,255,255,0.05);
                                        }
                                        .skill-disc::before {
                                            content: '';
                                            position: absolute;
                                            inset: 0;
                                            border-radius: 50%;
                                            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 60%);
                                            pointer-events: none;
                                            z-index: 1;
                                        }

                                        /* Enhanced hover state */
                                        .skill-disc.hovered {
                                            transform: translateY(-12px) scale(1.05);
                                            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                                        }
                                        .skill-disc.hovered .ring {
                                            opacity: 0.85;
                                            filter: drop-shadow(0 20px 40px rgba(205,127,50,0.4));
                                        }
                                        .skill-disc.hovered .inner {
                                            stroke: rgba(205,127,50,0.2);
                                            filter: drop-shadow(0 12px 30px rgba(205,127,50,0.15));
                                        }

                                        /* Proficiency Legend - 3D glowing rounded shapes */
                                        .proficiency-legend {
                                            background: linear-gradient(135deg, rgba(15,23,42,0.6), rgba(30,41,59,0.4));
                                            border: 1px solid rgba(139,94,60,0.3);
                                            border-radius: 16px;
                                            padding: 1.5rem;
                                            box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.05);
                                            backdrop-filter: blur(10px);
                                        }
                                        .legend-title {
                                            font-size: 1rem;
                                            font-weight: 700;
                                            color: #d4a373;
                                            margin-bottom: 1rem;
                                            text-transform: uppercase;
                                            letter-spacing: 1px;
                                            text-shadow: 0 2px 8px rgba(212,163,115,0.4);
                                        }
                                        .legend-items {
                                            display: flex;
                                            gap: 1.5rem;
                                            flex-wrap: wrap;
                                            justify-content: center;
                                        }
                                        .legend-item {
                                            display: flex;
                                            align-items: center;
                                            gap: 0.75rem;
                                            padding: 0.5rem 1rem;
                                            background: rgba(0,0,0,0.3);
                                            border-radius: 12px;
                                            transition: transform 0.3s ease, box-shadow 0.3s ease;
                                            cursor: default;
                                        }
                                        .legend-item:hover {
                                            transform: translateY(-4px) scale(1.05);
                                            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                                        }
                                        .legend-shape {
                                            width: 28px;
                                            height: 28px;
                                            border-radius: 50%;
                                            position: relative;
                                            transform-style: preserve-3d;
                                            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
                                        }
                                        .legend-item:hover .legend-shape {
                                            transform: translateZ(20px) rotateY(180deg) scale(1.2);
                                        }
                                        /* Expert - Green */
                                        .expert-glow {
                                            background: linear-gradient(135deg, #16a34a, #22c55e);
                                            box-shadow: 
                                                0 0 20px rgba(22,163,74,0.5),
                                                0 0 40px rgba(34,197,94,0.3),
                                                inset 0 2px 6px rgba(255,255,255,0.3),
                                                inset 0 -2px 6px rgba(0,0,0,0.2);
                                        }
                                        .legend-item:hover .expert-glow {
                                            box-shadow: 
                                                0 0 30px rgba(22,163,74,0.8),
                                                0 0 60px rgba(34,197,94,0.6),
                                                0 8px 30px rgba(22,163,74,0.4),
                                                inset 0 2px 6px rgba(255,255,255,0.4);
                                        }
                                        /* Advanced - Indigo */
                                        .advanced-glow {
                                            background: linear-gradient(135deg, #4f46e5, #6366f1);
                                            box-shadow: 
                                                0 0 20px rgba(79,70,229,0.5),
                                                0 0 40px rgba(99,102,241,0.3),
                                                inset 0 2px 6px rgba(255,255,255,0.25),
                                                inset 0 -2px 6px rgba(0,0,0,0.2);
                                        }
                                        .legend-item:hover .advanced-glow {
                                            box-shadow: 
                                                0 0 30px rgba(79,70,229,0.8),
                                                0 0 60px rgba(99,102,241,0.6),
                                                0 8px 30px rgba(79,70,229,0.4),
                                                inset 0 2px 6px rgba(255,255,255,0.35);
                                        }
                                        /* Intermediate - Blue */
                                        .intermediate-glow {
                                            background: linear-gradient(135deg, #3b82f6, #60a5fa);
                                            box-shadow: 
                                                0 0 20px rgba(59,130,246,0.5),
                                                0 0 40px rgba(96,165,250,0.3),
                                                inset 0 2px 6px rgba(255,255,255,0.2),
                                                inset 0 -2px 6px rgba(0,0,0,0.2);
                                        }
                                        .legend-item:hover .intermediate-glow {
                                            box-shadow: 
                                                0 0 30px rgba(59,130,246,0.8),
                                                0 0 60px rgba(96,165,250,0.6),
                                                0 8px 30px rgba(59,130,246,0.4),
                                                inset 0 2px 6px rgba(255,255,255,0.3);
                                        }
                                        /* Beginner - Orange */
                                        .beginner-glow {
                                            background: linear-gradient(135deg, #f97316, #fb923c);
                                            box-shadow: 
                                                0 0 20px rgba(249,115,22,0.5),
                                                0 0 40px rgba(251,146,60,0.3),
                                                inset 0 2px 6px rgba(255,255,255,0.2),
                                                inset 0 -2px 6px rgba(0,0,0,0.2);
                                        }
                                        .legend-item:hover .beginner-glow {
                                            box-shadow: 
                                                0 0 30px rgba(249,115,22,0.8),
                                                0 0 60px rgba(251,146,60,0.6),
                                                0 8px 30px rgba(249,115,22,0.4),
                                                inset 0 2px 6px rgba(255,255,255,0.3);
                                        }
                                        .legend-label {
                                            font-size: 0.9rem;
                                            font-weight: 500;
                                            font-family: Georgia, "Times New Roman", serif;
                                            color: #e2e8f0;
                                            text-shadow: 0 1px 3px rgba(0,0,0,0.4);
                                        }
                                        .legend-item:hover .legend-label {
                                            color: #ffffff;
                                            font-weight: 600;
                                        }

                                        /* lightning accent overlay inside discs */
                                        .disc-lightning-wrap { position:absolute; right:8%; top:8%; width:54px; height:54px; pointer-events:none; z-index:5; transform:translateZ(20px) rotate(-12deg); opacity:0.14; transition:opacity .25s ease, transform .25s ease; }
                                        .disc-lightning { width:100%; height:100%; filter: drop-shadow(0 6px 18px rgba(250,204,21,0.12)); }
                                        .skill-disc:hover .disc-lightning-wrap, .skill-disc.highlight .disc-lightning-wrap { opacity:0.95; transform:translateZ(36px) rotate(-6deg) scale(1.02); }
                                        @keyframes lightning-flash { 0% { opacity: 0.15; transform: translateY(0) rotate(-12deg) scale(0.96); } 50% { opacity: 1; transform: translateY(-2px) rotate(-6deg) scale(1.02); } 100% { opacity: 0.15; transform: translateY(0) rotate(-12deg) scale(0.96); } }
                                        .skill-disc.highlight .disc-lightning { animation: lightning-flash 1.5s ease-in-out infinite; }

                                        /* rounded 3D profile image for stronger presence */
                                        .rounded-3d { border-radius: 9999px !important; box-shadow: 0 24px 60px rgba(2,6,23,0.32), inset 0 6px 18px rgba(255,255,255,0.04); transform-style: preserve-3d; transition: transform .36s cubic-bezier(.2,.9,.2,1), box-shadow .36s; }
                                        .rounded-3d:hover { transform: translateY(-6px) rotateX(4deg) rotateY(-2deg) scale(1.02); box-shadow: 0 40px 120px rgba(2,6,23,0.48); }

                                        /* responsive discs: smaller on narrow screens */
                                        @media (max-width: 768px) {
                                            .skill-disc { width:140px; height:140px; }
                                            .skill-disc .ring-bg { stroke-width:14; }
                                            .skill-disc .ring { stroke-width:14; }
                                            .skill-disc .inner { r: 0; }
                                        }

                                            /* header lightning accent */
                                            .header-with-light { display:inline-block; position:relative; }
                                            .header-lightning { position:absolute; right:-34px; top:-18px; opacity:0.9; transform:rotate(-8deg) scale(1); pointer-events:none; filter: drop-shadow(0 8px 20px rgba(250,204,21,0.12)); }

                                                /* profile header refinements */
                                                .profile-pic { border-radius: 9999px; border-width: 4px; border-style: solid; box-shadow: 0 28px 70px rgba(2,6,23,0.36); }
                                                .profile-name { font-family: "Georgia", "Times New Roman", serif; font-weight:800; font-size:2.5rem; line-height:1; color: #ffffff; text-shadow: 0 2px 0 rgba(0,0,0,0.25), 0 8px 30px rgba(2,6,23,0.5); letter-spacing: -0.8px; margin:0; }
                                                @media(min-width:768px) { .profile-name { font-size:3.5rem; } }
                                                .profile-title { color: #cbd5e1; font-size:1.05rem; margin-top:8px; }
                                                .profile-summary { margin-top:1rem; color:#9ca3af; max-width:54ch; }


                                                        .skill-card.selected { box-shadow: 0 30px 80px rgba(99,102,241,0.18), 0 10px 24px rgba(2,6,23,0.15); transform: translateY(-10px) scale(1.02); }

                                        /* Accessibility and contrast tweaks */
                                        /* make disc captions higher contrast and avoid low-contrast grays */
                                        .disc-caption { 
                                            margin-top: 0.6rem; 
                                            text-align: center; 
                                            font-weight: 900; 
                                            color: #000000; 
                                            font-size: 1rem; 
                                            font-family: Georgia, 'Times New Roman', serif; 
                                            letter-spacing: 0.5px;
                                            text-shadow: 
                                                0 0 6px rgba(255, 255, 255, 0.8),
                                                0 0 12px rgba(255, 255, 255, 0.6),
                                                0 0 18px rgba(255, 255, 255, 0.4),
                                                0 2px 4px rgba(0, 0, 0, 0.2);
                                            -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.2);
                                        }
                                        @media (prefers-color-scheme: dark) {
                                            .disc-caption { 
                                                color: #000000; 
                                                text-shadow: 
                                                    0 0 8px rgba(255, 255, 255, 0.9),
                                                    0 0 16px rgba(255, 255, 255, 0.7),
                                                    0 0 24px rgba(255, 255, 255, 0.5),
                                                    0 2px 4px rgba(0, 0, 0, 0.3);
                                            }
                                        }

                                        /* Clear focus-visible outline for keyboard users */
                                        .skill-disc:focus-visible { outline: 3px solid rgba(99,102,241,0.18); outline-offset: 6px; box-shadow: 0 20px 50px rgba(99,102,241,0.12); }
                                        /* improve tooltip visibility when keyboard focusing */
                                        .skill-disc:focus-visible .tooltip { opacity:1 }

                                        /* ==================== ABOUT/CONTACT PAGE 3D STYLING - FIFTY SHADES OF GREY ==================== */
                                        .about-contact-page {
                                            background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 25%, #2d2d2d 50%, #1f1f1f 75%, #121212 100%);
                                            position: relative;
                                            overflow: hidden;
                                        }
                                        .about-contact-page::before {
                                            content: '';
                                            position: absolute;
                                            top: -50%;
                                            left: -50%;
                                            width: 200%;
                                            height: 200%;
                                            background: radial-gradient(circle, rgba(128,128,128,0.15) 0%, rgba(64,64,64,0.1) 40%, transparent 70%);
                                            animation: slow-rotate 30s linear infinite;
                                        }
                                        @keyframes slow-rotate {
                                            from { transform: rotate(0deg); }
                                            to { transform: rotate(360deg); }
                                        }

                                        /* Glowing Header */
                                        .about-header-glow {
                                            position: relative;
                                            z-index: 1;
                                        }
                                        .about-title {
                                            font-size: 3.5rem;
                                            font-weight: 900;
                                            background: linear-gradient(135deg, #e5e5e5, #b8b8b8, #8c8c8c, #606060);
                                            -webkit-background-clip: text;
                                            background-clip: text;
                                            color: transparent;
                                            text-shadow: 0 0 40px rgba(192,192,192,0.5);
                                            animation: title-glow 3s ease-in-out infinite;
                                            font-family: Georgia, serif;
                                            letter-spacing: -1px;
                                        }
                                        @keyframes title-glow {
                                            0%, 100% { filter: drop-shadow(0 0 20px rgba(160,160,160,0.6)); }
                                            50% { filter: drop-shadow(0 0 40px rgba(192,192,192,0.8)); }
                                        }
                                        .about-subtitle {
                                            font-size: 1.125rem;
                                            color: #9ca3af;
                                            margin-top: 0.5rem;
                                            letter-spacing: 2px;
                                            text-transform: uppercase;
                                        }

                                        /* 3D Profile Card */
                                        .profile-card-3d {
                                            background: linear-gradient(145deg, rgba(50,50,50,0.8), rgba(25,25,25,0.9));
                                            border-radius: 24px;
                                            padding: 2rem;
                                            box-shadow: 
                                                0 20px 60px rgba(0,0,0,0.7),
                                                0 0 30px rgba(255,255,255,0.3),
                                                0 0 60px rgba(255,255,255,0.15);
                                            border: 2px solid rgba(255,255,255,0.4);
                                            transform-style: preserve-3d;
                                            transition: all 0.3s ease-out;
                                            position: relative;
                                            z-index: 1;
                                        }
                                        
                                        .profile-card-3d::before {
                                            content: '';
                                            position: absolute;
                                            inset: -2px;
                                            border-radius: 24px;
                                            background: linear-gradient(
                                                135deg,
                                                rgba(255, 255, 255, 0) 0%,
                                                rgba(255, 255, 255, 0.3) 50%,
                                                rgba(255, 255, 255, 0) 100%
                                            );
                                            opacity: 0;
                                            transition: opacity 0.3s ease-out;
                                            z-index: -1;
                                        }
                                        
                                        .profile-card-3d:hover {
                                            transform: translateY(-10px) rotateX(2deg);
                                            background: linear-gradient(145deg, rgba(60,60,60,0.9), rgba(35,35,35,0.95));
                                            box-shadow: 
                                                0 30px 80px rgba(0,0,0,0.8),
                                                0 0 60px rgba(255,255,255,0.8),
                                                0 0 100px rgba(255,255,255,0.6),
                                                0 0 150px rgba(255,255,255,0.4),
                                                0 0 200px rgba(255,255,255,0.2),
                                                inset 0 0 30px rgba(255,255,255,0.1),
                                                inset 0 0 60px rgba(255,255,255,0.05);
                                            border: 3px solid rgba(255,255,255,1);
                                            outline: 2px solid rgba(255,255,255,0.6);
                                            outline-offset: 4px;
                                        }
                                        
                                        .profile-card-3d:hover::before {
                                            opacity: 1;
                                        }
                                        .profile-card-inner {
                                            text-align: center;
                                        }

                                        /* Profile Image with Glow Ring */
                                        .profile-image-container {
                                            position: relative;
                                            display: inline-block;
                                            margin-bottom: 1.5rem;
                                        }
                                        .profile-glow-ring {
                                            position: absolute;
                                            inset: -15px;
                                            border-radius: 50%;
                                            background: conic-gradient(from 0deg, #ffffff, #e0e0e0, #c0c0c0, #ffffff);
                                            animation: ring-spin 4s linear infinite;
                                            opacity: 0.7;
                                            filter: blur(20px);
                                            box-shadow: 
                                                0 0 30px rgba(255,255,255,0.8),
                                                0 0 60px rgba(255,255,255,0.5);
                                        }
                                        @keyframes ring-spin {
                                            from { transform: rotate(0deg); }
                                            to { transform: rotate(360deg); }
                                        }
                                        .profile-img-3d {
                                            position: relative;
                                            width: 200px;
                                            height: 200px;
                                            border-radius: 50%;
                                            object-fit: cover;
                                            border: 4px solid rgba(255,255,255,0.6);
                                            box-shadow: 
                                                0 10px 40px rgba(0,0,0,0.7),
                                                0 0 20px rgba(255,255,255,0.6),
                                                0 0 40px rgba(255,255,255,0.4),
                                                inset 0 4px 8px rgba(200,200,200,0.15);
                                            transition: transform 0.4s ease;
                                            z-index: 1;
                                        }
                                        .profile-card-3d:hover .profile-img-3d {
                                            transform: scale(1.05);
                                            border-color: rgba(255,255,255,0.8);
                                            box-shadow: 
                                                0 15px 50px rgba(0,0,0,0.8),
                                                0 0 40px rgba(160,160,160,0.5),
                                                inset 0 4px 8px rgba(220,220,220,0.2);
                                        }
                                        .profile-shimmer {
                                            position: absolute;
                                            inset: 0;
                                            border-radius: 50%;
                                            background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                                            opacity: 0;
                                            animation: shimmer-sweep 3s ease-in-out infinite;
                                            pointer-events: none;
                                        }
                                        @keyframes shimmer-sweep {
                                            0%, 100% { opacity: 0; transform: translateX(-100%); }
                                            50% { opacity: 1; transform: translateX(100%); }
                                        }

                                        .profile-name-3d {
                                            font-size: 1.875rem;
                                            font-weight: 700;
                                            font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
                                            color: #ffffff !important;
                                            margin-bottom: 0.5rem;
                                            text-shadow: 
                                                0 0 10px rgba(255,255,255,1),
                                                0 0 20px rgba(255,255,255,0.8),
                                                0 0 30px rgba(255,255,255,0.6),
                                                0 0 40px rgba(255,255,255,0.4);
                                            filter: 
                                                blur(0.3px)
                                                drop-shadow(0 0 15px rgba(255,255,255,0.9)) 
                                                drop-shadow(0 0 25px rgba(255,255,255,0.6));
                                            letter-spacing: 0.1em;
                                        }
                                        .profile-title-3d {
                                            font-size: 1rem;
                                            color: #d0d0d0;
                                            text-shadow: 0 0 5px rgba(255,255,255,0.3);
                                            margin-bottom: 1.5rem;
                                        }

                                        /* Contact List with Glowing Items */
                                        .contact-list-3d {
                                            margin-top: 1.5rem;
                                            space-y: 0.75rem;
                                        }
                                        .contact-item-glow {
                                            display: flex;
                                            align-items: center;
                                            gap: 0.75rem;
                                            padding: 0.75rem;
                                            background: rgba(40,40,40,0.6);
                                            border-radius: 12px;
                                            border: 1px solid rgba(140,140,140,0.3);
                                            transition: all 0.3s ease;
                                            margin-bottom: 0.75rem;
                                        }
                                        .contact-item-glow:hover {
                                            background: rgba(60,60,60,0.8);
                                            border-color: rgba(180,180,180,0.6);
                                            transform: translateX(8px);
                                            box-shadow: 
                                                0 4px 20px rgba(128,128,128,0.4),
                                                0 0 30px rgba(160,160,160,0.2),
                                                inset 0 1px 2px rgba(200,200,200,0.1);
                                        }
                                        .contact-icon-wrapper {
                                            width: 36px;
                                            height: 36px;
                                            border-radius: 8px;
                                            background: linear-gradient(135deg, rgba(140,140,140,0.4), rgba(100,100,100,0.4));
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            box-shadow: 0 2px 8px rgba(128,128,128,0.4);
                                        }
                                        .contact-icon {
                                            width: 18px;
                                            height: 18px;
                                            color: #b8b8b8;
                                        }
                                        .contact-link {
                                            color: #c0c0c0;
                                            text-decoration: none;
                                            transition: color 0.3s ease;
                                            font-size: 0.875rem;
                                            background: none;
                                            border: none;
                                            cursor: pointer;
                                            padding: 0;
                                            font-family: inherit;
                                        }
                                        .contact-link:hover {
                                            color: #e0e0e0;
                                            text-shadow: 0 0 10px rgba(192,192,192,0.6);
                                        }
                                        .contact-text {
                                            color: #d0d0d0;
                                            font-size: 0.875rem;
                                        }

                                        /* 3D CTA Button */
                                        .cta-button-3d {
                                            display: inline-block;
                                            position: relative;
                                            padding: 0.875rem 2rem;
                                            background: linear-gradient(135deg, #808080, #606060, #404040);
                                            border-radius: 12px;
                                            text-decoration: none;
                                            overflow: hidden;
                                            cursor: pointer;
                                            border: 2px solid rgba(255,255,255,0.3);
                                            box-shadow: 
                                                0 8px 24px rgba(80,80,80,0.5),
                                                0 0 20px rgba(255,255,255,0.4),
                                                0 0 40px rgba(255,255,255,0.2),
                                                inset 0 2px 4px rgba(200,200,200,0.2);
                                            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                                            outline: none;
                                        }
                                        .cta-button-3d:focus {
                                            outline: 2px solid rgba(255,255,255,0.6);
                                            outline-offset: 2px;
                                        }
                                        .cta-button-3d:active {
                                            transform: translateY(-2px) scale(1.02);
                                        }
                                        .cta-button-3d:hover {
                                            transform: translateY(-4px) scale(1.05);
                                            border-color: rgba(255,255,255,0.6);
                                            box-shadow: 
                                                0 16px 48px rgba(120,120,120,0.7),
                                                0 0 30px rgba(255,255,255,0.8),
                                                0 0 60px rgba(255,255,255,0.6),
                                                0 0 90px rgba(255,255,255,0.4),
                                                inset 0 2px 4px rgba(220,220,220,0.3);
                                        }
                                        .cta-text {
                                            position: relative;
                                            z-index: 1;
                                            color: #ffffff;
                                            font-weight: 700;
                                            font-size: 1rem;
                                            text-shadow: 
                                                0 0 5px rgba(255,255,255,0.6),
                                                0 0 10px rgba(255,255,255,0.4),
                                                0 0 20px rgba(255,255,255,0.3);
                                            pointer-events: none;
                                        }
                                        .cta-glow {
                                            position: absolute;
                                            inset: 0;
                                            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
                                            transform: translateX(-100%);
                                            transition: transform 0.6s;
                                            pointer-events: none;
                                        }
                                        .cta-button-3d:hover .cta-glow {
                                            transform: translateX(100%);
                                        }

                                        /* Content Cards */
                                        .content-card-3d {
                                            background: linear-gradient(145deg, rgba(50,50,50,0.7), rgba(30,30,30,0.9));
                                            border-radius: 20px;
                                            padding: 2rem;
                                            box-shadow: 
                                                0 10px 40px rgba(0,0,0,0.6),
                                                0 0 20px rgba(255,255,255,0.3),
                                                0 0 40px rgba(255,255,255,0.15),
                                                inset 0 2px 4px rgba(180,180,180,0.08),
                                                inset 0 -2px 8px rgba(255,255,255,0.05);
                                            border: 2px solid rgba(255,255,255,0.4);
                                            transition: all 0.3s ease-out;
                                            position: relative;
                                            z-index: 1;
                                            overflow: hidden;
                                            cursor: pointer;
                                        }
                                        /* Highlighted zone overlay */
                                        .content-card-3d::before {
                                            content: '';
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            right: 0;
                                            height: 50%;
                                            background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
                                            pointer-events: none;
                                            z-index: 0;
                                            transition: all 0.3s ease-out;
                                        }
                                        /* Glowing accent corner */
                                        .content-card-3d::after {
                                            content: '';
                                            position: absolute;
                                            top: -50px;
                                            right: -50px;
                                            width: 150px;
                                            height: 150px;
                                            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                                            border-radius: 50%;
                                            pointer-events: none;
                                            z-index: 0;
                                            transition: all 0.3s ease-out;
                                        }
                                            height: 150px;
                                            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                                            border-radius: 50%;
                                            pointer-events: none;
                                            z-index: 0;
                                            transition: all 0.4s ease;
                                        }
                                        .content-card-3d:hover {
                                            transform: translateY(-10px) scale(1.03);
                                            background: linear-gradient(145deg, rgba(60,60,60,0.8), rgba(40,40,40,0.95));
                                            box-shadow: 
                                                0 25px 70px rgba(0,0,0,0.8),
                                                0 0 60px rgba(255,255,255,0.8),
                                                0 0 100px rgba(255,255,255,0.6),
                                                0 0 150px rgba(255,255,255,0.4),
                                                0 0 200px rgba(255,255,255,0.2),
                                                inset 0 0 30px rgba(255,255,255,0.15),
                                                inset 0 0 60px rgba(255,255,255,0.08);
                                            border: 3px solid rgba(255,255,255,1);
                                            outline: 2px solid rgba(255,255,255,0.6);
                                            outline-offset: 4px;
                                        }
                                        .content-card-3d:hover::before {
                                            background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%);
                                        }
                                        .content-card-3d:hover::after {
                                            width: 250px;
                                            height: 250px;
                                            top: -70px;
                                            right: -70px;
                                            background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
                                        }
                                            top: 0;
                                            left: 0;
                                            right: 0;
                                            height: 50%;
                                            background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%);
                                            pointer-events: none;
                                            z-index: 0;
                                        }
                                        /* Glowing accent corner */
                                        .content-card-3d::after {
                                            content: '';
                                            position: absolute;
                                            top: -50px;
                                            right: -50px;
                                            width: 150px;
                                            height: 150px;
                                            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                                            border-radius: 50%;
                                            pointer-events: none;
                                            z-index: 0;
                                        }
                                        .content-card-3d:hover {
                                            transform: translateY(-6px);
                                            box-shadow: 
                                                0 20px 60px rgba(128,128,128,0.4),
                                                0 0 30px rgba(255,255,255,0.6),
                                                0 0 60px rgba(255,255,255,0.4),
                                                0 0 90px rgba(255,255,255,0.2),
                                                inset 0 2px 4px rgba(200,200,200,0.12);
                                            border-color: rgba(255,255,255,0.6);
                                        }
                                        .content-card-3d:hover::before {
                                            background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
                                        }
                                        .content-card-header {
                                            margin-bottom: 1.5rem;
                                            position: relative;
                                            z-index: 1;
                                        }
                                        .content-title-glow {
                                            position: relative;
                                            z-index: 100;
                                            font-size: 1.5rem;
                                            font-weight: 600;
                                            font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
                                            color: #ffffff !important;
                                            text-shadow: 
                                                0 0 10px rgba(255,255,255,1),
                                                0 0 20px rgba(255,255,255,0.8),
                                                0 0 30px rgba(255,255,255,0.6),
                                                0 0 40px rgba(255,255,255,0.4);
                                            filter: 
                                                blur(0.3px)
                                                drop-shadow(0 0 15px rgba(255,255,255,0.9)) 
                                                drop-shadow(0 0 25px rgba(255,255,255,0.7));
                                            letter-spacing: 0.1em;
                                            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                                        }
                                        .content-title-glow:hover {
                                            transform: translateY(-2px) scale(1.02);
                                            text-shadow: 
                                                0 0 15px rgba(255,255,255,1),
                                                0 0 25px rgba(255,255,255,0.9),
                                                0 0 35px rgba(255,255,255,0.7),
                                                0 0 45px rgba(255,255,255,0.5);
                                            filter: 
                                                blur(0.3px)
                                                drop-shadow(0 0 20px rgba(255,255,255,1)) 
                                                drop-shadow(0 0 30px rgba(255,255,255,0.8));
                                        }
                                        .title-underline-glow {
                                            width: 60px;
                                            height: 3px;
                                            background: linear-gradient(90deg, #ffffff, #e0e0e0, transparent);
                                            margin-top: 0.5rem;
                                            border-radius: 2px;
                                            box-shadow: 
                                                0 0 10px rgba(255,255,255,0.9),
                                                0 0 20px rgba(255,255,255,0.7),
                                                0 0 30px rgba(255,255,255,0.5);
                                        }
                                        .content-text-3d {
                                            color: #d8d8d8;
                                            line-height: 1.7;
                                            font-size: 1rem;
                                            position: relative;
                                            z-index: 1;
                                        }

                                        /* Goals List */
                                        .goals-list-3d {
                                            list-style: none;
                                            padding: 0;
                                            margin: 0;
                                        }
                                        .goal-item-glow {
                                            display: flex;
                                            align-items: flex-start;
                                            gap: 1rem;
                                            padding: 1rem;
                                            margin-bottom: 0.75rem;
                                            background: rgba(40,40,40,0.5);
                                            border-radius: 12px;
                                            border: 1px solid rgba(120,120,120,0.2);
                                            transition: all 0.3s ease;
                                            color: #d0d0d0;
                                            position: relative;
                                            overflow: hidden;
                                        }
                                        /* Highlighted zone for goal items */
                                        .goal-item-glow::before {
                                            content: '';
                                            position: absolute;
                                            left: 0;
                                            top: 0;
                                            bottom: 0;
                                            width: 4px;
                                            background: linear-gradient(180deg, #ffffff, #c0c0c0, #808080);
                                            box-shadow: 0 0 10px rgba(255,255,255,0.5);
                                            transition: all 0.3s ease;
                                        }
                                        .goal-item-glow:hover {
                                            background: rgba(60,60,60,0.7);
                                            border-color: rgba(160,160,160,0.4);
                                            transform: translateX(6px);
                                            box-shadow: 
                                                0 4px 16px rgba(128,128,128,0.3),
                                                0 0 20px rgba(160,160,160,0.2);
                                        }
                                        .goal-item-glow:hover::before {
                                            width: 6px;
                                            box-shadow: 0 0 15px rgba(255,255,255,0.8);
                                        }
                                        .goal-bullet {
                                            display: block;
                                            width: 8px;
                                            height: 8px;
                                            min-width: 8px;
                                            border-radius: 50%;
                                            background: linear-gradient(135deg, #ffffff, #c0c0c0);
                                            box-shadow: 0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(200,200,200,0.5);
                                            margin-top: 0.5rem;
                                        }
                                            width: 8px;
                                            height: 8px;
                                            min-width: 8px;
                                            border-radius: 50%;
                                            background: linear-gradient(135deg, #b0b0b0, #808080);
                                            box-shadow: 0 0 10px rgba(144,144,144,0.7);
                                            margin-top: 0.5rem;
                                        }

                                        /* Global White Glowing Titles - Front Layer with Enhanced Visibility */
                                        .content-title-3d {
                                            position: relative;
                                            z-index: 100;
                                            font-size: 1.5rem;
                                            font-weight: 700;
                                            font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
                                            color: #ffffff !important;
                                            text-shadow: 
                                                0 0 10px rgba(255,255,255,1),
                                                0 0 20px rgba(255,255,255,0.8),
                                                0 0 30px rgba(255,255,255,0.6),
                                                0 0 40px rgba(255,255,255,0.4);
                                            filter: 
                                                blur(0.3px)
                                                drop-shadow(0 0 15px rgba(255,255,255,0.9))
                                                drop-shadow(0 0 25px rgba(255,255,255,0.7));
                                            letter-spacing: 0.1em;
                                            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                                        }

                                        .content-title-3d:hover {
                                            transform: translateY(-2px) scale(1.02);
                                            text-shadow: 
                                                0 0 15px rgba(255,255,255,1),
                                                0 0 25px rgba(255,255,255,1),
                                                0 0 35px rgba(255,255,255,0.8),
                                                0 0 45px rgba(255,255,255,0.6);
                                            filter: 
                                                blur(0.3px)
                                                drop-shadow(0 0 20px rgba(255,255,255,1))
                                                drop-shadow(0 0 30px rgba(255,255,255,0.9));
                                        }

                                        /* Availability Highlight */
                                        .availability-card-highlight {
                                            border: 2px solid rgba(160,160,160,0.5);
                                            background: linear-gradient(145deg, rgba(100,100,100,0.15), rgba(50,50,50,0.9));
                                        }
                                        .availability-badge-3d {
                                            margin-top: 1.5rem;
                                            display: inline-flex;
                                            align-items: center;
                                            gap: 0.75rem;
                                            padding: 0.75rem 1.5rem;
                                            background: linear-gradient(135deg, rgba(34,197,94,0.3), rgba(22,163,74,0.3));
                                            border: 2px solid rgba(255,255,255,0.4);
                                            border-radius: 24px;
                                            box-shadow: 
                                                0 4px 16px rgba(34,197,94,0.4),
                                                0 0 20px rgba(255,255,255,0.4),
                                                0 0 40px rgba(255,255,255,0.2),
                                                0 0 20px rgba(34,197,94,0.3);
                                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                            cursor: default;
                                        }
                                        .availability-badge-3d:hover {
                                            border-color: rgba(255,255,255,0.6);
                                            box-shadow: 
                                                0 4px 20px rgba(34,197,94,0.5),
                                                0 0 30px rgba(255,255,255,0.6),
                                                0 0 60px rgba(255,255,255,0.4),
                                                0 0 90px rgba(255,255,255,0.2),
                                                0 0 30px rgba(34,197,94,0.4);
                                            transform: translateY(-2px) scale(1.02);
                                        }
                                        .badge-pulse {
                                            width: 10px;
                                            height: 10px;
                                            border-radius: 50%;
                                            background: #22c55e;
                                            box-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e;
                                            animation: pulse-grow 2s ease-in-out infinite;
                                        }
                                        @keyframes pulse-grow {
                                            0%, 100% { transform: scale(1); opacity: 1; }
                                            50% { transform: scale(1.3); opacity: 0.8; }
                                        }
                                        .badge-text {
                                            color: #22c55e;
                                            font-weight: 700;
                                            font-size: 0.875rem;
                                        }

                                        /* Glitch Effects for Stats Card */
                                        .glitch-container {
                                            position: relative;
                                            animation: container-glitch 8s infinite;
                                        }
                                        
                                        @keyframes container-glitch {
                                            0%, 90%, 100% { transform: translate(0); }
                                            91% { transform: translate(-2px, 2px); }
                                            92% { transform: translate(2px, -2px); }
                                            93% { transform: translate(-1px, 1px); }
                                            94% { transform: translate(1px, -1px); }
                                        }
                                        
                                        .glitch-overlay {
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            opacity: 0;
                                            pointer-events: none;
                                            z-index: 5;
                                        }
                                        
                                        .glitch-overlay-1 {
                                            background: linear-gradient(90deg, 
                                                transparent 0%, 
                                                rgba(255, 0, 0, 0.1) 25%, 
                                                transparent 50%, 
                                                rgba(0, 255, 255, 0.1) 75%, 
                                                transparent 100%);
                                            animation: glitch-1 7s infinite;
                                        }
                                        
                                        .glitch-overlay-2 {
                                            background: linear-gradient(180deg, 
                                                transparent 0%, 
                                                rgba(0, 255, 0, 0.05) 50%, 
                                                transparent 100%);
                                            animation: glitch-2 5s infinite;
                                        }
                                        
                                        @keyframes glitch-1 {
                                            0%, 85%, 100% { opacity: 0; transform: translateX(0); }
                                            86% { opacity: 0.7; transform: translateX(-5px); }
                                            87% { opacity: 0.5; transform: translateX(5px); }
                                            88% { opacity: 0.3; transform: translateX(-3px); }
                                            89% { opacity: 0; transform: translateX(0); }
                                        }
                                        
                                        @keyframes glitch-2 {
                                            0%, 80%, 100% { opacity: 0; transform: translateY(0); }
                                            81% { opacity: 0.4; transform: translateY(-3px); }
                                            82% { opacity: 0.6; transform: translateY(3px); }
                                            83% { opacity: 0.2; transform: translateY(-2px); }
                                            84% { opacity: 0; transform: translateY(0); }
                                        }
                                        
                                        .scanline {
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 2px;
                                            background: linear-gradient(90deg, 
                                                transparent 0%, 
                                                rgba(255, 255, 255, 0.3) 50%, 
                                                transparent 100%);
                                            animation: scanline-move 3s linear infinite;
                                            z-index: 6;
                                            pointer-events: none;
                                        }
                                        
                                        @keyframes scanline-move {
                                            0% { top: 0%; opacity: 0.7; }
                                            50% { opacity: 0.3; }
                                            100% { top: 100%; opacity: 0.7; }
                                        }
                                        
                                        .glitch-text {
                                            position: relative;
                                            animation: text-glitch 6s infinite;
                                        }
                                        
                                        .glitch-text::before,
                                        .glitch-text::after {
                                            content: attr(data-text);
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            opacity: 0;
                                        }
                                        
                                        .glitch-text::before {
                                            color: #ff00ff;
                                            animation: glitch-text-1 4s infinite;
                                            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
                                        }
                                        
                                        .glitch-text::after {
                                            color: #00ffff;
                                            animation: glitch-text-2 3s infinite;
                                            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
                                        }
                                        
                                        @keyframes text-glitch {
                                            0%, 92%, 100% { transform: translate(0); }
                                            93% { transform: translate(-1px, 1px); }
                                            94% { transform: translate(1px, -1px); }
                                        }
                                        
                                        @keyframes glitch-text-1 {
                                            0%, 88%, 100% { opacity: 0; transform: translate(0); }
                                            89% { opacity: 0.8; transform: translate(-2px, 2px); }
                                            90% { opacity: 0; transform: translate(0); }
                                        }
                                        
                                        @keyframes glitch-text-2 {
                                            0%, 90%, 100% { opacity: 0; transform: translate(0); }
                                            91% { opacity: 0.8; transform: translate(2px, -2px); }
                                            92% { opacity: 0; transform: translate(0); }
                                        }

                                        /* 3D Keyboard Key Style Tabs */
                                        .keyboard-key {
                                            position: relative;
                                            cursor: pointer;
                                            border: none;
                                            outline: none;
                                        }
                                        
                                        .keyboard-key-inactive {
                                            background: linear-gradient(180deg, #fde047 0%, #facc15 50%, #eab308 100%);
                                            color: #1f2937;
                                            box-shadow: 
                                                0 4px 0 0 #ca8a04,
                                                0 6px 8px rgba(0, 0, 0, 0.3),
                                                inset 0 1px 0 rgba(255, 255, 255, 0.5),
                                                inset 0 -1px 0 rgba(0, 0, 0, 0.2);
                                            transform: translateY(0);
                                        }
                                        
                                        .keyboard-key-inactive:hover {
                                            background: linear-gradient(180deg, #fef08a 0%, #fde047 50%, #facc15 100%);
                                            box-shadow: 
                                                0 4px 0 0 #ca8a04,
                                                0 6px 12px rgba(0, 0, 0, 0.4),
                                                inset 0 1px 0 rgba(255, 255, 255, 0.6),
                                                inset 0 -1px 0 rgba(0, 0, 0, 0.2);
                                        }
                                        
                                        .keyboard-key-inactive:active {
                                            transform: translateY(2px);
                                            box-shadow: 
                                                0 2px 0 0 #ca8a04,
                                                0 3px 5px rgba(0, 0, 0, 0.3),
                                                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                                                inset 0 -1px 0 rgba(0, 0, 0, 0.3);
                                        }
                                        
                                        .keyboard-key-active {
                                            background: linear-gradient(180deg, #facc15 0%, #eab308 50%, #ca8a04 100%);
                                            color: #000000;
                                            box-shadow: 
                                                0 2px 0 0 #854d0e,
                                                0 4px 10px rgba(250, 204, 21, 0.6),
                                                0 0 20px rgba(250, 204, 21, 0.4),
                                                inset 0 2px 4px rgba(0, 0, 0, 0.3),
                                                inset 0 -1px 0 rgba(255, 255, 255, 0.3);
                                            transform: translateY(2px) scale(1.05);
                                        }

                                        /* Unified Lounge Card Design - White Glow Backlighting */
                                        .lounge-card {
                                            background: linear-gradient(145deg, 
                                                rgba(45, 45, 45, 0.85), 
                                                rgba(25, 25, 25, 0.95));
                                            border-radius: 24px;
                                            padding: 2rem;
                                            position: relative;
                                            border: 2px solid rgba(255, 255, 255, 0.3);
                                            box-shadow: 
                                                0 8px 32px rgba(0, 0, 0, 0.6),
                                                0 0 40px rgba(255, 255, 255, 0.12),
                                                0 0 80px rgba(255, 255, 255, 0.06);
                                            transition: all 0.3s ease-out;
                                            overflow: hidden;
                                            cursor: pointer;
                                        }

                                        /* Intense white glow backlight effect */
                                        .lounge-card::before {
                                            content: '';
                                            position: absolute;
                                            top: -100%;
                                            left: -100%;
                                            width: 300%;
                                            height: 300%;
                                            background: radial-gradient(
                                                circle at center,
                                                rgba(255, 255, 255, 0.5) 0%,
                                                rgba(255, 255, 255, 0.3) 20%,
                                                rgba(255, 255, 255, 0.15) 40%,
                                                transparent 60%
                                            );
                                            opacity: 0;
                                            pointer-events: none;
                                            z-index: 0;
                                            transition: all 0.3s ease-out;
                                            transform: scale(0.8);
                                        }

                                        /* Subtle top highlight */
                                        .lounge-card::after {
                                            content: '';
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            right: 0;
                                            height: 40%;
                                            background: linear-gradient(
                                                180deg,
                                                rgba(255, 255, 255, 0.08) 0%,
                                                transparent 100%
                                            );
                                            pointer-events: none;
                                            z-index: 0;
                                            border-radius: 24px 24px 0 0;
                                            transition: all 0.3s ease-out;
                                        }

                                        .lounge-card:hover {
                                            transform: translateY(-12px) scale(1.03);
                                            background: linear-gradient(145deg, 
                                                rgba(55, 55, 55, 0.9), 
                                                rgba(35, 35, 35, 0.98));
                                            box-shadow: 
                                                0 25px 70px rgba(0, 0, 0, 0.9),
                                                0 0 80px rgba(255, 255, 255, 0.7),
                                                0 0 120px rgba(255, 255, 255, 0.5),
                                                0 0 160px rgba(255, 255, 255, 0.35),
                                                0 0 200px rgba(255, 255, 255, 0.2),
                                                0 0 250px rgba(255, 255, 255, 0.1),
                                                inset 0 0 40px rgba(255, 255, 255, 0.15),
                                                inset 0 0 80px rgba(255, 255, 255, 0.08);
                                            border: 3px solid rgba(255, 255, 255, 1);
                                            outline: 2px solid rgba(255, 255, 255, 0.6);
                                            outline-offset: 4px;
                                        }

                                        .lounge-card:hover::before {
                                            opacity: 1;
                                            transform: scale(1);
                                        }

                                        .lounge-card:hover::after {
                                            background: linear-gradient(
                                                180deg,
                                                rgba(255, 255, 255, 0.25) 0%,
                                                rgba(255, 255, 255, 0.05) 100%
                                            );
                                        }

                                        /* Content inside cards needs higher z-index */
                                        .lounge-card > * {
                                            position: relative;
                                            z-index: 1;
                                        }

                                        /* Interactive Highlight Zones - Reactive Throughout Showcase */
                                        .interactive-zone {
                                            position: relative;
                                            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                                            cursor: pointer;
                                        }

                                        .interactive-zone::before {
                                            content: '';
                                            position: absolute;
                                            inset: -4px;
                                            border-radius: inherit;
                                            background: linear-gradient(
                                                135deg,
                                                rgba(255, 255, 255, 0) 0%,
                                                rgba(255, 255, 255, 0.15) 50%,
                                                rgba(255, 255, 255, 0) 100%
                                            );
                                            opacity: 0;
                                            z-index: -1;
                                            transition: opacity 0.4s ease;
                                        }

                                        .interactive-zone:hover::before {
                                            opacity: 1;
                                        }

                                        .interactive-zone:hover {
                                            transform: translateY(-3px);
                                            box-shadow: 
                                                0 0 30px rgba(255, 255, 255, 0.3),
                                                0 0 60px rgba(255, 255, 255, 0.15),
                                                0 10px 30px rgba(0, 0, 0, 0.3);
                                        }

                                        /* Text highlight zones */
                                        .text-highlight-zone {
                                            position: relative;
                                            display: inline-block;
                                            padding: 0.25rem 0.5rem;
                                            border-radius: 8px;
                                            transition: all 0.3s ease;
                                        }

                                        .text-highlight-zone:hover {
                                            background: linear-gradient(
                                                135deg,
                                                rgba(255, 255, 255, 0.1) 0%,
                                                rgba(255, 255, 255, 0.05) 100%
                                            );
                                            box-shadow: 
                                                0 0 20px rgba(255, 255, 255, 0.2),
                                                inset 0 0 15px rgba(255, 255, 255, 0.05);
                                            transform: scale(1.02);
                                        }

                                        /* Pulsing highlight animation for key areas */
                                        @keyframes pulse-highlight {
                                            0%, 100% {
                                                box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                                            }
                                            50% {
                                                box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
                                            }
                                        }

                                        .pulse-highlight {
                                            animation: pulse-highlight 3s ease-in-out infinite;
                                        }

                                        /* Shimmer effect for interactive elements */
                                        @keyframes shimmer-sweep {
                                            0% {
                                                transform: translateX(-100%) rotate(45deg);
                                            }
                                            100% {
                                                transform: translateX(200%) rotate(45deg);
                                            }
                                        }

                                        .shimmer-zone {
                                            position: relative;
                                            overflow: hidden;
                                        }

                                        .shimmer-zone::after {
                                            content: '';
                                            position: absolute;
                                            top: -50%;
                                            left: -50%;
                                            width: 50%;
                                            height: 200%;
                                            background: linear-gradient(
                                                90deg,
                                                transparent 0%,
                                                rgba(255, 255, 255, 0.3) 50%,
                                                transparent 100%
                                            );
                                            transform: translateX(-100%) rotate(45deg);
                                            transition: transform 0.6s ease;
                                        }

                                        .shimmer-zone:hover::after {
                                            animation: shimmer-sweep 0.8s ease;
                                        }

                                        /* Reactive border glow */
                                        .border-glow-zone {
                                            position: relative;
                                            border: 2px solid rgba(255, 255, 255, 0.2);
                                            transition: all 0.4s ease;
                                        }

                                        .border-glow-zone:hover {
                                            border-color: rgba(255, 255, 255, 0.6);
                                            box-shadow: 
                                                0 0 30px rgba(255, 255, 255, 0.3),
                                                inset 0 0 20px rgba(255, 255, 255, 0.1);
                                        }

                                        /* Spotlight effect on hover */
                                        .spotlight-zone {
                                            position: relative;
                                            transition: all 0.4s ease;
                                        }

                                        .spotlight-zone::before {
                                            content: '';
                                            position: absolute;
                                            top: 50%;
                                            left: 50%;
                                            width: 0%;
                                            height: 0%;
                                            background: radial-gradient(
                                                circle,
                                                rgba(255, 255, 255, 0.2) 0%,
                                                transparent 70%
                                            );
                                            transform: translate(-50%, -50%);
                                            transition: all 0.5s ease;
                                            pointer-events: none;
                                            z-index: -1;
                                            border-radius: 50%;
                                        }

                                        .spotlight-zone:hover::before {
                                            width: 200%;
                                            height: 200%;
                                        }
                                    `}</style>
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-8 md:p-12 transition-colors duration-500 font-sans">
                <ThemeToggle />
                
                {/* UV Clock - Fixed in Upper Right Corner */}
                <div 
                    className="uv-clock-container"
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 50,
                        background: 'linear-gradient(135deg, rgba(138,43,226,0.15), rgba(75,0,130,0.15))',
                        borderRadius: '16px',
                        border: '2px solid rgba(138,43,226,0.4)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 8px 32px rgba(138,43,226,0.3), inset 0 2px 4px rgba(138,43,226,0.2), 0 0 40px rgba(138,43,226,0.2)',
                        padding: '0.75rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        animation: 'uv-glow 4s ease-in-out infinite',
                        overflow: 'hidden',
                        minWidth: '140px'
                    }}
                    onClick={(e) => {
                        e.currentTarget.style.animation = 'uv-pulse 0.6s ease';
                        setTimeout(() => {
                            e.currentTarget.style.animation = 'uv-glow 4s ease-in-out infinite';
                        }, 600);
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.boxShadow = '0 15px 50px rgba(138,43,226,0.6), 0 0 80px rgba(138,43,226,0.5), inset 0 3px 6px rgba(138,43,226,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(138,43,226,0.3), inset 0 2px 4px rgba(138,43,226,0.2), 0 0 40px rgba(138,43,226,0.2)';
                    }}
                >
                    {/* UV Background Orb */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '150%',
                        height: '150%',
                        background: 'radial-gradient(circle, rgba(138,43,226,0.3), rgba(75,0,130,0.1) 60%, transparent)',
                        animation: 'uv-orb-pulse 3s ease-in-out infinite',
                        pointerEvents: 'none',
                        filter: 'blur(30px)'
                    }} />

                    {/* Time Display */}
                    <div style={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '1.75rem',
                            fontWeight: 900,
                            color: '#ffffff',
                            textShadow: '0 0 20px rgba(138,43,226,0.9), 0 0 40px rgba(138,43,226,0.7), 0 0 60px rgba(138,43,226,0.5)',
                            letterSpacing: '0.05em',
                            fontFamily: '"Fira Code", monospace',
                            transform: 'perspective(1000px) rotateX(5deg)',
                            transformStyle: 'preserve-3d',
                            WebkitTextStroke: '1.5px rgba(255,255,255,0.4)',
                            lineHeight: 1
                        }}>
                            {currentTime.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                            })}
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={goToPrevPage} 
                    disabled={currentPage === 0} 
                    title="Previous page" 
                    aria-label="Previous page" 
                    className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 disabled:opacity-0 disabled:cursor-not-allowed"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.6)',
                        boxShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={(e) => {
                        if (currentPage !== 0) {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.5), 0 0 90px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.4)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,1), rgba(250,250,250,1))';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.3)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))';
                    }}
                >
                    <LeftArrowIcon className="w-5 h-5 text-gray-800" />
                    <span className="hidden md:inline text-sm font-bold text-gray-800">Prev</span>
                </button>
                <button 
                    onClick={goToNextPage} 
                    disabled={currentPage === pages.length - 1} 
                    title="Next page" 
                    aria-label="Next page" 
                    className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 disabled:opacity-0 disabled:cursor-not-allowed"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.6)',
                        boxShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={(e) => {
                        if (currentPage !== pages.length - 1) {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.5), 0 0 90px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.4)';
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,1), rgba(250,250,250,1))';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.3)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))';
                    }}
                >
                    <span className="hidden md:inline text-sm font-bold text-gray-800">Next</span>
                    <RightArrowIcon className="w-5 h-5 text-gray-800" />
                </button>

                <div id="resume-container" className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-2xl dark:shadow-black/50 rounded-lg overflow-hidden">
                    <div id="page-content" className="animate-fadeIn">
                        {pages[currentPage]}
                    </div>
                </div>

                {/* Contact Form Modal */}
                {showContactForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactForm(false)}>
                        <div 
                            className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl p-8 animate-fadeIn" 
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                border: '2px solid rgba(255,255,255,0.4)',
                                boxShadow: '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.2), 0 20px 60px rgba(0,0,0,0.5)'
                            }}
                        >
                            <button 
                                onClick={() => setShowContactForm(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold transition-all duration-300"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                ×
                            </button>
                            
                            <h2 
                                className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6"
                                style={{
                                    textShadow: '0 0 10px rgba(255,255,255,0.3)'
                                }}
                            >
                                Contact Me
                            </h2>
                            
                            <form onSubmit={handleContactFormSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={contactFormData.name}
                                        onChange={(e) => setContactFormData({...contactFormData, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={contactFormData.email}
                                        onChange={(e) => setContactFormData({...contactFormData, email: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        required
                                        value={contactFormData.subject}
                                        onChange={(e) => setContactFormData({...contactFormData, subject: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Let's work together"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={6}
                                        value={contactFormData.message}
                                        onChange={(e) => setContactFormData({...contactFormData, message: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Tell me about your project or inquiry..."
                                    />
                                </div>

                                <div className="flex gap-4 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowContactForm(false)}
                                        className="px-6 py-3 rounded-lg border text-gray-700 dark:text-gray-300 transition-all duration-300"
                                        style={{
                                            borderColor: 'rgba(255,255,255,0.3)',
                                            boxShadow: '0 0 10px rgba(255,255,255,0.1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                                            e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                            e.currentTarget.style.boxShadow = '0 0 10px rgba(255,255,255,0.1)';
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold transition-all duration-300"
                                        style={{
                                            border: '2px solid rgba(255,255,255,0.4)',
                                            boxShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.3)',
                                            textShadow: '0 0 10px rgba(255,255,255,0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                                            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.7), 0 0 60px rgba(255,255,255,0.5), 0 0 90px rgba(255,255,255,0.3), 0 12px 32px rgba(0,0,0,0.4)';
                                            e.currentTarget.style.textShadow = '0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 8px 24px rgba(0,0,0,0.3)';
                                            e.currentTarget.style.textShadow = '0 0 10px rgba(255,255,255,0.3)';
                                        }}
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default App;
