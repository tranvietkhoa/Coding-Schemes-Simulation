import { useState, useEffect } from 'react';
import { useMainPageContext } from '../../pages/context';

export default function Intro() {
  const [introText, setIntroText] = useState('');
  const { currPage, pages } = useMainPageContext();

  useEffect(() => {
    if (currPage !== -1) {
      fetch(`/${pages[currPage].toLowerCase().split(' ').reduce((prev, curr) => prev + '-' + curr)}/intro`)
        .then(response => response.text())
        .then(text => {
          setIntroText(text);
        });
    }
  }, [currPage]);

  return (
    <div>{introText}</div>
  );
}