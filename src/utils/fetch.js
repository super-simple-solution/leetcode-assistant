import axios from 'axios'

axios.defaults.withCredentials = false

let service = axios.create({
  baseURL: `${location.origin}/graphql/`,
  timeout: 30000 // 请求超时时间
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
  response => {
    let data = response.data
    return data.data.question
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
