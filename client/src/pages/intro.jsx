import { useState, useEffect } from 'react';
import { useMainPageContext } from './context';

export default function Intro() {
  const [introText, setIntroText] = useState('');
  const { currPagePath } = useMainPageContext();

  useEffect(() => {
    if (currPagePath !== '') {
      fetch(`/${currPagePath}/intro`)
        .then(response => response.text())
        .then(text => {
          setIntroText(text);
        });
    }
  }, [currPagePath]);

  return (
    <div>{introText}</div>
  );
}