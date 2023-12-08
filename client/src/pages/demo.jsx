import { useMainPageContext } from "./context";
import ConvolutionalEncodeDemo from '../components/convolutional-demo/encode-demo';
import ConvolutionalDecodeDemo from '../components/convolutional-demo/decode-demo';
import HammingEncode from '../components/hamming-demo/hamming-encode';
import HammingDecode from '../components/hamming-demo/hamming-decode';
import RSEncode from '../components/rs-demo/rs-encode';
import RSDecode from '../components/rs-demo/rs-decode';

export function EncodeDemo() {
  const { currPage } = useMainPageContext();

  return <>
    {currPage === 0 && <ConvolutionalEncodeDemo />}
    {currPage === 1 && <HammingEncode />}
    {currPage === 2 && <RSEncode />}
  </>
}

export function DecodeDemo() {
  const { currPage } = useMainPageContext();

  return <div>
    {currPage === 0 && <ConvolutionalDecodeDemo />}
    {currPage === 1 && <HammingDecode />}
    {currPage === 2 && <RSDecode />}
  </div>
}