import { useLocation, useNavigate } from 'react-router-dom';
import { Text } from '../text/text.component';
import { theme } from '../../colors.js';
import './FloatingNav.scss';

// @ts-ignore — Vite resolves PDF as URL with ?url suffix
import resumeUrl from '../../assets/misc/jason_chen_resume.pdf?url';

interface FloatingNavProps {
  screenWidth: number;
  showMenu: boolean;
  setShowMenu: (v: boolean) => void;
}

const NAV_LINKS = [
  { label: 'Work',  id: 'Work' },
  { label: 'Photo', id: 'Photo' },
  { label: 'About', id: 'About' },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: 'smooth' });
};

export const FloatingNav = ({ screenWidth, showMenu, setShowMenu }: FloatingNavProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isProject = pathname !== '/';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleResume = () => {
    window.open(resumeUrl, '_blank');
  };

  const handleNavClick = (id: string) => {
    window.dispatchEvent(new CustomEvent('gallery-unlock'));
    scrollToSection(id);
  };

  const handleMobileNavClick = (id: string) => {
    setShowMenu(false);
    window.dispatchEvent(new CustomEvent('gallery-unlock'));
    setTimeout(() => scrollToSection(id), 50);
  };

  if (screenWidth < 1200) {
    return (
      <>
        <nav className={`floating-nav floating-nav--mobile${showMenu ? ' is-open' : ''}`}>
          {isProject ? (
            <button className="floating-nav__back" onClick={handleBack}>
              ← Back
            </button>
          ) : (
            <button
              className="floating-nav__menu-toggle"
              onClick={() => setShowMenu(!showMenu)}
            >
              {showMenu ? 'Close' : 'Menu'}
            </button>
          )}
        </nav>

        {showMenu && !isProject && (
          <div className="floating-nav__mobile-menu">
            <ul className="mobile-menu-list">
              {NAV_LINKS.map(item => (
                <li key={item.id} onClick={() => handleMobileNavClick(item.id)}>
                  <Text size="Header" color={theme.primary} text={item.label} caps />
                </li>
              ))}
              <li onClick={() => { handleResume(); setShowMenu(false); }}>
                <Text size="Header" color={theme.primary} text="Resume" caps />
              </li>
              <li className="mobile-menu-footer">
                <Text size="Header" text="© JASON CHEN 2025" textAlign="left" caps />
              </li>
            </ul>
          </div>
        )}
      </>
    );
  }

  return (
    <nav className="floating-nav">
      {isProject ? (
        <button className="floating-nav__back" onClick={handleBack}>
          ← Back
        </button>
      ) : (
        <>
          {NAV_LINKS.map(item => (
            <button
              key={item.id}
              className="floating-nav__link"
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
          <button
            className="floating-nav__link"
            onClick={handleResume}
          >
            Resume
          </button>
        </>
      )}
    </nav>
  );
};
