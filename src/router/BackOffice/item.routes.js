export default [
  {
    path: '/item',
    name: 'AdminItemList',
    component: () =>
      import(
        /* webpackChunkName: "admin.items" */ '@/views/BackOffice/Items/ItemList.vue'
      ),
    meta: {
      theme: 'BackOffice',
      requiredAdmin: false,
    },
  },
];
