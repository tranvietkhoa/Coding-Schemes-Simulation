import { useState, useEffect } from 'react';
import { useMainPageContext } from "./context";

export default function Demo() {
  const [instruction, setInstruction] = useState('');
  const { currPagePath } = useMainPageContext();

  useEffect(() => {
    if (currPagePath !== '') {
      fetch(`/${currPagePath}/demo-instruction`)
        .then(response => response.text())
        .then(text => setInstruction(text));
    }
  }, [currPagePath]);

  return <div>
    <div>{instruction}</div>
  </div>
}