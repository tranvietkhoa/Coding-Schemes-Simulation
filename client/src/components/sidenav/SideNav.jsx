/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import NavHeader from './NavHeader';

export default function SideNav() {
  return (
    <div css={sideNavStyle}>
      <NavHeader />
    </div>
  )
}

const sideNavStyle = css`
  width: 13.98vw;
  padding: 2.42vw 5.16vw 2.42vw 2.42vw;
  position: sticky;
  top: 0px;
  flex-shrink: 0;
  user-select: none;
`;
