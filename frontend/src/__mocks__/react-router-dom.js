const mockNavigate = jest.fn();
const mockLocation = { pathname: '/', search: '', hash: '', state: null };

module.exports = {
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ element }) => element || null,
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  Link: ({ children, to, ...props }) => {
    return React.createElement('a', { href: to, ...props }, children);
  },
  Navigate: ({ to, replace }) => null,
  Outlet: () => null,
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
  createBrowserRouter: jest.fn(),
  RouterProvider: ({ children }) => children,
  __esModule: true,
};