import axios from 'axios'

// 将客户端请求代理到 node.js
const instance = axios.create({
  baseURL: 'http://localhost'
})

export default instance
