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
    </div>
  );
};

export default LandingPage;
