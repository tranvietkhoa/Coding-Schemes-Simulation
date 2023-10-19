import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { PageContent } from '../pages/mainpage';
import ChapterNav from '../components/chapternav/ChapterNav';

const router = createBrowserRouter([
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "/pages",
                element: <>
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
        ],
    },
]);

const AppRouterProvider = () => (
    <RouterProvider router={router} />
);

export default AppRouterProvider;
