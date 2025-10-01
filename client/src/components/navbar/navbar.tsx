import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import { NAV_LINKS } from '@/constants/nav.constant';

import logo from '@/assets/icons/stitch.png';

const NavBar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<Boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      setShowHistory(true);
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full text-black z-50">
      {/* main nav bar */}
      <div className="flex items-center justify-between h-20 w-full px-[5%] md:pt-10 md:pb-10 bg-white">
        {/* logo */}
        <div className="flex items-center space-x-2 text-2xl md:text-5xl font-bold hover:cursor-pointer">
          <img src={logo} alt="Logo png" className="h-8 md:h-15 w-8 md:w-15 object-contain" />
          <span>Stitch & Style</span>
        </div>

        {/* nav links */}
        <div className="hidden md:flex items-center space-x-6">
          {NAV_LINKS.map(({ href, label }) => {
            if (label === 'Order History' && !showHistory) return null;
            return (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `relative text-sm md:text-lg transition-colors duration-300 group ${
                    isActive ? 'text-blue-800' : 'text-gray-900 hover:text-blue-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-blue-800 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white/90 text-gray-900 shadow-lg z-50 transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* close button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <XIcon className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* sidebar content */}
        <div className="flex flex-col px-4 space-y-6">
          <div className="flex flex-col px-1 space-y-4">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              if (label === 'Order History' && !showHistory) return null;
              return (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) => {
                    const colorClass = isActive ? 'text-blue-800' : 'text-gray-900';
                    return `flex items-center gap-2 hover:text-gray-700 ${colorClass} ${
                      isActive ? 'underline underline-offset-5 font-semibold' : ''
                    }`;
                  }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
