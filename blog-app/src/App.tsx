import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './pages/Login';
import Register from './pages/Register';
import BlogList from "./pages/BlogList";
import BlogDetails from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import "./index.css";

function AppRoutes(){
  const {user, loading} = useAuth()

  if(loading) {
    return <p className="loading-text">Checking authentication...</p>
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/blog" replace />} />
      <Route path="/login" element={user ? <Navigate to="/blog" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/blog" replace /> : <Register />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/blog/new" element={<CreateBlog />} />
        <Route path="/blog/edit/:id" element={<EditBlog />} />
      </Route>

      <Route path="*" element={<Navigate to="/blog" replace />} />
    </Routes>
  )
}

function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
