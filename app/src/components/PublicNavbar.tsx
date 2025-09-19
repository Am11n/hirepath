import type { FC } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  background: linear-gradient(180deg, #a9ccd9 0%, #dbe2e8 60%, #c7d0d8 100%);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.9rem 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.75rem;
  }
  
  @media (max-width: 640px) {
    padding: 0.75rem 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.5rem;
    gap: 0.5rem;
  }
  
  @media (max-width: 320px) {
    padding: 0.5rem 0.25rem;
    gap: 0.25rem;
  }
`;

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
`;

const BrandImg = styled.img`
  display: block;
  height: 40px;
  width: auto;
  
  @media (max-width: 768px) {
    height: 36px;
  }
  
  @media (max-width: 480px) {
    height: 32px;
  }
  
  @media (max-width: 320px) {
    height: 28px;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-self: center;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: #374151;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover,
  &:focus-visible {
    background-color: rgba(0, 0, 0, 0.05);
    outline: none;
  }
`;

const LoginButton = styled(Link)`
  justify-self: end;
  display: inline-block;
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  background: white;
  color: #1f2937;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  
  &:focus-visible {
    outline: 2px solid #1f2937;
    outline-offset: 2px;
  }
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  justify-self: end;
  display: none;
  appearance: none;
  border: 1px solid #d1d5db;
  background: white;
  color: #1f2937;
  padding: 0.45rem 0.6rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  
  &:focus-visible {
    outline: 2px solid #1f2937;
    outline-offset: 2px;
  }
  
  &:hover {
    background: #f9fafb;
  }
  
  @media (max-width: 640px) {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #a9ccd9 0%, #dbe2e8 60%, #c7d0d8 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 20;
  
  @media (min-width: 641px) {
    display: none;
  }
`;

const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MobileNavItem = styled.li`
  width: 100%;
`;

const MobileNavLink = styled(Link)`
  display: block;
  color: #374151;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover,
  &:focus-visible {
    background-color: rgba(0, 0, 0, 0.05);
    outline: none;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.6rem;
  }
  
  @media (max-width: 320px) {
    font-size: 0.85rem;
    padding: 0.5rem;
  }
`;

const MobileLoginButton = styled(Link)`
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.75rem;
  border-radius: 10px;
  background: white;
  color: #1f2937;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  margin-top: 0.25rem;
  box-sizing: border-box;
  
  &:focus-visible {
    outline: 2px solid #1f2937;
    outline-offset: 2px;
  }
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  @media (max-width: 320px) {
    padding: 0.5rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }
`;

export const PublicNavbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Header>
      <Nav aria-label="Primary">
        <BrandLink to="/" aria-label="HirePath home" onClick={closeMenu}>
          <BrandImg src={encodeURI('/Vanlig uten bakgrunn-HirePath (1).png')} alt="HirePath" />
        </BrandLink>
        
        <NavList role="list">
          <li>
            <NavLink href="/features">Features</NavLink>
          </li>
          <li>
            <NavLink href="/about">About</NavLink>
          </li>
          <li>
            <NavLink href="/blog">Blog</NavLink>
          </li>
        </NavList>
        
        <LoginButton to="/signin" aria-label="Sign in" onClick={closeMenu}>Sign in</LoginButton>
        
        <MenuButton 
          aria-label="Open menu" 
          aria-expanded={isMenuOpen} 
          onClick={toggleMenu}
        >
          <span>{isMenuOpen ? '✕' : '☰'}</span>
        </MenuButton>
        
        <MobileMenu isOpen={isMenuOpen}>
          <MobileNavList>
            <MobileNavItem>
              <MobileNavLink to="/features" onClick={closeMenu}>Features</MobileNavLink>
            </MobileNavItem>
            <MobileNavItem>
              <MobileNavLink to="/about" onClick={closeMenu}>About</MobileNavLink>
            </MobileNavItem>
            <MobileNavItem>
              <MobileNavLink to="/blog" onClick={closeMenu}>Blog</MobileNavLink>
            </MobileNavItem>
            <MobileNavItem>
              <MobileLoginButton to="/signin" onClick={closeMenu}>Sign in</MobileLoginButton>
            </MobileNavItem>
          </MobileNavList>
        </MobileMenu>
      </Nav>
    </Header>
  );
};

export default PublicNavbar;