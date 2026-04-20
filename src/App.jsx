import "./App.css";
import Header from "./components/Header";
import AmountDistributionSimulator from "./components/AmountDistributionSimulator";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-container" data-theme="light">
      <Header />
      <main className="app-main">
        <AmountDistributionSimulator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
