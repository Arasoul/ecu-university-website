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
  { slug: 'computers-and-information-systems', name: 'Computers and Information Systems', summary: 'Education, research and innovation in computing and information technology.', programs: computingPrograms, sourceUrl: 'https://ecu.edu.eg/computers-and-information-systems/' },
  { slug: 'engineering-and-technology', name: 'Engineering and Technology', summary: 'Modern engineering education with practical learning and research.', programs: engineeringPrograms, sourceUrl: 'https://ecu.edu.eg/faculties/engineering-and-technology/' },
  { slug: 'pharmacy-and-drug-technology', name: 'Pharmacy and Drug Technology', sourceUrl: 'https://ecu.edu.eg/faculties/pharmacy-and-drug-technology/' },
  { slug: 'physical-therapy', name: 'Physical Therapy', sourceUrl: 'https://ecu.edu.eg/faculties/physical-therapy/' },
  { slug: 'economics-and-international-trade', name: 'Economics and International Trade', summary: 'Foundation study in business and economics followed by a choice of five specialization pathways.', programs: economicsPrograms, sourceUrl: 'https://ecu.edu.eg/faculties/economics-and-international-trade/' },
  { slug: 'arts-and-design', name: 'Arts and Design', sourceUrl: 'https://ecu.edu.eg/faculties/' },
  { slug: 'veterinary-medicine', name: 'Veterinary Medicine', sourceUrl: 'https://ecu.edu.eg/faculties/' },
  { slug: 'mass-communication', name: 'Mass Communication', sourceUrl: 'https://ecu.edu.eg/faculties/' },
  { slug: 'literary-studies', name: 'Literary Studies', sourceUrl: 'https://ecu.edu.eg/faculties/' },
  { slug: 'law', name: 'Law', sourceUrl: 'https://ecu.edu.eg/faculties/' },
  { slug: 'nursing', name: 'Nursing', sourceUrl: 'https://ecu.edu.eg/faculties/' },
  { slug: 'humanities-gis-and-surveying', name: 'Humanities (GIS & Surveying)', sourceUrl: 'https://ecu.edu.eg/faculties/' },
];

// The official ECU homepage currently features these four faculties.
export const faculties = facultyDirectory.filter(({ slug }) => ['engineering-and-technology', 'economics-and-international-trade', 'physical-therapy', 'pharmacy-and-drug-technology'].includes(slug)).map(({ name }) => name);
export const featuredFaculties = facultyDirectory.filter(({ slug }) => ['engineering-and-technology', 'economics-and-international-trade', 'physical-therapy', 'pharmacy-and-drug-technology'].includes(slug));
export function getFaculty(slug) { return facultyDirectory.find((faculty) => faculty.slug === slug); }
