import { useMainPageContext } from './context';
import ConvolutionalIntro from '../components/convolutional-demo/intro';
import HammingIntro from '../components/hamming-demo/intro';

export default function Intro() {
  const { currPage } = useMainPageContext();

  return (
    <div>
      {currPage === 0 && <ConvolutionalIntro />}
      {currPage === 1 && <HammingIntro />}
    </div>
  );
}