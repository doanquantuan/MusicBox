import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import TopicsPage from './pages/topics'
import TopicDetailPage from './pages/topicDetail'
import PlaylistDetailPage from './pages/playlistDetail'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/topics",
    element: <TopicsPage />,
  },
  {
    path: "/topics/:topicId",
    element: <TopicDetailPage />,
  },
  {
    path: "/playlists/:playlistId",
    element: <PlaylistDetailPage />,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
