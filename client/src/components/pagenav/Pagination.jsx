/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMainPageContext } from '../../pages/context';
import PaginationButton from './PaginationButton';

export default function Pagination() {
  const { pages } = useMainPageContext();
  return (
    <div css={paginationStyle}>
      {
        pages.map((page, i) => (
          <PaginationButton key={i} pageName={page} order={i} />
        ))
      }
    </div>
  )
}

const paginationStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  user-select: none;
`;
