import { useMainPageContext } from './context';
import ConvolutionalIntro from './convolutional/intro';

export default function Intro() {
  const { currPage } = useMainPageContext();

  return (
    <div>
      {currPage === 0 && <ConvolutionalIntro />}
    </div>
  );
}