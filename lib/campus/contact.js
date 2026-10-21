import { facultyDirectory } from '../faculties.js';

const officialContactSource = 'https://ecu.edu.eg/contact-us/';
const officialLocationSource = 'https://ecu.edu.eg/campus-location/';

const faculty = (slug) => {
  const record = facultyDirectory.find((item) => item.slug === slug);
  return record ? { slug: record.slug, name: record.name } : null;
};

const branch = ({
  id, name, shortName, address, description, facultySlugs,
}) => {
  const encodedAddress = encodeURIComponent(address);
  return {
    id,
    name,
    shortName,
    address,
    description,
    faculties: facultySlugs.map(faculty).filter(Boolean),
    mapsSearchUrl: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
    mapEmbedUrl: `https://www.google.com/maps?q=${encodedAddress}&output=embed`,
    sourceUrl: officialLocationSource,
    verification: 'official_public_source',
    verifiedOn: '2026-10-21',
    media: {
      status: id === 'nasr-city' ? 'authorized' : 'unverified',
      publishable: id === 'nasr-city',
      path: id === 'nasr-city' ? '/images/ecu/campus/nasr-city-campus-opening.jpg' : null,
      alt: id === 'nasr-city' ? 'ECU Nasr City campus entrance with its glass-fronted central facade' : null,
      note: id === 'nasr-city'
        ? 'ECU-hosted photograph published under confirmed ECU institutional-media authorization.'
        : 'No ECU photograph with confirmed branch identification and reuse permission is published here.',
    },
  };
};

export const campusContactRecords = [
  branch({
    id: 'heliopolis',
    name: 'Heliopolis / Gesr El Suez Branch',
    shortName: 'Heliopolis',
    address: 'Gesr El Suez Street, behind Tagneed Bridge, Cairo, Egypt.',
    description: 'The official campus-location source associates this branch with four ECU faculties.',
    facultySlugs: ['physical-therapy', 'engineering-and-technology', 'pharmacy-and-drug-technology', 'economics-and-international-trade'],
  }),
  branch({
    id: 'nasr-city',
    name: 'Nasr City Branch',
    shortName: 'Nasr City',
    address: 'Al Hay Al Asher, Nasr City, Cairo, Egypt.',
    description: 'The official campus-location source associates this branch with three ECU faculties.',
    facultySlugs: ['veterinary-medicine', 'computers-and-information-systems', 'arts-and-design'],
  }),
];

export const verifiedContactChannels = {
  hotline: '19346',
  contactSource: officialContactSource,
  applicationUrl: 'https://admission.ecu.edu.eg/',
  admissionsRoute: '/admissions',
  servicesRoute: '/services',
};

export const campusContactSources = [
  { label: 'ECU Contact Us', url: officialContactSource, verifiedOn: '2026-10-21' },
  { label: 'ECU Campus Location', url: officialLocationSource, verifiedOn: '2026-10-21' },
];

export const campusLocations = campusContactRecords.map(({ name, address }) => ({ name, address }));
