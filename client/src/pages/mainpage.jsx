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
      return <Intro />;
    case 1:
      return <Demo />;
    default:
      return <div>Select a page</div>;
  }
}