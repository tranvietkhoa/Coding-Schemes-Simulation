import { useMainPageContext } from './context';
import ConvolutionalIntro from '../components/convolutional-demo/intro';

export default function Intro() {
  const { currPage } = useMainPageContext();

  return (
    <div>
      {currPage === 0 && <ConvolutionalIntro />}
    </div>
  );
}