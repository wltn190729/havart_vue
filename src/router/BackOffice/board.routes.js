export default [
    {
        path: '/board',
        name: 'AdminBoardList',
        component: () => import(/* webpackChunkName: "admin.boards" */ '@/views/BackOffice/Boards/BoardList.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: true
        }
    },
    {
        path: '/boardMatch',
        name: 'AdminBoardMatchList',
        component: () => import(/* webpackChunkName: "admin.boards" */ '@/views/BackOffice/Boards/BoardMatchList.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: true
        }
    },

    {
        path: '/board/:key',
        name: 'AdminBoardPosts',
        component: () => import(/* webpackChunkName: "admin.boards" */ '@/views/BackOffice/Boards/BoardPostList.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: true
        }
    }
]