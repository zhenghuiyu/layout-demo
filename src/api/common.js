import request from '@/utils/request'

// 测试
export function test(data) {
  return request({
    url: '/test',
    method: 'get',
    params: data
  })
}
