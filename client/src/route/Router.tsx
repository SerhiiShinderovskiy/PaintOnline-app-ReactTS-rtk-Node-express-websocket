import React, { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';

const Router: FC = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path='/:id'
                    element={<Layout/>}
                />
                <Route
                    path='*'
                    element={<Navigate to={`f${(+new Date).toString(10)}`}/>}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;