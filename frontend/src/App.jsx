import NavBar from "./components/NavBar"
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"

const App = () => {
  return (
    <div className = "min-h-screen bg-base-200 transition-colors duration-300" data-theme="forest">
        <NavBar/>

        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/products/:id" element={<ProductPage />}/>
        </Routes>
    </div>
  )
}

export default App
