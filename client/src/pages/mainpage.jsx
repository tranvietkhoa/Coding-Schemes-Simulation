import { MainPageContextProvider, useMainPageContext } from './context';
import Pagination from '../components/pagenav/Pagination';
import Intro from './intro';
import { EncodeDemo, DecodeDemo } from './demo';
import ChapterNav from '../components/chapternav/ChapterNav';
import './mainpage.css';
import { HammingContextProvider } from './hamming/context';
import { ConvolutionalContextProvider } from './convolutional/context';
import { ReedSolomonContextProvider } from './reed-solomon/context';

export default function MainPage() {
  return (
    <MainPageContextProvider>
      <ConvolutionalContextProvider>
        <HammingContextProvider>
          <ReedSolomonContextProvider>
            <div className="main-page">
              <Pagination />
              <PageContent />
              <ChapterNav />
            </div>
          </ReedSolomonContextProvider>
        </HammingContextProvider>
      </ConvolutionalContextProvider>
    </MainPageContextProvider>
  )
}

function PageContent() {
  const { currChapter } = useMainPageContext();
  switch (currChapter) {
    case 0:
      return <div className="page-body"><Intro /></div>;
    case 1:
      return <div className="page-body"><EncodeDemo /></div>;
    case 2:
      return <div className="page-body"><DecodeDemo /></div>
    default:
      return <div className="page-body">Select a page</div>;
  }
}