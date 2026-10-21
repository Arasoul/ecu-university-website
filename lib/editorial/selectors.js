import { achievementRecords, eventRecords, galleryRecords, newsRecords, isUpcoming } from './records';

export const latestNews = () => [...newsRecords].sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));
export const pastEvents = () => [...eventRecords].filter((record) => !isUpcoming(record)).sort((a, b) => b.eventDate.localeCompare(a.eventDate));
export const upcomingEvents = () => [...eventRecords].filter(isUpcoming).sort((a, b) => a.eventDate.localeCompare(b.eventDate));
export const featuredAchievement = () => achievementRecords[0] || null;
export const galleryEntries = () => galleryRecords;
