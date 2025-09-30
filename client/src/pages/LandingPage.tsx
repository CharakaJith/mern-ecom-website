import Footer from '@/components/footer/footer';
import NavBar from '@/components/navbar/navbar';
import ShowCase from '@/components/showcase/showcase';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main className="flex-grow">
        <ShowCase />
      </main>

      <footer className="bg-gray-800 rounded-t-4xl">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingPage;
