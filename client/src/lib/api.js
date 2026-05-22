import axios from 'axios';

let isRefreshing = false;
let refreshSubscribers = [];
let _navigate = null;

// Called once from App so the interceptor can use React Router navigation
// instead of a hard page reload (which causes flickering).
export const injectNavigate = (navigate) => {
  _navigate = navigate;
};

const redirectToLogin = () => {
  if (window.location.pathname.startsWith('/auth')) return;
  if (_navigate) {
    _navigate('/auth/login', { replace: true });
  } else {
    window.location.href = '/auth/login';
  }
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Routes that should never trigger a silent refresh attempt
const AUTH_URLS = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/me'];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthRoute = AUTH_URLS.some((u) => original.url?.includes(u));

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => {
            original._retry = true;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        isRefreshing = false;
        onRefreshed();
        return api(original);
      } catch (refreshErr) {
        isRefreshing = false;
        refreshSubscribers = [];
        redirectToLogin();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
