import { useState, createContext, useContext, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useMainPageState = () => {
  const pages = useMemo(() => ['Convolutional', 'Hamming', 'Reed Solomon'], []);
  const [currChapter, setCurrChapter] = useState(0);
  const chapterCounts = useMemo(() => [3, 3, 3], []);
  const location = useLocation();
  const navigate = useNavigate();
  const [currPage, currPagePath] = useMemo(() => {
    if (location.pathname.startsWith('/pages/convolutional')) {
      return [0, 'convolutional'];
    } else if (location.pathname.startsWith('/pages/hamming')) {
      return [1, 'hamming'];
    } else if (location.pathname.startsWith('/pages/reed-solomon')) {
      return [2, 'reed-solomon'];
    } else {
      return [-1, ''];
    }
  }, [location]);
  const currChapCount = useMemo(() => chapterCounts[currPage], [chapterCounts, currPage])
  const nextChapter = () => {
    currChapter < currChapCount - 1 && setCurrChapter(currChapter + 1);
  };
  const prevChapter = () => {
    currChapter > 0 && setCurrChapter(currChapter - 1);
  };
  const moveToPage = useCallback((newPage) => {
    switch (newPage) {
      case 0:
        navigate('/pages/convolutional');
        break;
      case 1:
        navigate('/pages/hamming');
        break;
      case 2:
        navigate('/pages/reed-solomon');
        break;
      default:
        break;
    }
  }, [navigate]);

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
  }
};

const MainPageContext = createContext(null);

export const MainPageContextProvider = ({ children }) => (
  <MainPageContext.Provider value={useMainPageState()}>{children}</MainPageContext.Provider>
)

export const useMainPageContext = () => useContext(MainPageContext);