import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center space-y-4 bg-cover bg-center bg-no-repeat text-black"
      style={{ backgroundImage: `url(/src/assets/images/not-found.jpg)` }}
    >
      <h1 className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[120px] font-extrabold leading-none drop-shadow-lg">404 - Error</h1>
      <p className="text-[30px] md:text-[50px]">PAGE NOT FOUND</p>
      <p className="text-[10px] md:text-[20px]">Your search has ventured beyond the known universe!</p>
      <Button className="bg-blue-800 hover:bg-blue-950 cursor-pointer text-xl py-5 px-6" onClick={handleGoBack}>
        Go back
      </Button>
    </div>
  );
};

export default NotFoundPage;
