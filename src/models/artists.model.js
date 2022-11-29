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
            .get(`/admin/artists`, params);
    },
    GetArtist: async (params) => {
        return await jwt.axios
            .get('/admin/artists/search', {params});
    },
    GetGenres: async  () => {
        return await jwt.axios
            .get('/admin/genres');
    },
    ArtistAdd: async(params) => {
        return await jwt.axios
            .post('/admin/artists', params)
    },
    ArtistDel: async(id) => {
        return await jwt.axios.delete(`admin/artists/${id}`)
    }
}

export default exportObject