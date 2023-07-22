import { useMainPageContext } from '../../pages/context';
import PrevButton from './prev-button';
import NextButton from './next-button';
import './chapternav.css';

export default function ChapterNav() {
  const { currChapter, currChapCount, nextChapter, prevChapter } = useMainPageContext();

	return currChapter !== -1 
	? <div id="chapter-nav">
		<div className="chapter-control" onClick={() => prevChapter()}>
			<PrevButton />
		</div>
		<div>{
			`${currChapter + 1} out of ${currChapCount}`
		}</div>
		<div className="chapter-control" onClick={() => nextChapter()}>
			<NextButton />
		</div>
	</div>
	: '';
}