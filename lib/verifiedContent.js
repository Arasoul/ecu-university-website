import dataset from '../data/imports/ecu_verified_content_2026-10-21.json';

const required = ['id', 'title', 'verification'];

function validate(records, label) {
  if (!Array.isArray(records)) throw new Error(`${label} must be an array`);
  const ids = new Set();
  records.forEach((record) => {
    required.forEach((field) => {
      if (!record[field]) throw new Error(`${label} record is missing ${field}`);
    });
    if (ids.has(record.id)) throw new Error(`Duplicate ${label} record: ${record.id}`);
    ids.add(record.id);
  });
  return records;
}

export const verifiedDataset = dataset;
export const verifiedUniversity = validate(dataset.university, 'University');
export const verifiedFaculties = validate(dataset.faculties, 'Faculty');
export const verifiedFacultyDetails = validate(dataset.facultyDetails, 'Faculty detail');
export const verifiedLearningRecords = validate(dataset.facultyLearningRecords, 'Learning');
export const verifiedAcademicAreas = validate(dataset.academicAreas, 'Academic area');
export const verifiedAdmissions = validate(dataset.admissions, 'Admissions');
export const verifiedStories = validate(dataset.archivedStories, 'Story');

export const getUniversityRecord = (id) => verifiedUniversity.find((record) => record.id === id);
export const getFacultyDetail = (facultyId) => verifiedFacultyDetails.find((record) => record.facultyId === facultyId);
export const getFacultyLearningRecords = (facultyId) => verifiedLearningRecords.filter((record) => record.facultyId === facultyId);
export const getAdmissionsById = (id) => verifiedAdmissions.find((record) => record.id === id);
