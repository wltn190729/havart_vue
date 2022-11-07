export default [
    {
        path: '/admin/companies',
        name: 'AdminCompanyList',
        component: () => import(/* webpackChunkName: "admin.companies" */ '@/views/BackOffice/Companies/CompanyList.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: true
        }
    }
]