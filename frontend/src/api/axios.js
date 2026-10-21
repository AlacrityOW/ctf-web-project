import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL,
    withCredentials: true
});

let memoryToken = null

export const setAccessTokenInMemory = (token)=>{
    memoryToken = token
}

api.interceptors.request.use(
    (config)=>{
        if(memoryToken){
            config.headers['Authorization'] = `Bearer ${memoryToken}`;
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response)=>response,
    async (error)=>{
        const oriReq = error.config
        if (oriReq.url.includes('/api/auth/refresh')) {
            setAccessTokenInMemory(null);
            // Only redirect if we aren't already on the login page
            // if (window.location.pathname !== '/login') {
            //     window.location.href = '/login';
            // }
            const publicPages = ['/', '/login', '/register'];
            const isPublicPage = publicPages.includes(window.location.pathname);
             if (!isPublicPage) {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
        if(error.response?.status === 401 && !oriReq._retry){
            oriReq._retry = true;
            try {
                const response = await api.post(`/api/auth/refresh`,{},{withCredentials:true})
                const {accessToken} = response.data
                setAccessTokenInMemory(accessToken)
                oriReq.headers['Authorization'] = `Bearer ${accessToken}`
                return api(oriReq)
            } catch (refreshError) {
                setAccessTokenInMemory(null)
                // window.location.href = '/login'
                const publicPages = ['/', '/login', '/register'];
                const isPublicPage = publicPages.includes(window.location.pathname);

                if (!isPublicPage) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api;