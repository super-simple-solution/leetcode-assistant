import axios from 'axios'

axios.defaults.withCredentials = false

const service = axios.create({
  baseURL: `${location.origin}/graphql/`,
  timeout: 30000, // 请求超时时间
})

// service.interceptors.request.use(
//   config => {
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

service.interceptors.response.use(
  (response) => {
    const data = response.data
    return data.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
