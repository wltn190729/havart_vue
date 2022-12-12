export default [
    {
        path: '/access',
        name: 'AdminAccessList',
        component: () => import(/* webpackChunkName: "admin.boards" */ '@/views/BackOffice/Access/AccessList.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: true
        }
    },
]