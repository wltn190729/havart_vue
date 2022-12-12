export default [
    {
        path: '/users',
        name: 'AdminUserList',
        component: () => import(/* webpackChunkName: "admin.users" */ '@/views/BackOffice/Users/UsersList.vue'),
        meta: {
            theme: 'BackOffice',
            //관리자권한 설정
            requiredAdmin: true
        },
    },
    {
        path: '/administrator',
        name: 'AdminAdministratorList',
        component: () => import(/* webpackChunkName: "admin.users" */ '@/views/BackOffice/Users/UserAdministratorList.vue'),
        meta: {
            theme: 'BackOffice',
            //관리자권한 설정
            requiredAdmin: true,
        },
    },
    {
        path: '/sign-in',
        name: 'UserSignIn',
        component: () => import(/* webpackChunkName: "users.sign-in" */ '@/views/BackOffice/Users/SignIn.vue')
    },
    {
        path: '/sign-up',
        name: 'UserSignUp',
        component: () => import(/* webpackChunkName: "users.sign-up" */ '@/views/BackOffice/Users/SignUp.vue') 
    }
]