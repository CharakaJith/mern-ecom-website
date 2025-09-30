import NavBar from '@/components/navbar/navbar';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section>
        <NavBar />
      </section>
    </div>
  );
};

export default LandingPage;
