import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminHome from "./pages/AdminHome";
import { Toaster } from "react-hot-toast";
import LoadingGif from "./assets/loading.gif"; // Import the GIF



function App() {
  const [loading, setLoading] = useState(true);
  const isUserSignedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Show loading for 2 seconds
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <img src={LoadingGif} alt="Loading..." className="w-20 h-20" />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Login />} />
          {isUserSignedIn && <Route path="/home/*" element={<AdminHome />} />}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
