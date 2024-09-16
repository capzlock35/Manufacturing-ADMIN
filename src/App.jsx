
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import AdminHome from './pages/AdminHome'
import Register from './pages/Register'




function App() {

  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Login/> } />
        <Route path='/register' element={ <Register />} />
        <Route path='/home' element={ <AdminHome/> } />
      </Routes>
    </BrowserRouter>
  </>

 

  )
}

export default App
