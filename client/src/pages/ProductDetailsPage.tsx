import Footer from '@/components/footer/footer';
import NavBar from '@/components/navbar/navbar';
import ItemDisplay from '@/components/showcase/itemDisplay';

const ProductDetailsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      {/* main content grows to fill remaining space */}
      <main className="flex-1">
        <ItemDisplay />
      </main>

      <footer className="bg-gray-800 rounded-t-4xl">
        <Footer />
      </footer>
    </div>
  );
};

export default ProductDetailsPage;
