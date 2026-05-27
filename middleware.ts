export { auth as middleware } from '@/lib/auth';

export const config = {
    matcher: ['/order', '/orders', '/api/orders/:path*'],
};
