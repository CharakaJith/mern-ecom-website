import NavBar from '@/components/navbar/navbar';
import ItemDisplay from '@/components/showcase/itemDisplay';

const ProductDetailsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main className="flex-1">
        <ItemDisplay />
      </main>
    </div>
  );
};

export default ProductDetailsPage;
