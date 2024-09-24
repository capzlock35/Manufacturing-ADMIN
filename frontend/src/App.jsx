
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminHome from './pages/AdminHome'




function App() {

  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Login/> } />
        <Route path='/register' element={ <Register />} />
        <Route path='/home/*' element={ <AdminHome/> } />
      </Routes>
    </BrowserRouter>
  </>

 

  )
}

export default App

