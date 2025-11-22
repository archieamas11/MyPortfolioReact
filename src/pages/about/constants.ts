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
import CplusplusOriginal from 'devicons-react/icons/CplusplusOriginal'
import GitOriginal from 'devicons-react/icons/GitOriginal'
import { QgisIcon } from '@/components/icons/QgisIcon'
import type { ComponentType } from 'react'

type SkillLevel = 'advanced' | 'intermediate' | 'beginner'

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
  { icon: Phone, label: 'Phone', value: '+63 963 463 6306', href: 'tel:+639634636306' },
  { icon: Facebook, label: 'Facebook', value: 'archie.albarico88', href: 'https://www.facebook.com/archie.albarico88' },
  { icon: Mail, label: 'Email', value: 'archiealbarico69@gmail.com', href: 'mailto:archiealbarico69@gmail.com' },
  { icon: Github, label: 'GitHub', value: 'archieamas11', href: 'https://github.com/archieamas11' },
]

export const skillsArr: Array<{
  icon: ComponentType<{ size?: string | number }>
  label: string
  experience: string
  level: SkillLevel
  progressWidth: string
}> = [
  { icon: Html5Original, label: 'HTML5', experience: '3', level: 'intermediate', progressWidth: '70%' },
  { icon: Css3Original, label: 'CSS3', experience: '3', level: 'intermediate', progressWidth: '70%' },
  { icon: BootstrapOriginal, label: 'Bootstrap', experience: '2', level: 'intermediate', progressWidth: '60%' },
  { icon: MysqlOriginal, label: 'MySQL', experience: '2', level: 'intermediate', progressWidth: '60%' },
  { icon: PhpOriginal, label: 'PHP', experience: '2', level: 'beginner', progressWidth: '30%' },
  { icon: JavascriptOriginal, label: 'JavaScript', experience: '1', level: 'beginner', progressWidth: '30%' },
  { icon: ReactOriginal, label: 'React', experience: '1', level: 'beginner', progressWidth: '30%' },
  { icon: ReactOriginal, label: 'React Native', experience: '1', level: 'beginner', progressWidth: '30%' },
  { icon: TailwindcssOriginal, label: 'Tailwind CSS', experience: '1', level: 'beginner', progressWidth: '30%' },
  { icon: TypescriptOriginal, label: 'Typescript', experience: '1', level: 'beginner', progressWidth: '30%' },
  { icon: CapacitorOriginal, label: 'Capacitor', experience: '1', level: 'beginner', progressWidth: '30%' },
  { icon: CplusplusOriginal, label: 'C++', experience: '1', level: 'beginner', progressWidth: '30%' },
  { icon: GitOriginal, label: 'Git', experience: '1', level: 'beginner', progressWidth: '30%' },
  { icon: QgisIcon, label: 'QGIS', experience: '1', level: 'beginner', progressWidth: '30%' },
]
