export default [
    {
        path: '/admin/board',
        name: 'AdminBoardList',
        component: () => import(/* webpackChunkName: "admin.boards" */ '@/views/BackOffice/Boards/BoardList.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: false
        }
    },
    {
        path: '/admin/board/:key',
        name: 'AdminBoardPosts',
        component: () => import(/* webpackChunkName: "admin.boards" */ '@/views/BackOffice/Boards/BoardPostList.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: true
        }
    }
]