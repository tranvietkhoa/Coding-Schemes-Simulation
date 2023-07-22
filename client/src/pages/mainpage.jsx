import { MainPageContextProvider, useMainPageContext } from './context';
import Pagination from '../components/pagenav/Pagination';
import Intro from './intro';
import Demo from './demo';
import ChapterNav from '../components/chapternav/ChapterNav';
import './mainpage.css';

export default function MainPage() {
  return (
    <MainPageContextProvider>
      <div className="main-page">
        <Pagination />
        <PageContent />
        <ChapterNav />
      </div>
    </MainPageContextProvider>
  )
}

function PageContent() {
  const { currChapter } = useMainPageContext();
  switch (currChapter) {
    case 0:
      return <div className="page-body"><Intro /></div>;
    case 1:
      return <div className="page-body"><Demo /></div>;
    default:
      return <div className="page-body">Select a page</div>;
  }
}