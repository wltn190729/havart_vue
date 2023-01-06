/**
 * 통계 관련 Model
 *
 * @author 장선근
 */

import jwt from "@/plugins/jwt";

const exportObject = {
    getStatics : async(params) => {
        return jwt.axios.get('/admin/statistics/analytics', {
            params
        }).then(res => {
            return res.data
        })
    },
    getUserStatics: async(params) => {
        return jwt.axios.get('/admin/statistics/us', {
            params
        }).then(res => {
            return res.data
        })
    },
    getInquiry: async() => {
        return jwt.axios.get('/admin/statistics/inqu')
            .then(res=> {
                return res.data
            })
    }
}

export default exportObject;