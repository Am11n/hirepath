import type { FC } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  background: #FAFAFA;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.9rem 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
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

export const PublicNavbar: FC = () => {
  return (
    <Header>
      <Nav aria-label="Primary">
        <BrandLink to="/" aria-label="HirePath home">
          <BrandImg src="/logo-hirepath-wide.png" alt="HirePath" />
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
        
        <LoginButton to="/signin" aria-label="Sign in">Sign in</LoginButton>
        
        <MenuButton aria-label="Open menu" aria-expanded="false">
          <span>☰</span>
        </MenuButton>
      </Nav>
    </Header>
  );
};

export default PublicNavbar;