import AdminUsersRoutes from './users.routes'
import AdminCompanyRoutes from './companies.routes'
import AdminSystemRoutes from './system.routes'
import AdminBoardRoutes from './board.routes'
import AdminItemList from './item.routes'
import AdminArtistRoutes from './artist.routes';

export default [
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: () => import(/* webpackChunkName: "admin.dashboard" */ '@/views/BackOffice/DashboardView.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: true
        }
    },
    ...AdminUsersRoutes,
    ...AdminCompanyRoutes,
    ...AdminSystemRoutes,
    ...AdminBoardRoutes,
    ...AdminItemList,
    ...AdminArtistRoutes
];