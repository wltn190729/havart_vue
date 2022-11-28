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
    }
}

export default exportObject