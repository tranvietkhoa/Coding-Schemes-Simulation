import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { PageContent } from '../pages/mainpage';
import ChapterNav from '../components/chapternav/ChapterNav';
import Pagination from '../components/pagenav/Pagination';
import Authors from '../pages/authors/authors';

const router = createBrowserRouter([
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "/pages",
                element: <>
                    <Pagination />
                    <PageContent />
                    <ChapterNav />
                </>,
                children: [
                    {
                        path: "/pages/hamming",
                        element: <></>,
                    },
                    {
                        path: "/pages/convolutional",
                        element: <></>,
                    },
                    {
                        path: "/pages/reed-solomon",
                        element: <></>,
                    },
                ],
            },
            {
                path: "/authors",
                element: <Authors />,
            },
        ],
    },
]);

const AppRouterProvider = () => (
    <RouterProvider router={router} />
);

export default AppRouterProvider;
