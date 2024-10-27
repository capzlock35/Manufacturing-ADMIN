
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminHome from './pages/AdminHome'
import { Toaster } from 'react-hot-toast'



function App() {
  const isUserSignedIn = !!localStorage.getItem('token')
  return (
  <>
    <BrowserRouter>
    <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path='/' element={ <Login/> } />
        <Route path='/register' element={ <Register />} />
        {isUserSignedIn && <Route path='/home/*' element={ <AdminHome/> } />}
      </Routes>
    </BrowserRouter>
  </>

 

  )
}

export default App

