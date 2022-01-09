import axios from 'axios'

axios.defaults.withCredentials = false

var service = axios.create({
  baseURL: `https://leetcode.com/graphql`,
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
