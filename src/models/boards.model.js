import jwt from '@/plugins/jwt'

export default {
    //문의 관리페이지_ 전체 문의 목록 불러오기
    async GetBoardList () {
        return await jwt
            .axios
            .get(`admin/inquiry`)
    },

    async PostBoardInfo (formData, key) {

        const url = '/v1/board' + ( key && key.length > 0 ? `/${key}`:'' )
        return await jwt.axios.post(url, formData)
    },

    //문의 관리페이지_유저 문의 목록
    async GetUserBoardList(uid) {
        return await jwt
            .axios
            .get(`/auth/inquiry/${uid}`);
    },

    async ChangeInquiryStatus(id, formData) {
        return await jwt
            .axios
            .patch(`/admin/inquiry/${id}`, formData);
    },

    async CreateInquiry(formData) {
        return await jwt
            .axios
            .post(`/admin/inquiry/`, formData);
    },

    async GetInquirySearchList (key) {
        return await jwt
            .axios
            .get(`/admin/inquiry/2/${key}`)
    },

    async UpdateComment(formData) {
        return await jwt
            .axios
            .patch(`/admin/inquiry/`, formData);
    },

    async DeleteComment(id) {
        return await jwt
            .axios
            .delete(`/admin/inquiry/${id}`);
    },


}