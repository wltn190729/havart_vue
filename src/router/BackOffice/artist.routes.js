export default [
    {
        path: '/artist',
        name: 'AdminArtistList',
        component: () => import(/* webpackChunkName: "admin.artists" */ '@/views/BackOffice/Artists/ArtistList.vue'),
        meta: {
            theme: 'BackOffice',
            requiredAdmin: false
        }
    }
]