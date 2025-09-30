import NavBar from '@/components/navbar/navbar';
import ShoppingCart from '@/components/shoppintCart/shoppintCart';

const CartPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main className="flex-grow flex justify-center items-center">
        <ShoppingCart />
      </main>
    </div>
  );
};

export default CartPage;
