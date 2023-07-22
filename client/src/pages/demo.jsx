import { useState, useEffect } from 'react';
import { useMainPageContext } from "./context";
import ConvolutionalEncodeDemo from '../components/convolutional-demo/encode-demo';

export default function EncodeDemo() {
  const [instruction, setInstruction] = useState('');
  const { currPagePath, currPage } = useMainPageContext();

  useEffect(() => {
    if (currPagePath !== '') {
      fetch(`/${currPagePath}/demo-instruction`)
        .then(response => response.text())
        .then(text => setInstruction(text));
    }
  }, [currPagePath]);

  return <div>
    <div>{instruction}</div>
    {currPage === 0 && <ConvolutionalEncodeDemo />}
  </div>
}