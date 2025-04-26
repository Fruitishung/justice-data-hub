import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import ReportDetailsPage from "./pages/ReportDetailsPage";
import MockDataPage from "./pages/MockDataPage";
import TrainingPhotosPage from "./pages/TrainingPhotosPage";
import AITestingPage from "./pages/AITestingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ReportDetailsPage />,
  },
  {
    path: "/report/new",
    element: <ReportDetailsPage />,
  },
  {
    path: "/report/:id",
    element: <ReportDetailsPage />,
  },
  {
    path: "/mock-data",
    element: <MockDataPage />,
  },
  {
    path: "/training-photos",
    element: <TrainingPhotosPage />,
  },
  {
    path: "/ai-testing",
    element: <AITestingPage />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
