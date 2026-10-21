import { officialSources } from './siteContent';

export const serviceGroups = [
  {
    id: 'students',
    title: 'Students',
    description: 'Verified routes for applications, academic discovery and university information.',
    services: [
      { id: 'student-admission', title: 'Admissions portal', description: 'Use ECU’s authorized application destination for current application actions.', href: 'https://admission.ecu.edu.eg/', status: 'verified' },
      { id: 'student-programmes', title: 'Academic programmes', description: 'Search the programme areas currently published in the ECU review dataset.', href: '/programmes', status: 'local' },
      { id: 'student-contact', title: 'University contacts', description: 'Review published branch information and continue to the official ECU website.', href: '/contact', status: 'local' },
    ],
  },
  {
    id: 'academic-staff',
    title: 'Academic staff',
    description: 'Public academic and research information currently available for review.',
    services: [
      { id: 'staff-faculties', title: 'Faculty directory', description: 'Browse the public ECU faculty directory and source links.', href: '/faculties', status: 'local' },
      { id: 'staff-research', title: 'Research plan', description: 'Read ECU’s published research objectives and official source.', href: officialSources.research, status: 'verified' },
    ],
  },
  {
    id: 'administrative-staff',
    title: 'Administrative staff',
    description: 'Public institutional routes only; secured systems are not replicated here.',
    services: [
      { id: 'admin-official', title: 'Official ECU website', description: 'Use the official site for current administrative contacts and notices.', href: officialSources.home, status: 'verified' },
      { id: 'admin-secured', title: 'Internal systems', description: 'No LMS, email, HR or financial destination is published in the verified inventory.', status: 'unavailable' },
    ],
  },
  {
    id: 'alumni',
    title: 'Alumni',
    description: 'Public routes for reconnecting with ECU information.',
    services: [
      { id: 'alumni-news', title: 'News and activities', description: 'Review dated public stories and activities where available.', href: '/news-events', status: 'local' },
      { id: 'alumni-contact', title: 'Contact ECU', description: 'Use the published branch information and official contact route.', href: '/contact', status: 'local' },
    ],
  },
  {
    id: 'visitors',
    title: 'Visitors',
    description: 'Plan a visit using published branch information and official sources.',
    services: [
      { id: 'visitor-campus', title: 'Campus and contacts', description: 'View the two published Cairo branch locations.', href: '/contact', status: 'local' },
      { id: 'visitor-official', title: 'Official ECU website', description: 'Continue to ECU’s official website for current visitor information.', href: officialSources.home, status: 'verified' },
    ],
  },
];
