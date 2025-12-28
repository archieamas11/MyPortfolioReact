import {
  Code,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Mail,
  Heart,
  Github,
  MapPin,
  Award,
  BookOpen,
  Users,
  Target,
  Map,
  Presentation,
  BriefcaseBusiness,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const STORAGE_KEY = 'chatbot-messages'
export const MAX_STORED_MESSAGES = 50
export const INITIAL_MESSAGE_TEXT =
  "Hello! I'm Archie's RAG Chatbot. How can I assist you today? Feel free to ask about my portfolio, skills, experience, or any of my projects."

export interface SuggestionTag {
  tag: string
  icon: LucideIcon
  question: string
}

export const SUGGESTION_TAGS: SuggestionTag[] = [
  { tag: 'Skills', icon: Code, question: 'What technologies and skills do you know?' },
  { tag: 'Projects', icon: FolderKanban, question: 'What projects have you worked on?' },
  { tag: 'Experience', icon: Briefcase, question: 'Tell me about your background and experience' },
  { tag: 'Education', icon: GraduationCap, question: 'Tell me about your education' },
  { tag: 'Contact', icon: Mail, question: 'How can I contact you?' },
  { tag: 'Interests', icon: Heart, question: 'What are your interests and hobbies?' },
  { tag: 'GitHub', icon: Github, question: 'What projects are on your GitHub?' },
  { tag: 'Location', icon: MapPin, question: 'Where are you based?' },
  { tag: 'Career Goals', icon: Briefcase, question: 'What are your career goals?' },
  { tag: 'Strengths', icon: Heart, question: 'What are your strengths as a developer?' },
  { tag: 'Achievements', icon: GraduationCap, question: 'What are your recent achievements?' },
  // Commented out - not mentioned in Me.txt
  // { tag: 'Favorite Tech', icon: Code, question: 'What is your favorite technology or tool to use?' },
  // { tag: 'Open Source', icon: Github, question: 'What is your involvement in open source?' },
  // New questions based on Me.txt content
  { tag: 'Cemeterease', icon: Map, question: 'Tell me about the Cemeterease project' },
  {
    tag: 'ICITE 2025',
    icon: Presentation,
    question: 'Tell me about your ICITE 2025 conference presentation',
  },
  { tag: 'GIS Systems', icon: Map, question: 'What experience do you have with GIS and map-based systems?' },
  { tag: 'Work Values', icon: Heart, question: 'What are your work values and principles?' },
  { tag: 'Learning Focus', icon: BookOpen, question: 'What are you currently learning or focusing on?' },
  { tag: 'Collaboration', icon: Users, question: 'How do you prefer to collaborate with teams?' },
  { tag: 'Availability', icon: BriefcaseBusiness, question: 'What opportunities are you open to?' },
  { tag: 'Research Paper', icon: Presentation, question: 'Tell me about your research paper presentation' },
  { tag: 'Finisterre', icon: FolderKanban, question: 'Tell me about the Finisterre Gardenz project' },
  { tag: 'Web Design Win', icon: Award, question: 'Tell me about your web designing competition win' },
  { tag: 'Industry Interests', icon: Target, question: 'What areas of technology interest you most?' },
]
