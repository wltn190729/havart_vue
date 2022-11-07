import jwt from '@/plugins/jwt'

export default {
    async GetBaseCodeList ( type ) {
        return await jwt
            .axios
            .get(`/v1/basecode/${type}`)
    },

    async DeleteBaseCode (type, id) {
        return await jwt.axios.delete(`/v1/basecode/${type}/${id}`)
    }
}