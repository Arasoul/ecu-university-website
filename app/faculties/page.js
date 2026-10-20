import Link from 'next/link';
import './faculties.css';
import FacultyDirectory from '../../components/FacultyDirectory';
import SiteHeader from '../../components/SiteHeader';
import { facultyDirectory } from '../../lib/faculties';
export const metadata = { title: 'Faculties | Egyptian Chinese University' };
export default function FacultiesPage() { return <main><SiteHeader /><header className="directory-header"><div className="wrap"><Link className="breadcrumb" href="/">ECU home</Link><p className="eyebrow">ACADEMICS</p><h1>Explore ECU faculties</h1><p>Find the faculty that fits your direction. Search the twelve faculty records currently verified from ECU sources.</p></div></header><section className="section wrap"><FacultyDirectory faculties={facultyDirectory} /></section></main>; }
