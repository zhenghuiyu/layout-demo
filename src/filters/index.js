export { parseTime, formatTime } from '@/utils'
import moment from 'moment'

/* 时间YYYY-MM-DD HH:mm:ss*/
export function time(val) {
  return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')
}

/* 时间YYYY-MM-DD */
export function timeSearch(val) {
  return moment(val * 1000).format('YYYY-MM-DD')
}

/* 文字超过14个显示省略号 */
export function sliceWord(val) {
  if (val.length > 14) {
    return val.slice(0, 14) + '...'
  } else {
    return val
  }
}

/* 文字超过12个显示省略号 */
export function sliceWord1(val) {
  if (val.length > 12) {
    return val.slice(0, 12) + '...'
  } else {
    return val
  }
}
