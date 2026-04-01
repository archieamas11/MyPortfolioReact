import type { ExperienceItem } from './types'

export const experienceData: ExperienceItem[] = [
  {
    date: 'January 12 - April 12, 2026',
    role: 'Intern - Full-Stack Developer',
    company: 'Finisterre Gardenz',
    points: (
      <>
        Developed a full-stack web application for{' '}
        <a
          href="https://www.facebook.com/finisterregardenz"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Finisterre Gardenz
        </a>{' '}
        to manage cemetery plot inventory and navigation.
        <div className="mt-4">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Digitized 7,000+ paper and Excel records into a centralized system, eliminating manual workflows and
              improving operational efficiency by <b>70%</b>.
            </li>
            <li>
              Optimized map rendering for 7,000+ markers (plots and niches), improving performance and load speed by{' '}
              <b>80%</b>.
            </li>
            <li>
              Built interactive map-based navigation for real-time plot location tracking, improving accuracy and
              usability for agents and clients.
            </li>
          </ul>
        </div>
      </>
    ),
  },
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
          <img
            className="mt-5"
            src="https://zenodo.org/badge/DOI/10.5281/zenodo.17815901.svg"
            alt="DOI"
            width={114}
            height={20}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </a>
        <div className="mt-4">
          <h4 className="mb-2 font-semibold">Key Achievements</h4>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Developed a <b>full-stack cross-platform web application</b> integrating GIS mapping for cemetery plot
              management using Agile iterative-driven development.
            </li>
            <li>
              Developed <b>turn-by-turn navigation with voice guidance</b>, enhancing user navigation efficiency by
              <b> 50%</b>.
            </li>
            <li>
              Implemented real-time inventory tracking, reducing manual errors by <b> 35%</b>.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    date: '2023 - 2025',
    role: 'Working Student – Maritime Simulator Specialist',
    company: "St. Cecilia's College – Cebu, Inc. (Maritime Department)",
    points: (
      <>
        <b>Managed and maintained advanced maritime simulators</b> for two years as a working student, ensuring
        flawless operation during <b>testing and regulatory inspections</b>.
        <br />
        <br />
        <span>
          As the central technical support in the Maritime Department, I maximized simulator uptime and system
          reliability, performed routine diagnostics, coordinated with faculty during laboratory exercises, and
          delivered rapid troubleshooting for mission-critical scenarios.
          <br />
        </span>
      </>
    ),
  },
]
