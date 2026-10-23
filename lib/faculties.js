const engineeringPrograms = [
  { name: 'Construction and Building Engineering', code: 'CBE', summary: 'Preparation in the design and life cycle of built facilities.' },
  { name: 'Energy and Renewable Energy Engineering', code: 'ERG', summary: 'Study of conventional and renewable energy sources, including solar and wind.' },
  { name: 'Software Engineering and Information Technology', code: 'SET', summary: 'Preparation for computer engineering and the software industry.' },
  { name: 'Mechatronics Engineering and Automation', code: 'MCT', summary: 'A programme spanning automation and mechatronics specializations.' },
  { name: 'Petroleum and Gas Engineering', summary: 'Study focused on the oil and gas industry.' },
];

const economicsPrograms = [
  { name: 'Accounting', summary: 'A specialization in accounting and financial information.' },
  { name: 'Finance and Investment', summary: 'A specialization related to financial markets and investment decisions.' },
  { name: 'International Business', summary: 'Study of laws, practices and business in international contexts.' },
  { name: 'International Economics', summary: 'Study of economics, trade and investment across borders.' },
  { name: 'Marketing and Innovation', summary: 'Study of marketing strategy and innovation.' },
];

const computingPrograms = [
  { name: 'Computer Science' }, { name: 'Information Systems' }, { name: 'Artificial Intelligence' },
  { name: 'Cybersecurity' }, { name: 'Data Sciences' },
];

export const facultyDirectory = [
  { id: 'faculty-computers-and-information-systems', slug: 'computers-and-information-systems', name: 'Computers and Information Systems', summary: 'Education, research and innovation in computing and information technology.', programs: computingPrograms, sourceUrl: 'https://ecu.edu.eg/faculties/computers-and-information-systems/' },
  { id: 'faculty-engineering-and-technology', slug: 'engineering-and-technology', name: 'Engineering and Technology', summary: 'Modern engineering education with practical learning and research.', programs: engineeringPrograms, sourceUrl: 'https://ecu.edu.eg/faculties/engineering-and-technology/' },
  { id: 'faculty-pharmacy-and-drug-technology', slug: 'pharmacy-and-drug-technology', name: 'Pharmacy and Drug Technology', sourceUrl: 'https://ecu.edu.eg/faculties/pharmacy-drug-technology/' },
  { id: 'faculty-physical-therapy', slug: 'physical-therapy', name: 'Physical Therapy', sourceUrl: 'https://ecu.edu.eg/faculties/physical-therapy' },
  { id: 'faculty-economics-and-international-trade', slug: 'economics-and-international-trade', name: 'Economics and International Trade', summary: 'Foundation study in business and economics followed by a choice of five specialization pathways.', programs: economicsPrograms, sourceUrl: 'https://ecu.edu.eg/faculties/economics-and-international-trade' },
  { id: 'faculty-arts-and-design', slug: 'arts-and-design', name: 'Arts and Design', sourceUrl: 'https://ecu.edu.eg/faculties/arts-and-design' },
  { id: 'faculty-veterinary-medicine', slug: 'veterinary-medicine', name: 'Veterinary Medicine', sourceUrl: 'https://ecu.edu.eg/faculties/veterinary-medicine' },
  { id: 'faculty-mass-communication', slug: 'mass-communication', name: 'Mass Communication', sourceUrl: 'https://ecu.edu.eg/faculties/media' },
  { id: 'faculty-literary-studies', slug: 'literary-studies', name: 'Literary Studies', sourceUrl: 'https://ecu.edu.eg/faculties/literary-studies' },
  { id: 'faculty-law', slug: 'law', name: 'Law', sourceUrl: 'https://ecu.edu.eg/law' },
  { id: 'faculty-nursing', slug: 'nursing', name: 'Nursing', sourceUrl: 'https://ecu.edu.eg/nursing' },
  { id: 'faculty-humanities-gis-and-surveying', slug: 'humanities-gis-and-surveying', name: 'Humanities (GIS & Surveying)', sourceUrl: 'https://ecu.edu.eg/humanities' },
];

// Identifiers used by earlier ECU content imports that shortened the faculty slug.
// They are resolved to the canonical faculty id so historical records stay joinable.
export const facultyIdAliases = {
  'faculty-computers-information-systems': 'faculty-computers-and-information-systems',
  'faculty-engineering-technology': 'faculty-engineering-and-technology',
  'faculty-pharmacy-drug-technology': 'faculty-pharmacy-and-drug-technology',
  'faculty-economics-international-trade': 'faculty-economics-and-international-trade',
  'faculty-arts-design': 'faculty-arts-and-design',
  'faculty-humanities-gis-surveying': 'faculty-humanities-gis-and-surveying',
};

export const canonicalFacultyId = (value) => {
  if (!value || typeof value !== 'string') return null;
  if (!value.startsWith('faculty-')) return `faculty-${value}`;
  return facultyIdAliases[value] || value;
};

export function resolveFaculty(value) {
  if (!value) return null;
  const id = canonicalFacultyId(value);
  return facultyDirectory.find((faculty) => faculty.id === id)
    || facultyDirectory.find((faculty) => faculty.slug === value)
    || null;
}

export const getFacultySlug = (value) => resolveFaculty(value)?.slug || null;
export const getFacultyName = (value) => resolveFaculty(value)?.name || null;

// The official ECU homepage currently features these four faculties.
export const faculties = facultyDirectory.filter(({ slug }) => ['engineering-and-technology', 'economics-and-international-trade', 'physical-therapy', 'pharmacy-and-drug-technology'].includes(slug)).map(({ name }) => name);
export const featuredFaculties = facultyDirectory.filter(({ slug }) => ['engineering-and-technology', 'economics-and-international-trade', 'physical-therapy', 'pharmacy-and-drug-technology'].includes(slug));
export function getFaculty(slug) { return facultyDirectory.find((faculty) => faculty.slug === slug); }
