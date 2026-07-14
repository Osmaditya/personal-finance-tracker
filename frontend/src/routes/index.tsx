import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from '../components/layout/AuthGuard';
import PublicGuard from '../components/layout/PublicGuard';
import MainLayout from '../components/layout/MainLayout';

// Pages
// (We will create these next)
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Transactions = React.lazy(() => import('../pages/Transactions'));
const Budgets = React.lazy(() => import('../pages/Budgets'));
const Categories = React.lazy(() => import('../pages/Categories'));
const Reports = React.lazy(() => import('../pages/Reports'));
const Profile = React.lazy(() => import('../pages/Profile'));

export const router = createBrowserRouter([
  {
    element: <PublicGuard />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/transactions', element: <Transactions /> },
          { path: '/budgets', element: <Budgets /> },
          { path: '/categories', element: <Categories /> },
          { path: '/reports', element: <Reports /> },
          { path: '/profile', element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
