import React, { useState, useEffect } from 'react';

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

// --- RESUME DATA ---
const resumeData: ResumeData = {
    name: "Nico Kuehn",
    title: "Python Backend Programmer / Musician / Producer",
    summary: "20 years of experience in Musicproduction in the Box + Outgear Musicproduction",
    // Use the local profile image included in the repo so GitHub Pages can serve it reliably
    // Place the image at the repo root as `unnamed.jpg` (already provided in workspace)
    profilePictureUrl: "/unnamed.jpg",
    contact: { email: "nico.code.evo@gmail.com", phone: "+4915237250142", location: "Aue-Bad Schlema, DE", github: "github.com/nicokuehn-dci", githubLink: "https://github.com/nicokuehn-dci?tab=repositories" },
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
    { name: 'CI/CD', proficiency: 'Intermediate', experience: 1 },
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

// --- UI HELPER COMPONENTS ---
const SkillTag: React.FC<{ skill: string }> = ({ skill }) => (
    <span className="inline-block bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full transform hover:-translate-y-1 hover:scale-105 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 cursor-default">{skill}</span>
);

const InterestTag: React.FC<{ interest: string }> = ({ interest }) => (
    <span className="inline-block bg-transparent border border-gray-300 text-gray-600 dark:bg-transparent dark:border-gray-600 dark:text-gray-400 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full transform hover:-translate-y-1 transition-transform duration-200 cursor-default">{interest}</span>
);

const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="inline-block font-handwriting text-2xl font-bold text-white mb-4 py-2 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">{title}</h3>
        {children}
    </div>
);

// --- PAGE COMPONENTS ---

const ResumePage: React.FC<{ data: ResumeData, onDownloadPdf: () => void }> = ({ data, onDownloadPdf }) => (
    <>
        <header className="bg-white dark:bg-gray-800 p-8 md:p-12 transition-colors duration-500">
            <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                    <img src={data.profilePictureUrl} alt={data.name} className="w-40 h-40 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow-md transform hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h1 className="font-handwriting text-5xl md:text-6xl font-bold text-black [-webkit-text-stroke:1px_white] drop-shadow-md">{data.name}</h1>
                    <h2 className="font-sans text-xl md:text-2xl font-light text-gray-500 dark:text-gray-400 mt-2">{data.title}</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{data.summary}</p>
                </div>
            </div>
        </header>
        <hr className="border-t border-gray-200 dark:border-gray-700" />
        <main className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2 p-8">
                <section className="mb-10">
                    <h2 className="inline-block text-3xl font-handwriting font-bold text-white mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">Education</h2>
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
                    <h2 className="inline-block text-3xl font-handwriting font-bold text-white mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">Work Experience</h2>
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
        <h1 className="font-handwriting text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{children}</p>
    </div>
);

const proficiencyStyles: { [key in SkillDetail['proficiency']]: { width: string; color: string } } = {
    Beginner: { width: '25%', color: 'bg-red-500' },
    Intermediate: { width: '50%', color: 'bg-yellow-500' },
    Advanced: { width: '75%', color: 'bg-blue-500' },
    Expert: { width: '100%', color: 'bg-green-500' },
};

const SkillDetailItem: React.FC<{ skill: SkillDetail }> = ({ skill }) => {
    const { width, color } = proficiencyStyles[skill.proficiency];
    return (
        <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">{skill.name}</h4>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{skill.experience} {skill.experience === 1 ? 'year' : 'years'}</span>
            </div>
            <div>
                 <div className="flex items-center mb-1">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{skill.proficiency}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width }}></div>
                </div>
            </div>
        </div>
    );
};


const SkillsDeepDivePage: React.FC<{ data: SkillsData }> = ({ data }) => (
    <div className="p-8 md:p-12 bg-white dark:bg-gray-800 transition-colors duration-500">
        <h1 className="font-handwriting text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-12 text-center">Skills Deep Dive</h1>

        <section className="mb-12">
            <h2 className="inline-block text-3xl font-handwriting font-bold text-white mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.technical.map((skill, index) => <SkillDetailItem key={index} skill={skill} />)}
            </div>
        </section>

        <section className="mb-12">
            <h2 className="inline-block text-3xl font-handwriting font-bold text-white mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">Soft Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.soft.map((skill, index) => <SkillDetailItem key={index} skill={skill} />)}
            </div>
        </section>

        <section>
            <h2 className="inline-block text-3xl font-handwriting font-bold text-white mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-black">Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.tools.map((skill, index) => <SkillDetailItem key={index} skill={skill} />)}
            </div>
        </section>
    </div>
);

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [currentPage, setCurrentPage] = useState(0);

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
            const opt = { margin: 0.2, filename: 'Nico_Kuehn_Resume.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } };
            html2pdf().from(element).set(opt).save();
        }
    };

    const pages = [
        <ResumePage key={0} data={resumeData} onDownloadPdf={handleDownloadPdf} />,
        <PlaceholderPage key={1} title="Project Showcase">This is where you can showcase your best projects. Add images, descriptions, and links to live demos or source code.</PlaceholderPage>,
        <SkillsDeepDivePage key={2} data={skillsData} />,
        <PlaceholderPage key={3} title="My Creative Work">A space to highlight your music production and other creative endeavors. Embed audio players, videos, or link to your portfolio on other platforms.</PlaceholderPage>,
        <PlaceholderPage key={4} title="About & Contact">Tell your story. What are you passionate about? What are your career goals? This is also a great place to add a contact form or links to your social media profiles.</PlaceholderPage>,
        <PlaceholderPage key={5} title="Project Showcase">This is where you can showcase your best projects. Add images, descriptions, and links to live demos or source code.</PlaceholderPage>
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
            `}</style>
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-8 md:p-12 transition-colors duration-500 font-sans">
                <ThemeToggle />
                
                <button onClick={goToPrevPage} disabled={currentPage === 0} className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-300">
                    <LeftArrowIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                </button>
                <button onClick={goToNextPage} disabled={currentPage === pages.length - 1} className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-300">
                    <RightArrowIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
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
