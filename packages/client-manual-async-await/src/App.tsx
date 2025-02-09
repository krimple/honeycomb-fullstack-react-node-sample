import BookLibrary from "./books/BookLibrary.tsx";
import {
    BrowserRouter as Router,
    Route,
    Link, Routes, Outlet
} from "react-router-dom";
import About from "./about/About.tsx";
import Home from "./home/Home.tsx";

function App() {

    return (
        <Router>
            <div className="container">
                <nav className="flex justify-between">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/books">Books</Link>
                </nav>
                <h1 className="text-center text-4xl font-bold">Book Library</h1>
                <div className="w-4/5 mx-auto my-auto p-10">
                    <Outlet />
                </div>
            </div>
            <Routes>
                <Route path="/about" element={<About />} />
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<BookLibrary />} />
            </Routes>
        </Router>
    );
}

export default App;
