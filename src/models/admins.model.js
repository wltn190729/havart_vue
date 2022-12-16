import jwt from '@/plugins/jwt'

export default {
    //어드민 정보 수정
    async GetBoardList (email, payload) {
        return await jwt
            .axios
            .patch(`/admin/admin_users/modify/${email}`, payload)
    },

    
}