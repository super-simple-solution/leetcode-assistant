import { initEventHandler } from '@/utils/extension-action'

const contentReq = {
  'question-save': questionSave,
}

// TODO: 保存至本地
function questionSave(data) {
  console.log('question data', data)
}

initEventHandler(contentReq)
