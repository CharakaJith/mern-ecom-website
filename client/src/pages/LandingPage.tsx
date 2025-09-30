import Footer from '@/components/footer/footer';
import NavBar from '@/components/navbar/navbar';
import ShowCase from '@/components/showcase/showcase';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section>
        <NavBar />
      </section>

      <section>
        <ShowCase />
      </section>

      <section className="bg-gray-800 rounded-t-4xl">
        <Footer />
      </section>
    </div>
  );
};

export default LandingPage;
