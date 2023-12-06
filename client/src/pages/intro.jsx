import { useMainPageContext } from './context';
import ConvolutionalIntro from '../components/convolutional-demo/intro';
import HammingIntro from '../components/hamming-demo/intro';
import ReedSolomonIntro from '../components/rs-demo/intro';

export default function Intro() {
  const { currPage } = useMainPageContext();

  return (
    <div>
      {currPage === 0 && <ConvolutionalIntro />}
      {currPage === 1 && <HammingIntro />}
      {currPage === 2 && <ReedSolomonIntro />}
    </div>
  );
}