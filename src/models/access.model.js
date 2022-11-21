import jwt from '@/plugins/jwt'

export default {
    async GetAccessList() {
        return await jwt
            .axios
            .get(`/admin/auth/auth_access_list`);
    },

    async GetAccessListDef() {
        return await jwt
            .axios
            .get(`/admin/auth/auth_def`);
    }
};
