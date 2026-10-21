import SiteHeader from '../../components/SiteHeader';
import UniversitySearch from '../../components/UniversitySearch';

export const metadata = { title: 'Search ECU | Egyptian Chinese University' };

export default function SearchPage() {
  return <main><SiteHeader /><header className="information-hero"><div className="wrap"><p className="eyebrow">UNIVERSITY SEARCH</p><h1>Find your way through ECU.</h1><p>Search verified faculties, programme areas, university information, admissions guidance and dated archived activities.</p></div></header><section className="section wrap"><UniversitySearch /></section></main>;
}
