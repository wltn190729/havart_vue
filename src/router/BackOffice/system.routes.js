export default [
    {
        path: '/admin/system/basecode',
        name: 'AdminBaseCodeList',
        component: () => import(/* webpackChunkName: "admin.system.basecodes" */ '@/views/BackOffice/System/BaseCode.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: true
        }
    }
]