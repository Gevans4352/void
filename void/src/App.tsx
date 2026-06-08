
import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from "./Pages/Landing"
import Void from "../src/Pages/Void"
import Grove from "../src/Pages/Grove"
import Login from './Pages/Login'
import Register from './Pages/Register'

function App() {


  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/void" element={<Void/>}/>
        <Route path="/grove/:signal" element={<Grove/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App
