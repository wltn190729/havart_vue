import jwt from '@/plugins/jwt'

export default {
    //어드민 정보 수정
    async GetBoardList (email, payload) {
        return await jwt
            .axios
            .patch(`/admin/admin_users/modify/${email}`, payload)
    },
    async AddAdmin (payload) {
        return await jwt
            .axios
            .post(`/admin/admin_users/sign_up`, payload)
    },
    
}