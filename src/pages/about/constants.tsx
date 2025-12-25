import { BsDiscord } from 'react-icons/bs'
// import { FaTelegramPlane } from 'react-icons/fa'
import {
  Phone,
  Facebook,
  Mail,
  Github,
  Music,
  Camera,
  Video,
  BookOpen,
  Map,
  Youtube,
  Gamepad2,
  Drum,
  Code,
  ChefHat,
  PenTool,
  Trophy,
  Instagram,
} from 'lucide-react'
import Html5Original from 'devicons-react/icons/Html5Original'
import Css3Original from 'devicons-react/icons/Css3Original'
import BootstrapOriginal from 'devicons-react/icons/BootstrapOriginal'
import MysqlOriginal from 'devicons-react/icons/MysqlOriginal'
import PhpOriginal from 'devicons-react/icons/PhpOriginal'
import JavascriptOriginal from 'devicons-react/icons/JavascriptOriginal'
import ReactOriginal from 'devicons-react/icons/ReactOriginal'
import TailwindcssOriginal from 'devicons-react/icons/TailwindcssOriginal'
import TypescriptOriginal from 'devicons-react/icons/TypescriptOriginal'
import CapacitorOriginal from 'devicons-react/icons/CapacitorOriginal'
import JavaOriginal from 'devicons-react/icons/JavaOriginal'
import GitOriginal from 'devicons-react/icons/GitOriginal'
import { QgisIcon } from '@/components/icons/QgisIcon'
import type { ComponentType } from 'react'
import React from 'react'

type SkillLevel = 'advanced' | 'intermediate' | 'beginner'

interface ExperienceItem {
  date: string
  role: string
  company: string
  points: React.ReactNode
}

interface EducationItem {
  level: string
  logo: string
  school: string
  degree?: string
}

export const interests = [
  { icon: Music, label: 'Music', id: 'music' },
  { icon: Camera, label: 'Photography', id: 'photography' },
  { icon: Video, label: 'Videography', id: 'videography' },
  { icon: BookOpen, label: 'Studying', id: 'studying' },
  { icon: Youtube, label: 'YouTube', id: 'youtube' },
  { icon: Gamepad2, label: 'Gaming', id: 'gaming' },
  { icon: Drum, label: 'Drumming', id: 'drumming' },
  { icon: Code, label: 'Coding', id: 'coding' },
  { icon: Trophy, label: 'Basketball', id: 'basketball' },
  { icon: ChefHat, label: 'Cooking', id: 'cooking' },
  { icon: PenTool, label: 'Drawing', id: 'drawing' },
  { icon: Map, label: 'Traveling', id: 'traveling' },
]

export const personalDetails = [
  {
    icon: Facebook,
    label: 'Facebook',
    value: 'archie.albarico88',
    href: 'https://www.facebook.com/archie.albarico88',
  },
  { icon: Instagram, label: 'Instagram', value: 'chielbrc', href: 'https://www.instagram.com/chielbrc' },
  // { icon: FaTelegramPlane, label: 'Telegram', value: 'rico', href: 'https://t.me/ricosixnine' },
  {
    icon: BsDiscord,
    label: 'Discord',
    value: 'archieamas11',
    href: 'https://discord.com/users/archieamas11',
  },
  { icon: Phone, label: 'Phone', value: '+63 963 463 6306', href: 'tel:+639634636306' },
  { icon: Github, label: 'Github', value: 'archieamas11', href: 'https://github.com/archieamas11' },
  {
    icon: Mail,
    label: 'Email',
    value: 'archiealbarico69@gmail.com',
    href: 'mailto:archiealbarico69@gmail.com',
  },
]

export const skillsArr: Array<{
  icon: ComponentType<{ size?: string | number }>
  label: string
  experience: number
  level: SkillLevel
  progressWidth: string
}> = [
  { icon: Html5Original, label: 'HTML5', experience: 3, level: 'advanced', progressWidth: '100%' },
  { icon: Css3Original, label: 'CSS3', experience: 3, level: 'advanced', progressWidth: '100%' },
  {
    icon: BootstrapOriginal,
    label: 'Bootstrap',
    experience: 2,
    level: 'intermediate',
    progressWidth: '100%',
  },
  { icon: MysqlOriginal, label: 'MySQL', experience: 2, level: 'beginner', progressWidth: '100%' },
  { icon: PhpOriginal, label: 'PHP', experience: 2, level: 'beginner', progressWidth: '100%' },
  { icon: JavascriptOriginal, label: 'JavaScript', experience: 1, level: 'beginner', progressWidth: '100%' },
  { icon: ReactOriginal, label: 'React', experience: 1, level: 'beginner', progressWidth: '100%' },
  { icon: ReactOriginal, label: 'React Native', experience: 1, level: 'beginner', progressWidth: '100%' },
  {
    icon: TailwindcssOriginal,
    label: 'Tailwind CSS',
    experience: 1,
    level: 'beginner',
    progressWidth: '30%',
  },
  { icon: TypescriptOriginal, label: 'Typescript', experience: 1, level: 'beginner', progressWidth: '100%' },
  { icon: CapacitorOriginal, label: 'Capacitor', experience: 1, level: 'beginner', progressWidth: '100%' },
  { icon: JavaOriginal, label: 'Java', experience: 1, level: 'beginner', progressWidth: '100%' },
  { icon: GitOriginal, label: 'Git', experience: 2, level: 'beginner', progressWidth: '100%' },
  { icon: QgisIcon, label: 'QGIS', experience: 1, level: 'beginner', progressWidth: '100%' },
]

export const experienceData: ExperienceItem[] = [
  {
    date: 'November 27-29, 2025',
    role: 'Software Researcher & Developer',
    company: "St. Cecilia's College–Cebu, Inc.",
    points: (
      <>
        Presented a research paper and application demo titled{' '}
        <b>
          "
          <a
            href="https://doi.org/10.5281/zenodo.17815901"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Cemeterease: A GIS-Based Cross-Platform Plot Inventory & Navigation System
          </a>
          "{' '}
        </b>
        at the{' '}
        <b>
          {' '}
          <a
            href="https://www.facebook.com/share/p/1BvVv7mneW/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            International Conference on Information Technology Education (ICITE 2025)
          </a>{' '}
        </b>
        in Vietnam as one of the representatives of St. Cecilia's College–Cebu, Inc.
        <a href="https://doi.org/10.5281/zenodo.17815901" target="_blank" rel="noopener noreferrer">
          <img className="mt-5" src="https://zenodo.org/badge/DOI/10.5281/zenodo.17815901.svg" alt="DOI" />
        </a>
        <div className="mt-4">
          <h4 className="mb-2 font-semibold">Key Achievements</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Developed a <b>full-stack cross-platform web application</b> integrating GIS mapping for
              cemetery plot management using Agile iterative-driven development.
            </li>
            <li>
              Developed <b>turn-by-turn navigation with voice guidance</b>, enhancing user navigation
              efficiency by
              <b> 50%</b>.
            </li>
            <li>
              Implemented real-time inventory tracking, reducing manual errors by <b> 35%</b>.
            </li>
            <li>
              Optimized admin and staff workflow of Finisterre Gardenz, transitioning from{' '}
              <b>paper-based inventory → Excel → manual map editing → printed maps</b> to a fully digital
              system, improving operational efficiency by <b>70%</b>.
            </li>
          </ul>
        </div>
      </>
    ),
  },
]

export const EducationData: EducationItem[] = [
  {
    level: 'College',
    logo: '/images/schools/scc.avif',
    school: "St. Cecilia's College – Cebu, Inc.",
    degree: 'Bachelor of Science in Information Technology',
  },
  {
    level: 'Senior High School',
    logo: '/images/schools/scc.avif',
    school: "St. Cecilia's College – Cebu, Inc.",
    degree: 'ICT Strand',
  },
  {
    level: 'Secondary Education',
    logo: '/images/schools/vito.avif',
    school: 'Vito National High School',
    degree: 'High School',
  },
  {
    level: 'Primary Education',
    logo: '/images/schools/mch.avif',
    school: 'Minglanilla Central School',
    degree: 'Elementary School',
  },
]
