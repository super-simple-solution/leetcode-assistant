import { initEventHandler } from '@/utils/chrome-action'

let contentReq = {
  'question-save': questionSave,
}

// TODO: 保存至本地
function questionSave() {}

initEventHandler(contentReq)