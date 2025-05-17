
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar,
  Droplet,
  Timer,
  CupSoda,
  Moon,
  Dumbbell,
  Weight
} from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Mood', path: '/mood', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Water', path: '/water', icon: <Droplet className="h-5 w-5" /> },
    { name: 'Breathing', path: '/breathing', icon: <Timer className="h-5 w-5" /> },
    { name: 'Meals', path: '/meals', icon: <CupSoda className="h-5 w-5" /> },
    { name: 'Sleep', path: '/sleep', icon: <Moon className="h-5 w-5" /> },
    { name: 'Fitness', path: '/fitness', icon: <Dumbbell className="h-5 w-5" /> },
    { name: 'Weight', path: '/weight', icon: <Weight className="h-5 w-5" /> }
  ];

  return (
    <nav className="bg-background border-b border-border py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Timer className="h-6 w-6" />
            <span>HealthTrack</span>
          </Link>
          
          <div className="md:flex hidden space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm flex items-center transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="md:hidden flex">
            <button className="text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu (hidden by default) */}
        <div className="md:hidden hidden pt-4 pb-2">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
