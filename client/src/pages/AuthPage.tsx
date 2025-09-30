import NavBar from '@/components/navbar/navbar';
import LoginForm from '@/forms/loginForm';

const AuthPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main className="flex-grow flex justify-center items-center">
        <LoginForm />
      </main>
    </div>
  );
};

export default AuthPage;
