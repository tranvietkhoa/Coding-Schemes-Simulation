import PaginationButton from './PaginationButton';
import './pagination.css';

export default function Pagination() {
  return (
    <div className="pagination">
      <PaginationButton pageName={'page 1'} />
      <PaginationButton pageName={'page 2'} />
      <PaginationButton pageName={'page 3'} />
    </div>
  )
}