import React from 'react'

interface ContactInfo { email: string; phone: string; location: string; github: string; githubLink: string }
interface ResumeData { name: string; title: string; summary: string; profilePictureUrl: string; contact: ContactInfo; skills: string[] }

export const resumeData: ResumeData = {
  name: 'nico_kuehn',
  title: 'Python Backend Programmer / Musician / Producer',
  summary: '20 years of experience in Musicproduction in the Box + Outgear Musicproduction',
  // use GitHub avatar so the image loads reliably
  profilePictureUrl: 'https://avatars.githubusercontent.com/nicokuehn-dci',
  contact: { email: 'nico.code.evo@gmail.com', phone: '+4915237250142', location: 'Aue-Bad Schlema, DE', github: 'github.com/nicokuehn-dci', githubLink: 'https://github.com/nicokuehn-dci' },
  skills: ['Python', 'Django', 'React']
}

export const ResumePage: React.FC<{ data: ResumeData; onDownloadPdf?: () => void }> = ({ data }) => (
  <div data-testid="resume-page">
    <h1>{data.name}</h1>
    <p>{data.title}</p>
    <div>{data.skills.join(', ')}</div>
  </div>
)

export default ResumePage
