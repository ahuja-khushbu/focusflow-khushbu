import { Link, useLocation } from 'react-router-dom';
import {
  ChartPieSlice,
  SquaresFour,
  Rows,
  Tag,
  Sun,
  Moon,
  SignOut,
} from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth.js';
import useUIStore from '../../store/uiStore.js';
import Button from '../ui/Button.jsx';
import { cn } from '../../lib/utils.js';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: ChartPieSlice },
  { to: '/boards', label: 'Boards', icon: SquaresFour },
  { to: '/tasks', label: 'List', icon: Rows },
  { to: '/settings/tags', label: 'Tags', icon: Tag },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const darkMode = useUIStore((s) => s.darkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <nav className="border-b border-border-warm bg-surface px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="FocusFlow" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-semibold text-text-primary">FocusFlow</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive(to)
                  ? 'text-copper bg-copper/8'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-warm'
              )}
            >
              <Icon size={15} weight={isActive(to) ? 'fill' : 'regular'} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-warm transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <span className="text-sm text-text-secondary px-1">{user?.name}</span>

        <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1.5">
          <SignOut size={15} />
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
