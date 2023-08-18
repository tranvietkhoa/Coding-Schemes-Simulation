import { useState, useEffect, createContext, useContext } from 'react';
import { useMainPageContext } from "./context";
import ConvolutionalEncodeDemo from '../components/convolutional-demo/encode-demo';
import ConvolutionalDecodeDemo from '../components/convolutional-demo/decode-demo';
import ConvolutionalInstruction from '../components/convolutional-demo/convolutional-instruction';

const useEncodeState = () => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  
  return {
    isContentLoading,
    setIsContentLoading,
  }
}

const EncodeContext = createContext(null);

export const useEncodeContext = () => useContext(EncodeContext);

export function EncodeDemo() {
  const { currPage } = useMainPageContext();

  return <EncodeContext.Provider value={useEncodeState()}>
    <ConvolutionalInstruction />
    {currPage === 0 && <ConvolutionalEncodeDemo />}
  </EncodeContext.Provider>
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