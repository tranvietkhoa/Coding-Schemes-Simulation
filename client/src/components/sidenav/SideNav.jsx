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
  width: 30vw;
  background-color: rgb(11, 164, 31);
  padding: 20px;
  height: 100vh;
  position: sticky;
  top: 0px;
  flex-shrink: 0;
  user-select: none;
`;
