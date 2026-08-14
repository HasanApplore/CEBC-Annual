import { Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { GalleryPage } from "./pages/Gallery";
import { HomePage } from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </div>
  );
}

export default App;
