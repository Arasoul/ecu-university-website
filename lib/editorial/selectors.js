import { achievementRecords, eventRecords, galleryRecords, newsRecords, isUpcoming } from './records';

const byDateDescending = (a, b) => (b.eventDate || '').localeCompare(a.eventDate || '');
const byDateAscending = (a, b) => (a.eventDate || '').localeCompare(b.eventDate || '');

export const latestNews = () => [...newsRecords].sort((a, b) => (b.publicationDate || '').localeCompare(a.publicationDate || ''));
export const pastEvents = () => [...eventRecords].filter((record) => !isUpcoming(record)).sort(byDateDescending);
export const upcomingEvents = () => [...eventRecords].filter(isUpcoming).sort(byDateAscending);
export const featuredAchievement = () => achievementRecords[0] || null;
export const galleryEntries = () => galleryRecords;
