import { MainPageContextProvider } from './context';
import Pagination from '../components/pagenav/Pagination';
import Intro from '../components/intro/intro';
import './mainpage.css';

export default function MainPage() {
  return (
    <MainPageContextProvider>
      <div className="main-page">
        <Pagination />
        <Intro />
      </div>
    </MainPageContextProvider>
  )
}