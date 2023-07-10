import { useState, createContext, useContext } from 'react';

const useMainPageState = () => {
  const [currPage, setCurrPage] = useState(-1);
  const pages = ['Convolutional', 'Hamming', 'Reed Solomon'];

  return {
    currPage,
    setCurrPage,
    pages
  }
};

const MainPageContext = createContext(null);

export const MainPageContextProvider = ({ children }) => (
  <MainPageContext.Provider value={useMainPageState()}>{children}</MainPageContext.Provider>
)

export const useMainPageContext = () => useContext(MainPageContext);