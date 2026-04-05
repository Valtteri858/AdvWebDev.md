import Header from "./components/Header";
import Banner from "./components/Banner";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />

      <a href="#" className="ostosnappi" aria-label="Ostoskori">
        🛒 <span className="ostoslaskuri">0</span>
      </a>

      <Banner />

      <main>
        <h2>Myydyimmät tuotteet</h2>
        <ProductGrid />
      </main>

      <Footer />
    </>
  );
}
