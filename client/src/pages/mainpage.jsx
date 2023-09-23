/** @jsxImportSource @emotion/react */
import { MainPageContextProvider, useMainPageContext } from './context';
import Pagination from '../components/pagenav/Pagination';
import Intro from './intro';
import { EncodeDemo, DecodeDemo } from './demo';
import ChapterNav from '../components/chapternav/ChapterNav';
import { HammingContextProvider } from './hamming/context';
import { ConvolutionalContextProvider } from './convolutional/context';
import { ReedSolomonContextProvider } from './reed-solomon/context';
import { css } from '@emotion/react';

export default function MainPage() {
  return (
    <MainPageContextProvider>
      <ConvolutionalContextProvider>
        <HammingContextProvider>
          <ReedSolomonContextProvider>
            <div css={mainPageStyle}>
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
      return <div css={pageBodyStyle}><Intro /></div>;
    case 1:
      return <div css={pageBodyStyle}><EncodeDemo /></div>;
    case 2:
      return <div css={pageBodyStyle}><DecodeDemo /></div>
    default:
      return <div css={pageBodyStyle}>Select a page</div>;
  }
}

const mainPageStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const pageBodyStyle = css`
  height: 70vh;
  overflow: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgb(207, 207, 207);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(133, 133, 133);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(76, 76, 76);
  }
`;
