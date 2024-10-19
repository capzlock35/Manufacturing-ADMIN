
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminHome from './pages/AdminHome'




function App() {
  const isUserSignedIn = !!localStorage.getItem('token')
  return (
  <>
    <BrowserRouter>
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

