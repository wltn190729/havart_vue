/**
 * 사용자 관련 Model
 *
 * @author 장선근
 */

import vue from 'vue'
import store from '@/store'
import jwt from '@/plugins/jwt'

const exportObject =  {
    GetArtistList: async( params ) =>
    {
        return await jwt.axios
            .get(`/admin/artists`, {params});
    },
    GetArtist: async (params) => {
        return await jwt.axios
            .get('/admin/artists/search', {params});
    },
    GetArtistName: async (params) => {
        return await jwt.axios.get('/admin/admin_users/list', {params})
    },
    /**장르 데이터 가져오기 */
    GetGenres: async  () => {
        return await jwt.axios
            .get('/admin/genres');
    },
    GetThemes: async () => {
        return await jwt.axios
            .get('/admin/themes');
    },
    GetSizes: async () => {
        return await jwt.axios
            .get('/admin/sizes');
    },
    ArtistAdd: async(params) => {
        return await jwt.axios
            .post('/admin/artists', params, {
                headers: {
                    "Content-Type": "multipart/form-data; charset=UTF-8;"
                }
            })
    },
    ArtistDel: async(id) => {
        return await jwt.axios.delete(`admin/artists/${id}`)
    },
    Artistpatch: async(id, data) => {
        return await jwt.axios.patch(`admin/artists/${id}`, 
            data
        )
    }
}

export default exportObject