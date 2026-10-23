import { facultyDirectory } from './faculties';

const slugify = (value) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const programmeDirectory = facultyDirectory.flatMap((faculty) => (faculty.programs || []).map((program) => ({
  ...program,
  id: `${faculty.slug}-${slugify(program.name)}`,
  slug: `${faculty.slug}/${slugify(program.name)}`,
  faculty: faculty.name,
  facultySlug: faculty.slug,
  sourceUrl: faculty.sourceUrl,
  verification: 'This study area is published in ECU’s faculty record.',
})));

export function getProgramme(facultySlug, programmeSlug) {
  return programmeDirectory.find((programme) => programme.facultySlug === facultySlug && programme.slug === `${facultySlug}/${programmeSlug}`);
}
