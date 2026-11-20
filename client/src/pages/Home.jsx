import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import LeadForm from "../components/landing/LeadForm";
import Footer from "../components/landing/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <LeadForm />
      </main>

      <Footer />
    </>
  );
};

export default Home;
      