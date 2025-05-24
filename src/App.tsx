
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import ReportDetailsPage from "./pages/ReportDetailsPage";
import MockDataPage from "./pages/MockDataPage";
import TrainingPhotosPage from "./pages/TrainingPhotosPage";
import AITestingPage from "./pages/AITestingPage";
import BookingPhotosPage from "./pages/BookingPhotosPage";
import ArrestTagPage from "./pages/ArrestTagPage";
import NotFound from "./pages/NotFound";
import MCTETTSPage from "./pages/MCTETTSPage";
import AuthPage from "./pages/AuthPage";
import { Toaster } from "@/components/ui/toaster";
import RedirectToMCTETTS from "./components/redirects/RedirectToMCTETTS";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ReportDetailsPage />,
  },
  {
    path: "/report/new",
    element: <RedirectToMCTETTS />,
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
  {
    path: "/booking-photos",
    element: <BookingPhotosPage />,
  },
  {
    path: "/arrest-tag",
    element: <ArrestTagPage />,
  },
  {
    path: "/arrest-tag/:id",
    element: <ArrestTagPage />,
  },
  {
    path: "/mctetts",
    element: <MCTETTSPage />,
  },
  {
    path: "/auth/*",
    element: <AuthPage />,
  },
  {
    path: "/reset-password",
    element: <AuthPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
