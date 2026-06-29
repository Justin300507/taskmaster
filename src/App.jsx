import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TaskEditPage from './pages/TaskEditPage';
import InviteAcceptPage from './pages/InviteAcceptPage';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Layout>
                <ProjectListPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ProjectDetailPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:id/edit"
          element={
            <PrivateRoute>
              <Layout>
                <TaskEditPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/invites/:id/accept"
          element={
            <PrivateRoute>
              <Layout>
                <InviteAcceptPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;