import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HomePage } from './pages/HomePage';
import { SponsorFormPage } from './pages/SponsorFormPage';
import Catalog from './pages/Catalog';
import { LogIn } from './pages/LogIn';
import { SignUp } from './pages/SignUp';
import { AuthProvider } from './firebase/contexts/AuthContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Registration } from './pages/Registration';
import { SponsorDashboard } from './pages/SponsorDashboard';
import Account from './pages/Account';

function AppRouter() {
    const [currentFamilyID, setCurrentFamilyID] = useState('Family 1');

    const router = createBrowserRouter([
        { path: '/', element: <HomePage /> },
        { path: '/sponsor-registration', element: <SponsorFormPage /> },
        { path: '/login', element: <LogIn /> },
        { path: '/signup', element: <SignUp /> },
        { path: '/catalog', element: <Catalog/> },
        { path: '/registration', element: <Registration /> },
        { path: '/sponsor-dashboard', element: <SponsorDashboard /> },
        { path: '/account', element: <Account /> },
    ]);

    return <RouterProvider router={router} />;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
