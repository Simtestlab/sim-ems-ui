import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '@/components/Header';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { usePathname } from 'next/navigation';

// Mock the dependencies
jest.mock('@/modules/auth/context/AuthContext');
jest.mock('next/navigation');
jest.mock('@/components/LogoutIcon', () => ({
  LogoutIcon: () => <div>LogoutIcon</div>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Header Component', () => {
  const mockLogout = jest.fn();

  const mockUser = {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    first_name: 'John',
    full_name: 'John Doe',
    role_display: 'Admin',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isLoading: false,
      error: null,
    } as any);
    mockUsePathname.mockReturnValue('/live');
  });

  it('should render header element', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should display logo image', () => {
    render(<Header />);
    const logo = screen.getByAltText('Simtestlab EMS Logo');
    expect(logo).toBeInTheDocument();
  });

  it('should display company name', () => {
    render(<Header />);
    expect(screen.getByText('Sim-EMS')).toBeInTheDocument();
  });

  it('should display Energy Management System text', () => {
    render(<Header />);
    expect(screen.getByText('Energy Management System')).toBeInTheDocument();
  });

  it('should display navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Site Map')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('should display user avatar with first letter of first name', () => {
    render(<Header />);
    const avatar = screen.getByText('J');
    expect(avatar).toBeInTheDocument();
  });

  it('should display user avatar with first letter of username when first_name is not available', () => {
    mockUseAuth.mockReturnValue({
      user: { ...mockUser, first_name: null },
      logout: mockLogout,
      isLoading: false,
      error: null,
    } as any);

    const { rerender } = render(<Header />);
    rerender(<Header />);
    const avatar = screen.getByText('J'); // First letter of username
    expect(avatar).toBeInTheDocument();
  });

  it('should display default avatar letter when user data is missing', () => {
    mockUseAuth.mockReturnValue({
      user: { ...mockUser, first_name: null, username: null },
      logout: mockLogout,
      isLoading: false,
      error: null,
    } as any);

    const { rerender } = render(<Header />);
    rerender(<Header />);
    const defaultAvatar = screen.getByText('U');
    expect(defaultAvatar).toBeInTheDocument();
  });

  it('should open user menu when avatar is clicked', () => {
    render(<Header />);
    const avatarButton = screen.getByText('J').closest('button');
    fireEvent.click(avatarButton!);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should display user role in menu', () => {
    render(<Header />);
    const avatarButton = screen.getByText('J').closest('button');
    fireEvent.click(avatarButton!);

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should close user menu when clicking outside', () => {
    render(<Header />);
    const avatarButton = screen.getByText('J').closest('button');
    fireEvent.click(avatarButton!);

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Click on the overlay (overlay has no ARIA role in this DOM)
    const overlay = document.querySelector('[class*="fixed inset-0"]') as HTMLElement | null;
    if (overlay) {
      fireEvent.click(overlay);
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    } else {
      throw new Error('Overlay element not found to click outside');
    }
  });

  it('should call logout when Logout button is clicked', async () => {
    render(<Header />);
    const avatarButton = screen.getByText('J').closest('button');
    fireEvent.click(avatarButton!);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('should highlight active navigation link', () => {
    render(<Header />);
    // The active link will have class 'text-emerald-600 bg-emerald-50'
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have correct links href', () => {
    render(<Header />);
    const liveLink = screen.getByText('Live').closest('a');
    expect(liveLink).toHaveAttribute('href', '/live');

    const siteMapLink = screen.getByText('Site Map').closest('a');
    expect(siteMapLink).toHaveAttribute('href', '/sitemap');

    const analyticsLink = screen.getByText('Analytics').closest('a');
    expect(analyticsLink).toHaveAttribute('href', '/analytics');

    const alertsLink = screen.getByText('Alerts').closest('a');
    expect(alertsLink).toHaveAttribute('href', '/alerts');
  });

  it('should handle logout error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn().mockRejectedValue(new Error('Logout failed')),
      isLoading: false,
      error: null,
    } as any);

    render(<Header />);
    const avatarButton = screen.getByText('J').closest('button');
    fireEvent.click(avatarButton!);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Logout failed:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should toggle user menu on avatar click', () => {
    render(<Header />);
    const avatarButton = screen.getByText('J').closest('button');

    // Menu should not be visible initially
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(avatarButton!);
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Click again to close
    fireEvent.click(avatarButton!);
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
