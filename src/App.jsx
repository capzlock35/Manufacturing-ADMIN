
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {


  return (

    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Login/> } />
          <Route path='/Dashboard' element={ <Dashboard/> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
