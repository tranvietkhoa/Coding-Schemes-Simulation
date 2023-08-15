import { useState, useEffect } from 'react';
import { useMainPageContext } from "./context";
import ConvolutionalEncodeDemo from '../components/convolutional-demo/encode-demo';
import ConvolutionalDecodeDemo from '../components/convolutional-demo/decode-demo';

export function EncodeDemo() {
  const [instruction, setInstruction] = useState('');
  const { currPagePath, currPage } = useMainPageContext();

  useEffect(() => {
    if (currPagePath !== '') {
      fetch(`/${currPagePath}/demo-instruction?state=encode`)
        .then(response => response.text())
        .then(text => setInstruction(text));
    }
  }, [currPagePath]);

  return <div>
    <div>{instruction}</div>
    {currPage === 0 && <ConvolutionalEncodeDemo />}
  </div>
}

export function DecodeDemo() {
  const { currPagePath, currPage } = useMainPageContext();
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    if (currPagePath !== '') {
      fetch(`/${currPagePath}/demo-instruction?state=decode`)
        .then(response => response.text())
        .then(text => setInstruction(text));
    }
  }, [currPagePath]);

  return <div>
    <div>{instruction}</div>
    {currPage === 0 && <ConvolutionalDecodeDemo />}
  </div>
}