import React from 'react';
import { Routes, Route } from 'react-router-dom';


import UsersTable from './components/user.table.jsx';
import NotFoundPage from "./pages/notFountPage.jsx";


export default function AppRoutes() {
    return (
        <Routes>

            <Route path="/users" element={<UsersTable />} />
            <Route path="/public" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
