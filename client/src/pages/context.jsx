import { useState, createContext, useContext, useMemo } from 'react';

const useMainPageState = () => {
  const [currPage, setCurrPage] = useState(-1);
  const pages = useMemo(() => ['Convolutional', 'Hamming', 'Reed Solomon'], []);
  const [currChapter, setCurrChapter] = useState(-1);
  const chapterCounts = useMemo(() => [3, 2, 1], []);
  const currPagePath = useMemo(() => 
    currPage !== -1 ? pages[currPage]
      .toLowerCase()
      .split(' ')
      .reduce((prev, curr) => prev + '-' + curr)
    : ''
  , [pages, currPage]);
  const currChapCount = useMemo(() => chapterCounts[currPage], [chapterCounts, currPage])
  const nextChapter = () => {
    currChapter < currChapCount - 1 && setCurrChapter(currChapter + 1);
  };
  const prevChapter = () => {
    currChapter > 0 && setCurrChapter(currChapter - 1);
  };
  const moveToPage = (newPage) => {
    setCurrPage(newPage);
    setCurrChapter(0);
  }
  const [convolutionalMessage, setConvolutionalMessage] = useState([]);

  return {
    currPage,
    currChapter,
    currPagePath,
    pages,
    chapterCounts,
    currChapCount,
    nextChapter,
    prevChapter,
    moveToPage,
    convolutionalMessage,
    setConvolutionalMessage,
  }
};

const MainPageContext = createContext(null);

export const MainPageContextProvider = ({ children }) => (
  <MainPageContext.Provider value={useMainPageState()}>{children}</MainPageContext.Provider>
)

export const useMainPageContext = () => useContext(MainPageContext);