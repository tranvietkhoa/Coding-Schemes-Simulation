import { useState, useEffect, createContext, useContext } from 'react';
import { useMainPageContext } from "./context";
import ConvolutionalEncodeDemo from '../components/convolutional-demo/encode-demo';
import ConvolutionalDecodeDemo from '../components/convolutional-demo/decode-demo';
import ConvolutionalInstruction from '../components/convolutional-demo/convolutional-instruction';
import HammingInstruction from '../components/hamming-demo/hamming-instruction';
import HammingEncode from '../components/hamming-demo/hamming-encode';
import HammingDecode from '../components/hamming-demo/hamming-decode';
import RSEncode from '../components/rs-demo/rs-encode';
import RSDecode from '../components/rs-demo/rs-decode';

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
    {currPage === 0 && <ConvolutionalInstruction />}
    {currPage === 1 && <HammingInstruction />}
    {currPage === 0 && <ConvolutionalEncodeDemo />}
    {currPage === 1 && <HammingEncode />}
    {currPage === 2 && <RSEncode />}
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
    {currPage === 1 && <HammingDecode />}
    {currPage === 2 && <RSDecode />}
  </div>
}