import { Link } from 'react-router-dom';
import { ChevronsUpIcon } from 'lucide-react';
import { NAV_LINKS, type NavLink } from '@/constants/nav.constant';
import { FaLinkedin, FaTwitter, FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const contactMail = import.meta.env.VITE_CONTACT_EMAIL;
const contactPhone = import.meta.env.VITE_CONTACT_PHONE;

import logo from '@/assets/icons/stitch-white.png';

const Footer: React.FC = () => {
  // go to page top
  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // open email
  const openMail = () => {
    const email = contactMail;
    const subject = 'A Message for the Coffee-Fueled Possum!';
    const body = 'Dear perpetually suffering possum, ';

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank');
  };

  // open call
  const openPhone = () => {
    const phoneNumber = `+${contactPhone}`;

    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <footer className="text-white pt-12 pb-6">
      {/* info section */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        <div className="flex flex-col items-start gap-4">
          {/* logo */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo png" className="h-14 w-14 object-contain" />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-3xl font-bold cursor-default">Stitch & Style</h1>
              <p className="text-gray-300 text-sm md:text-base cursor-default">Crafted with care, worn with pride.</p>
            </div>
          </div>

          {/* go to top button */}
          <button
            onClick={goToTop}
            className="mt-4 px-6 md:px-10 py-2 bg-green-400 hover:bg-green-600 text-black rounded-lg text-sm md:text-base font-semibold cursor-pointer flex items-center justify-center gap-2"
          >
            <ChevronsUpIcon className="w-5 md:w-6 h-5 md:h-6" />
            Go to Top
          </button>
        </div>

        {/* nav links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-base font-semibold text-white cursor-default">Quick Links</h4>
          <ul className="flex flex-col gap-1 text-gray-300 text-sm">
            {NAV_LINKS.map((link: NavLink) => {
              return (
                <li key={link.href}>
                  <Link to={link.href} className="flex items-center gap-2 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* contact info */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-white cursor-default">Contact</h4>
          <p className="text-gray-300 text-sm cursor-default" onClick={openMail}>
            Email: <span className="cursor-pointer hover:text-white">gunasinghe.info@gmail.com</span>
          </p>
          <p className="text-gray-300 text-sm cursor-default" onClick={openPhone}>
            Phone: <span className="cursor-pointer hover:text-white">+94 70 79 79095</span>
          </p>

          {/* social links */}
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-gray-300 hover:text-white">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaWhatsapp size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaFacebook size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* legal section */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-300 text-sm md:text-base max-w-6xl mx-auto px-4 cursor-default">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
          <span>© 2025 Charaka Gunasinghe. All rights reserved.</span>
          <span className="hidden md:inline">|</span>
          <div className="flex gap-2">
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span className="hidden md:inline">|</span>
            <Link to="/terms" className="hover:text-white">
              Terms Of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
