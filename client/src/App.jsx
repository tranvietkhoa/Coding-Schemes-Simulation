/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SideNav from './components/sidenav/SideNav';
import MainPage from './pages/mainpage';
import Header from './components/header/header';
import { MainPageContextProvider } from './pages/context';

function App() {
  return (
    <div css={appStyle}>
      <Header />
      <MainPageContextProvider>
        <div css={bodyStyle}>
          <SideNav />
          <div css={pageStyle}>
            <MainPage />
          </div>
        </div>
      </MainPageContextProvider>
    </div>
  );
}

const appStyle = css`
  display: flex;
  flex-direction: column;
`;

const bodyStyle = css`
  display: flex;
  flex-direction: row;
`;

const pageStyle = css`
  padding: 31px 40px;
  flex-grow: 1;
`;

export default App;
