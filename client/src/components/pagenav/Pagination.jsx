import { useMainPageContext } from '../../pages/context';
import PaginationButton from './PaginationButton';
import './pagination.css';

export default function Pagination() {
  const { pages } = useMainPageContext();
  return (
    <div className="pagination">
      {
        pages.map((page, i) => (
          <PaginationButton key={i} pageName={page} order={i} />
        ))
      }
    </div>
  )
}