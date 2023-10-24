import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import HomeComponent from './components/HomeComponent';
import DiscussComponent from './components/DiscussComponent';
import NewArticleComponent from './components/NewArticleComponent';
import ArticleDetailComponent from './components/ArticleDetailComponent';
import ArticleCardComponent from './components/ArticleCardComponent';
import UserProfileComponent from './components/UserProfileComponent';

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeComponent />
      },
      {
        path: "/discuss",
        element: <DiscussComponent />,
        children: [
          {
            path: "/discuss/:categoryId",
            element: <ArticleCardComponent />
          }
        ]
      },
      {
        path: "/write",
        element: <NewArticleComponent />
      },
      {
        path: "/article/:id",
        element: <ArticleDetailComponent />
      },
      {
        path: "/profile/:id",
        element: <UserProfileComponent />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginComponent />
  },
  {
    path: "/register",
    element: <RegisterComponent />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router = {Router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
