import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
  it('should render footer with company name', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should display Simtestlab EMS text', () => {
    render(<Footer />);
    const companyName = screen.getByText('Simtestlab EMS');
    expect(companyName).toBeInTheDocument();
  });

  it('should display version number', () => {
    render(<Footer />);
    const version = screen.getByText('v2026.1.0');
    expect(version).toBeInTheDocument();
  });

  it('should display copyright text', () => {
    render(<Footer />);
    const copyright = screen.getByText('© 2026 Simtestlab Sweden AB. All rights reserved');
    expect(copyright).toBeInTheDocument();
  });

  it('should display logo image with alt text', () => {
    render(<Footer />);
    const logo = screen.getByAltText('Simtestlab EMS');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('should have correct styling classes', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-white/95');
    expect(footer).toHaveClass('backdrop-blur-sm');
    expect(footer).toHaveClass('border-t');
  });

  it('should render as a footer element', () => {
    const { container } = render(<Footer />);
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
  });
});
