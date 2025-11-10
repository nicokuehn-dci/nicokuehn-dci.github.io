
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
    contact: { email: "nico.code.evo@gmail.com", phone: "as requested", location: "Aue-Bad Schlema, DE", github: "github.com/nicokuehn-dci", githubLink: "https://github.com/nicokuehn-dci?tab=repositories" },
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
    <span className="inline-block bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full transform hover:-translate-y-1 hover:scale-105 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 cursor-default">{skill}</span>
);

const InterestTag: React.FC<{ interest: string }> = ({ interest }) => (
    <span className="inline-block bg-transparent border border-gray-300 text-gray-600 dark:bg-transparent dark:border-gray-600 dark:text-gray-400 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full transform hover:-translate-y-1 transition-transform duration-200 cursor-default">{interest}</span>
);

const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="inline-block font-serif text-2xl font-bold text-white mb-4 py-2 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">{title}</h3>
        {children}
    </div>
);

// --- PAGE COMPONENTS ---

const ResumePage: React.FC<{ data: ResumeData, onDownloadPdf: () => void }> = ({ data, onDownloadPdf }) => (
    <>
        <header className="bg-white dark:bg-gray-800 p-8 md:p-12 transition-colors duration-500">
            <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                    <img src={data.profilePictureUrl} alt={data.name} className="profile-pic w-44 h-44 rounded-full rounded-3d object-cover border-4 border-gray-200 dark:border-gray-700 shadow-lg transform hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h1 className="profile-name">{data.name}</h1>
                    <h2 className="profile-title">{data.title}</h2>
                    <p className="profile-summary">{data.summary}</p>
                </div>
            </div>
        </header>
        <hr className="border-t border-gray-200 dark:border-gray-700" />
        <main className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2 p-8">
                <section className="mb-10">
                    <h2 className="inline-block text-3xl font-serif font-bold text-white mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">Education</h2>
                    {data.education.map((edu, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline"><h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{edu.degree}</h3><p className="text-sm font-light text-gray-500 dark:text-gray-400">{edu.location}</p></div>
                            <p className="font-medium text-gray-600 dark:text-gray-300">{edu.institution}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">{edu.date}</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-2 italic font-semibold">Courses</p>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1"><li>{edu.courses.join(', ')}</li><li>{edu.description}</li></ul>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="inline-block text-3xl font-serif font-bold text-white mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">Work Experience</h2>
                    {data.workExperience.map((job, index) => (
                        <div key={index} className="mb-6 p-4 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{job.role}</h3>
                                    <p className="font-semibold text-gray-600 dark:text-gray-300">{job.company}</p>
                                </div>
                                <div className="text-right flex-shrink-0 pl-4">
                                    <p className="font-medium text-gray-500 dark:text-gray-400">{job.date}</p>
                                    <p className="text-sm font-light text-gray-400 dark:text-gray-500">{job.location}</p>
                                </div>
                            </div>
                            <p className="italic text-gray-500 dark:text-gray-400 my-2">{job.description}</p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">{job.subRole}</p>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1 marker:text-gray-400">
                                {job.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            </div>
            <aside className="md:col-span-1 bg-gray-50 dark:bg-gray-800/40 p-8 border-l border-gray-200 dark:border-gray-700 transition-colors duration-500">
                <div className="sticky top-8">
                    <SidebarSection title="Contact">
                        <a href={`mailto:${data.contact.email}`} className="flex items-center mb-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"><MailIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" /><span>{data.contact.email}</span></a>
                        <div className="flex items-center mb-3 text-gray-600 dark:text-gray-300"><PhoneIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" /><span>{data.contact.phone}</span></div>
                        <div className="flex items-center mb-3 text-gray-600 dark:text-gray-300"><LocationIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" /><span>{data.contact.location}</span></div>
                        <a href={data.contact.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"><GithubIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" /><span>{data.contact.github}</span></a>
                        <button onClick={onDownloadPdf} className="flex items-center mt-4 w-full text-left text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"><DownloadIcon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" /><span>Download as PDF</span></button>
                    </SidebarSection>
                    <SidebarSection title="Skills"><div className="flex flex-wrap">{data.skills.map((skill, index) => <SkillTag key={index} skill={skill} />)}</div></SidebarSection>
                    <SidebarSection title="Personal Projects">{data.personalProjects.map((project, index) => (<div key={index} className="mb-4"><h4 className="font-semibold text-gray-700 dark:text-gray-300">{project.name} <span className="text-sm font-light text-gray-500 dark:text-gray-400">({project.date})</span></h4><p className="text-gray-600 dark:text-gray-400 text-sm">{project.description}</p></div>))}</SidebarSection>
                    <SidebarSection title="Languages">{data.languages.map((lang, index) => (<div key={index} className="mb-2"><p className="font-semibold text-gray-700 dark:text-gray-300">{lang.name}</p><p className="text-sm text-gray-600 dark:text-gray-400">{lang.proficiency}</p></div>))}</SidebarSection>
                    <SidebarSection title="Interests"><div className="flex flex-wrap">{data.interests.map((interest, index) => <InterestTag key={index} interest={interest} />)}</div></SidebarSection>
                </div>
            </aside>
        </main>
    </>
);

const PlaceholderPage: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 min-h-[80vh] text-center bg-white dark:bg-gray-800 transition-colors duration-500">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{children}</p>
    </div>
);

const AboutContactPage: React.FC<{ data: ResumeData }> = ({ data }) => (
    <div className="about-contact-page p-8 md:p-12 min-h-[70vh] transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
            {/* Glowing header */}
            <div className="about-header-glow mb-12 text-center">
                <h1 className="about-title">About Me</h1>
                <div className="about-subtitle">Get to know me better</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                                <a href={`mailto:${data.contact.email}`} className="contact-link">{data.contact.email}</a>
                            </div>
                            <div className="contact-item-glow">
                                <div className="contact-icon-wrapper">
                                    <PhoneIcon className="contact-icon" />
                                </div>
                                <span className="contact-text">{data.contact.phone}</span>
                            </div>
                            <div className="contact-item-glow">
                                <div className="contact-icon-wrapper">
                                    <LocationIcon className="contact-icon" />
                                </div>
                                <span className="contact-text">{data.contact.location}</span>
                            </div>
                            <div className="contact-item-glow">
                                <div className="contact-icon-wrapper">
                                    <GithubIcon className="contact-icon" />
                                </div>
                                <a href={data.contact.githubLink} target="_blank" rel="noreferrer noopener" className="contact-link">{data.contact.github}</a>
                            </div>
                        </div>
                        
                        {/* CTA Button with 3D effect */}
                        <div className="mt-6">
                            <a href={`mailto:${data.contact.email}`} className="cta-button-3d">
                                <span className="cta-text">Email me</span>
                                <span className="cta-glow"></span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Content Cards - 3D Panels */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Section */}
                    <div className="content-card-3d">
                        <div className="content-card-header">
                            <h3 className="content-title-glow">About me</h3>
                            <div className="title-underline-glow"></div>
                        </div>
                        <p className="content-text-3d">{data.summary} I combine music production, backend development knowledge and a pragmatic approach to deliver working solutions. I'm passionate about building reliable systems and creating music that moves people.</p>
                    </div>

                    {/* Career Goals */}
                    <div className="content-card-3d">
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
                    <div className="content-card-3d availability-card-highlight">
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
    </div>
);

const proficiencyStyles: { [key in SkillDetail['proficiency']]: { width: string; color: string } } = {
    Beginner: { width: '25%', color: 'bg-red-500' },
    Intermediate: { width: '50%', color: 'bg-yellow-500' },
    Advanced: { width: '75%', color: 'bg-blue-500' },
    Expert: { width: '100%', color: 'bg-green-500' },
};

// Shared gradient map for proficiency levels (used by discs and stats panel)
const proficiencyGradientMap: Record<SkillDetail['proficiency'], { start: string; end: string; shadow: string }> = {
    Expert: { start: '#10b981', end: '#06b6d4', shadow: 'rgba(16,185,129,0.28)' },
    Advanced: { start: '#38bdf8', end: '#7c3aed', shadow: 'rgba(59,130,246,0.28)' },
    Intermediate: { start: '#f59e0b', end: '#fb923c', shadow: 'rgba(245,158,11,0.28)' },
    Beginner: { start: '#fb7185', end: '#f43f5e', shadow: 'rgba(251,113,133,0.28)' },
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
        <div className="skills-deep-container p-8 md:p-12 transition-colors duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="header-with-light relative">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 text-left">Skills Deep Dive</h1>
                    <div className="header-lightning" aria-hidden>
                        <LightningIcon className="w-8 h-8" />
                    </div>
                </div>
                <div className="text-sm text-gray-300">Click a disc to highlight</div>
            </div>

            {/* informal sorting controls */}
            <div className="mb-4 flex items-center gap-3">
                <div className="text-sm text-gray-300 mr-2">Sort:</div>
                <div className="sort-controls inline-flex gap-2">
                    <button className={`sort-button px-3 py-1 rounded-md ${sortMode==='default' ? 'bg-white/10' : 'bg-white/6'}`} onClick={() => setSortMode('default')}>Default</button>
                    <button className={`sort-button px-3 py-1 rounded-md ${sortMode==='proficiency' ? 'bg-white/10' : 'bg-white/6'}`} onClick={() => setSortMode('proficiency')}>Proficiency</button>
                    <button className={`sort-button px-3 py-1 rounded-md ${sortMode==='experience' ? 'bg-white/10' : 'bg-white/6'}`} onClick={() => setSortMode('experience')}>Experience</button>
                    <button className={`sort-button px-3 py-1 rounded-md ${sortMode==='name' ? 'bg-white/10' : 'bg-white/6'}`} onClick={() => setSortMode('name')}>Name</button>
                </div>
                <div className="ml-auto text-xs text-gray-400 italic">Try different orders for a relaxed, informal view.</div>
            </div>

            {/* Proficiency Legend with 3D glowing shapes */}
            <div className="proficiency-legend mb-6">
                <div className="legend-title">Proficiency Levels</div>
                <div className="legend-items">
                    <div className="legend-item">
                        <div className="legend-shape expert-glow" data-level="Expert"></div>
                        <span className="legend-label">Expert (100%)</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-shape advanced-glow" data-level="Advanced"></div>
                        <span className="legend-label">Advanced (75%)</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-shape intermediate-glow" data-level="Intermediate"></div>
                        <span className="legend-label">Intermediate (50%)</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-shape beginner-glow" data-level="Beginner"></div>
                        <span className="legend-label">Beginner (25%)</span>
                    </div>
                </div>
            </div>

            {/* Interactive discs row (technical only) */}
            <div className="skill-disc-row" role="list">
                {sortedTech.slice(0,6).map((skill, i) => (
                    <SkillDisc key={'t-'+i} skill={skill} onSelect={(n) => setSelected(n)} selected={selected === skill.name} />
                ))}
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
                    'Beginner': 'from-gray-300 via-gray-400 to-gray-500',
                    'Intermediate': 'from-gray-400 via-gray-500 to-gray-600',
                    'Advanced': 'from-gray-500 via-gray-600 to-gray-700',
                    'Expert': 'from-gray-600 via-gray-700 to-gray-800'
                }[skill.proficiency];

                return (
                    <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-zinc-900 to-stone-950 border-2 border-neutral-700/40 shadow-2xl backdrop-blur-sm animate-fadeIn relative overflow-hidden">
                        {/* Modern gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-600/10 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 mb-3 tracking-tight drop-shadow-lg">
                                        {skill.name}
                                    </h3>
                                    <p className="text-gray-400 italic text-base leading-relaxed">
                                        {skillTaglines[skill.name] || 'A valuable skill in the modern tech landscape.'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelected(null)}
                                    className="ml-4 w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 text-gray-300 hover:text-white transition-all shadow-lg hover:shadow-xl border border-neutral-600/50 flex items-center justify-center font-bold text-lg hover:scale-110"
                                    aria-label="Close details"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Proficiency Card */}
                                <div className="group p-6 rounded-2xl bg-gradient-to-br from-neutral-800/80 via-zinc-800/80 to-stone-900/80 border-2 border-neutral-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-neutral-500/50 hover:scale-105 backdrop-blur-sm">
                                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold">Proficiency Level</div>
                                    <div className={`text-3xl font-black bg-gradient-to-r ${proficiencyColor} bg-clip-text text-transparent mb-4 drop-shadow-md group-hover:scale-110 transition-transform`}>
                                        {skill.proficiency}
                                    </div>
                                    <div className="w-full bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-full h-4 overflow-hidden shadow-inner border border-neutral-600/50">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${proficiencyColor} rounded-full transition-all duration-1000 shadow-lg relative`}
                                            style={{width: `${proficiencyPercent}%`}}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30"></div>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-500 mt-2 font-bold">{proficiencyPercent}%</div>
                                </div>

                                {/* Experience Card */}
                                <div className="group p-6 rounded-2xl bg-gradient-to-br from-neutral-800/80 via-zinc-800/80 to-stone-900/80 border-2 border-neutral-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-neutral-500/50 hover:scale-105 backdrop-blur-sm">
                                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold">Experience</div>
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 drop-shadow-lg group-hover:scale-110 transition-transform">
                                        {skill.experience}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2 font-medium">
                                        {skill.experience === 1 ? 'year' : 'years'} of hands-on work
                                    </div>
                                </div>

                                {/* Mastery Score Card */}
                                <div className="group p-6 rounded-2xl bg-gradient-to-br from-neutral-800/80 via-zinc-800/80 to-stone-900/80 border-2 border-neutral-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-neutral-500/50 hover:scale-105 backdrop-blur-sm">
                                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold">Mastery Score</div>
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 drop-shadow-lg group-hover:scale-110 transition-transform">
                                        {Math.round(proficiencyPercent * 0.7 + skill.experience * 3)}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2 font-medium">
                                        Combined rating
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-800/60 via-zinc-800/60 to-stone-900/60 border-2 border-neutral-600/40 shadow-lg backdrop-blur-sm hover:border-neutral-500/60 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neutral-600 via-gray-600 to-neutral-700 flex items-center justify-center text-3xl shadow-xl border-2 border-neutral-500/50">
                                        ⚡
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-300 font-bold mb-1 tracking-wide">Pro Tip</div>
                                        <div className="text-gray-400 text-sm leading-relaxed">
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
    )
}

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
    const [username, setUsername] = useState('');
    const [repos, setRepos] = useState<any[]>([]);
    const [userStats, setUserStats] = useState<any | null>(null);
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showInline, setShowInline] = useState(false);

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

    // auto-load if requested
    useEffect(() => {
        if (autoLoad && initialUsername) {
            // slight delay to allow mount/UI to settle
            setTimeout(() => fetchRepos(initialUsername), 80);
            setUsername(initialUsername);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoLoad, initialUsername]);

    return (
        <div className="p-8 md:p-12 bg-white dark:bg-gray-800 transition-colors duration-500 min-h-[80vh]">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200">Project Showcase</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-500">Highlight your top projects and explore GitHub repositories for any account.</p>
                    </div>
                </div>

                {/* GitHub repo overview controls */}
                <div className="mb-6 flex gap-3 items-center">
                    <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="GitHub username (e.g. nicokuehn-dci or octocat) or profile URL" className="flex-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none" />
                    <button onClick={() => fetchRepos(username.trim())} className="px-4 py-2 rounded-md bg-gradient-to-r from-gray-800 to-gray-700 text-white">Fetch repos</button>
                </div>

                <div className="mb-4 flex gap-3 items-center">
                    <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Optional GitHub token (kept in memory)" type="password" className="flex-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none" />
                    <div className="text-xs text-gray-500">Providing a token increases rate limits (kept only in browser memory).</div>
                </div>

                {loading && <div className="text-sm text-gray-600 mb-4">Loading repositories…</div>}
                {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

                {repos.length > 0 ? (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Repositories for <span className="font-bold">{username}</span></h2>
                            <div className="flex items-center gap-3">
                                {userStats && (
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <img src={userStats.avatar_url} alt={userStats.login} className="w-8 h-8 rounded-full" />
                                        <div className="mr-2">
                                            <div className="font-semibold">{userStats.name ?? userStats.login}</div>
                                            <div className="text-xs text-gray-500">{userStats.followers} followers · {userStats.public_repos} repos</div>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <button onClick={() => {
                                        // import all visible
                                        if (!onImportRepo) return;
                                        let count = 0;
                                        repos.forEach((r: any) => {
                                            const already = projects.some(p => p.link === r.html_url || p.name === r.name);
                                            if (!already) {
                                                onImportRepo({ name: r.name, date: r.created_at ? new Date(r.created_at).getFullYear().toString() : '', description: r.description ?? '', link: r.html_url });
                                                count++;
                                            }
                                        });
                                        if (onNotify) {
                                            if (count > 0) onNotify(`Imported ${count} repos`);
                                            else onNotify('No new repos to import');
                                        }
                                    }}
                                    disabled={!onImportRepo || repos.length === 0}
                                    className="ml-2 px-3 py-1 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-50"
                                    >Import all visible</button>
                                </div>
                                <div>
                                    <button onClick={() => setShowInline(s => !s)} className="ml-2 px-3 py-1 rounded-md bg-violet-600 text-white text-sm">{showInline ? 'Hide inline dashboard' : 'Show inline dashboard'}</button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {repos.map((r) => {
                                const alreadyImported = projects.some(p => p.link === r.html_url || p.name === r.name);
                                return (
                                    <div key={r.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-700 dark:text-blue-300 hover:underline">{r.name}</a>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{r.description ?? <span className="italic text-gray-400">No description</span>}</p>
                                                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                                                    <span>⭐ {r.stargazers_count}</span>
                                                    <span>🍴 {r.forks_count}</span>
                                                    {r.language && <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">{r.language}</span>}
                                                    <span className="ml-auto text-xs text-gray-400">Updated {new Date(r.updated_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0 flex flex-col gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (!onImportRepo) return;
                                                        const imported = ((): boolean => {
                                                            const exists = projects.some(p => p.link === r.html_url || p.name === r.name);
                                                            if (exists) return false;
                                                            onImportRepo({ name: r.name, date: r.created_at ? new Date(r.created_at).getFullYear().toString() : '', description: r.description ?? '', link: r.html_url });
                                                            return true;
                                                        })();
                                                        if (onNotify) {
                                                            onNotify(imported ? `Imported ${r.name}` : `${r.name} already imported`);
                                                        }
                                                    }}
                                                    disabled={alreadyImported || !onImportRepo}
                                                    className={`px-3 py-1 rounded-md text-sm ${alreadyImported ? 'bg-gray-200 text-gray-600' : 'bg-green-600 text-white hover:brightness-105'}`}
                                                >
                                                    {alreadyImported ? 'Imported' : 'Import'}
                                                </button>
                                                <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-md text-sm bg-white dark:bg-gray-900 border text-gray-700 dark:text-gray-200 hover:underline">View</a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ) : (
                    !loading && <div className="text-sm text-gray-500 mb-6">No repositories loaded. Enter a username and click &quot;Fetch repos&quot; to view public repositories.</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <article key={index} className="group relative bg-gray-50 dark:bg-gray-800/40 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                                    {/* small link preview or icon */}
                                    {project.link ? (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-300">
                                            <LinkIcon className="w-6 h-6" />
                                        </a>
                                    ) : (
                                        <div className="text-gray-400"><GitIconSmall className="w-6 h-6" /></div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <input
                                                type="text"
                                                value={project.name}
                                                onChange={(e) => onProjectChange(index, 'name', e.target.value)}
                                                placeholder="Project name"
                                                className="text-lg font-semibold bg-transparent border-0 p-0 text-gray-800 dark:text-gray-100 w-full focus:outline-none"
                                            />
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{project.date || '—'}</span>
                                                {project.link && (
                                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                                        <LinkIcon className="w-4 h-4" />
                                                        <span className="truncate max-w-[160px]">{project.link.replace(/https?:\/\//, '')}</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ml-4 flex-shrink-0">
                                            <button onClick={() => onRemoveProject(index)} title="Remove project" className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-opacity opacity-0 group-hover:opacity-100">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <textarea
                                        rows={3}
                                        value={project.description}
                                        onChange={(e) => onProjectChange(index, 'description', e.target.value)}
                                        placeholder="Short description (technologies, what it solves)"
                                        className="mt-3 w-full bg-transparent border border-gray-100 dark:border-gray-700 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 resize-none"
                                    />
                                    <div className="mt-3 flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={project.date}
                                            onChange={(e) => onProjectChange(index, 'date', e.target.value)}
                                            placeholder="Date"
                                            className="text-sm bg-transparent border border-gray-100 dark:border-gray-700 rounded-md px-2 py-1 w-28 focus:outline-none"
                                        />
                                        <input
                                            type="url"
                                            value={project.link}
                                            onChange={(e) => onProjectChange(index, 'link', e.target.value)}
                                            placeholder="https://..."
                                            className="text-sm bg-transparent border border-gray-100 dark:border-gray-700 rounded-md px-2 py-1 flex-1 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button onClick={onAddProject} className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:brightness-105 transition">
                        Add another project
                    </button>
                </div>
                {/* Inline dashboard render (optional) — removed the 3D dashboard component */}
                {showInline && (
                    <div className="mt-8 p-6 bg-gray-900/10 dark:bg-black/20 rounded-lg text-sm text-gray-500">
                        The interactive 3D dashboard has been removed from this build. Use the "Open 3D Dashboard" button to navigate (it now opens the Skills Deep Dive page).
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


    const pages = [
        <ResumePage key={0} data={resumeData} onDownloadPdf={handleDownloadPdf} />,
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
        <PlaceholderPage key={3} title="My Creative Work">A space to highlight your music production and other creative endeavors. Embed audio players, videos, or link to your portfolio on other platforms.</PlaceholderPage>,
    <AboutContactPage key={4} data={resumeData} />,
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
                                          .skill-icon { width:40px; height:40px; display:inline-flex; align-items:center; justify-content:center; border-radius:10px; background:rgba(255,255,255,0.92); box-shadow: 0 8px 24px rgba(12,14,20,0.08); }
                                          .skill-badge { padding: .18rem .5rem; border-radius:9999px; font-size:.7rem; font-weight:700; display:inline-block }

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
                                        .skill-disc-row { display:flex; gap:1rem; flex-wrap:wrap; justify-content:center; margin-bottom:1.25rem; }
                                        /* discs bumped +50% for emphasis and stronger presence with enhanced 3D depth */
                                        .skill-disc { 
                                            width: 210px; 
                                            height: 210px; 
                                            display: inline-block; 
                                            position: relative; 
                                            cursor: pointer; 
                                            border-radius: 999px; 
                                            perspective: 1200px; 
                                            margin: 0.6rem;
                                            box-shadow: 
                                                0 10px 30px rgba(0, 0, 0, 0.4),
                                                0 0 20px rgba(255, 255, 255, 0.05),
                                                inset 0 2px 4px rgba(255, 255, 255, 0.05);
                                            transition: all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1);
                                        }
                                        .skill-disc:hover,
                                        .skill-disc.highlight { 
                                            box-shadow: 
                                                0 20px 60px rgba(0, 0, 0, 0.6),
                                                0 0 40px rgba(255, 255, 255, 0.15),
                                                inset 0 4px 8px rgba(255, 255, 255, 0.1);
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
                                        /* Expert - Bright bronze/gold */
                                        .expert-glow {
                                            background: linear-gradient(135deg, #b87333, #d4a373);
                                            box-shadow: 
                                                0 0 20px rgba(184,115,51,0.6),
                                                0 0 40px rgba(212,163,115,0.4),
                                                inset 0 2px 6px rgba(255,255,255,0.3),
                                                inset 0 -2px 6px rgba(0,0,0,0.3);
                                        }
                                        .legend-item:hover .expert-glow {
                                            box-shadow: 
                                                0 0 30px rgba(184,115,51,0.9),
                                                0 0 60px rgba(212,163,115,0.7),
                                                0 8px 30px rgba(184,115,51,0.5),
                                                inset 0 2px 6px rgba(255,255,255,0.4);
                                        }
                                        /* Advanced - Deep bronze/brass */
                                        .advanced-glow {
                                            background: linear-gradient(135deg, #8b5e3c, #c09a62);
                                            box-shadow: 
                                                0 0 20px rgba(140,94,60,0.5),
                                                0 0 40px rgba(192,154,98,0.3),
                                                inset 0 2px 6px rgba(255,255,255,0.25),
                                                inset 0 -2px 6px rgba(0,0,0,0.3);
                                        }
                                        .legend-item:hover .advanced-glow {
                                            box-shadow: 
                                                0 0 30px rgba(140,94,60,0.8),
                                                0 0 60px rgba(192,154,98,0.6),
                                                0 8px 30px rgba(140,94,60,0.4),
                                                inset 0 2px 6px rgba(255,255,255,0.35);
                                        }
                                        /* Intermediate - Antique brass/patina */
                                        .intermediate-glow {
                                            background: linear-gradient(135deg, #c9a66b, #7b5a36);
                                            box-shadow: 
                                                0 0 20px rgba(201,166,107,0.4),
                                                0 0 40px rgba(123,90,54,0.3),
                                                inset 0 2px 6px rgba(255,255,255,0.2),
                                                inset 0 -2px 6px rgba(0,0,0,0.3);
                                        }
                                        .legend-item:hover .intermediate-glow {
                                            box-shadow: 
                                                0 0 30px rgba(201,166,107,0.7),
                                                0 0 60px rgba(123,90,54,0.5),
                                                0 8px 30px rgba(201,166,107,0.4),
                                                inset 0 2px 6px rgba(255,255,255,0.3);
                                        }
                                        /* Beginner - Dark brown/copper */
                                        .beginner-glow {
                                            background: linear-gradient(135deg, #7b4b2a, #b66a3a);
                                            box-shadow: 
                                                0 0 20px rgba(123,75,42,0.4),
                                                0 0 40px rgba(182,106,58,0.3),
                                                inset 0 2px 6px rgba(255,255,255,0.2),
                                                inset 0 -2px 6px rgba(0,0,0,0.3);
                                        }
                                        .legend-item:hover .beginner-glow {
                                            box-shadow: 
                                                0 0 30px rgba(123,75,42,0.7),
                                                0 0 60px rgba(182,106,58,0.5),
                                                0 8px 30px rgba(123,75,42,0.4),
                                                inset 0 2px 6px rgba(255,255,255,0.3);
                                        }
                                        .legend-label {
                                            font-size: 0.875rem;
                                            font-weight: 600;
                                            color: #cbd5e1;
                                            text-shadow: 0 1px 4px rgba(0,0,0,0.5);
                                        }
                                        .legend-item:hover .legend-label {
                                            color: #ffffff;
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
                                                0 0 40px rgba(128,128,128,0.2),
                                                inset 0 2px 4px rgba(200,200,200,0.1);
                                            border: 1px solid rgba(160,160,160,0.3);
                                            transform-style: preserve-3d;
                                            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                                            position: relative;
                                            z-index: 1;
                                        }
                                        .profile-card-3d:hover {
                                            transform: translateY(-10px) rotateX(2deg);
                                            box-shadow: 
                                                0 30px 80px rgba(128,128,128,0.4),
                                                0 0 60px rgba(160,160,160,0.3),
                                                inset 0 2px 4px rgba(220,220,220,0.15);
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
                                            background: conic-gradient(from 0deg, #d0d0d0, #a0a0a0, #707070, #d0d0d0);
                                            animation: ring-spin 4s linear infinite;
                                            opacity: 0.5;
                                            filter: blur(20px);
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
                                            border: 4px solid rgba(160,160,160,0.6);
                                            box-shadow: 
                                                0 10px 40px rgba(0,0,0,0.7),
                                                0 0 30px rgba(128,128,128,0.3),
                                                inset 0 4px 8px rgba(200,200,200,0.15);
                                            transition: transform 0.4s ease;
                                            z-index: 1;
                                        }
                                        .profile-card-3d:hover .profile-img-3d {
                                            transform: scale(1.05);
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
                                            font-weight: 800;
                                            background: linear-gradient(135deg, #f0f0f0, #c0c0c0, #909090);
                                            -webkit-background-clip: text;
                                            background-clip: text;
                                            color: transparent;
                                            margin-bottom: 0.5rem;
                                            text-shadow: 0 0 20px rgba(192,192,192,0.4);
                                        }
                                        .profile-title-3d {
                                            font-size: 1rem;
                                            color: #a0a0a0;
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
                                            box-shadow: 
                                                0 8px 24px rgba(80,80,80,0.5),
                                                0 0 20px rgba(128,128,128,0.3),
                                                inset 0 2px 4px rgba(200,200,200,0.2);
                                            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                                        }
                                        .cta-button-3d:hover {
                                            transform: translateY(-4px) scale(1.05);
                                            box-shadow: 
                                                0 16px 48px rgba(120,120,120,0.7),
                                                0 0 40px rgba(160,160,160,0.5),
                                                inset 0 2px 4px rgba(220,220,220,0.3);
                                        }
                                        .cta-text {
                                            position: relative;
                                            z-index: 1;
                                            color: #f0f0f0;
                                            font-weight: 700;
                                            font-size: 1rem;
                                            text-shadow: 0 0 10px rgba(255,255,255,0.3);
                                        }
                                        .cta-glow {
                                            position: absolute;
                                            inset: 0;
                                            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
                                            transform: translateX(-100%);
                                            transition: transform 0.6s;
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
                                                0 0 20px rgba(100,100,100,0.2),
                                                inset 0 2px 4px rgba(180,180,180,0.08);
                                            border: 1px solid rgba(140,140,140,0.25);
                                            transition: all 0.4s ease;
                                            position: relative;
                                            z-index: 1;
                                        }
                                        .content-card-3d:hover {
                                            transform: translateY(-6px);
                                            box-shadow: 
                                                0 20px 60px rgba(128,128,128,0.4),
                                                0 0 40px rgba(160,160,160,0.3),
                                                inset 0 2px 4px rgba(200,200,200,0.12);
                                            border-color: rgba(180,180,180,0.4);
                                        }
                                        .content-card-header {
                                            margin-bottom: 1.5rem;
                                        }
                                        .content-title-glow {
                                            font-size: 1.5rem;
                                            font-weight: 700;
                                            background: linear-gradient(135deg, #d0d0d0, #a0a0a0, #707070);
                                            -webkit-background-clip: text;
                                            background-clip: text;
                                            color: transparent;
                                            filter: drop-shadow(0 2px 8px rgba(160,160,160,0.4));
                                        }
                                        .title-underline-glow {
                                            width: 60px;
                                            height: 3px;
                                            background: linear-gradient(90deg, #a0a0a0, transparent);
                                            margin-top: 0.5rem;
                                            border-radius: 2px;
                                            box-shadow: 0 2px 8px rgba(128,128,128,0.5);
                                        }
                                        .content-text-3d {
                                            color: #c8c8c8;
                                            line-height: 1.7;
                                            font-size: 1rem;
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
                                        }
                                        .goal-item-glow:hover {
                                            background: rgba(60,60,60,0.7);
                                            border-color: rgba(160,160,160,0.4);
                                            transform: translateX(6px);
                                            box-shadow: 
                                                0 4px 16px rgba(128,128,128,0.3),
                                                0 0 20px rgba(160,160,160,0.2);
                                        }
                                        .goal-bullet {
                                            display: block;
                                            width: 8px;
                                            height: 8px;
                                            min-width: 8px;
                                            border-radius: 50%;
                                            background: linear-gradient(135deg, #b0b0b0, #808080);
                                            box-shadow: 0 0 10px rgba(144,144,144,0.7);
                                            margin-top: 0.5rem;
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
                                            background: linear-gradient(135deg, rgba(140,140,140,0.3), rgba(100,100,100,0.3));
                                            border: 1px solid rgba(160,160,160,0.5);
                                            border-radius: 24px;
                                            box-shadow: 
                                                0 4px 16px rgba(128,128,128,0.3),
                                                0 0 20px rgba(160,160,160,0.2);
                                        }
                                        .badge-pulse {
                                            width: 10px;
                                            height: 10px;
                                            border-radius: 50%;
                                            background: #b0b0b0;
                                            box-shadow: 0 0 10px #c0c0c0;
                                            animation: pulse-grow 2s ease-in-out infinite;
                                        }
                                        @keyframes pulse-grow {
                                            0%, 100% { transform: scale(1); opacity: 1; }
                                            50% { transform: scale(1.3); opacity: 0.7; }
                                        }
                                        .badge-text {
                                            color: #d8d8d8;
                                            font-weight: 600;
                                            font-size: 0.875rem;
                                        }
                                    `}</style>
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-8 md:p-12 transition-colors duration-500 font-sans">
                <ThemeToggle />
                
                <button onClick={goToPrevPage} disabled={currentPage === 0} title="Previous page" aria-label="Previous page" className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-300">
                    <LeftArrowIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                    <span className="hidden md:inline text-sm text-gray-800 dark:text-gray-200">Prev</span>
                </button>
                <button onClick={goToNextPage} disabled={currentPage === pages.length - 1} title="Next page" aria-label="Next page" className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-300">
                    <span className="hidden md:inline text-sm text-gray-800 dark:text-gray-200">Next</span>
                    <RightArrowIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                </button>

                <div id="resume-container" className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-2xl dark:shadow-black/50 rounded-lg overflow-hidden">
                    <div id="page-content" className="animate-fadeIn">
                        {pages[currentPage]}
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;
