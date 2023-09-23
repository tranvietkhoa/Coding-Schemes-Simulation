/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SideNav from './components/sidenav/SideNav';
import MainPage from './pages/mainpage';

function App() {
  return (
    <div css={appStyle}>
      <SideNav />
      <div css={pageStyle}>
        <MainPage />
      </div>
    </div>
  );
}

const appStyle = css`
  display: flex;
  flex-direction: row;
`;

const pageStyle = css`
  padding: 50px;
  flex-grow: 1;
`;

export default App;
