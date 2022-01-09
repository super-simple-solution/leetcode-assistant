import { createApp } from 'vue'

const config = {
  id: '', // app id
  refNode: '', // 
  template: '',
  config: {
    method: {},
  }
}

export default function (config) {
	const div = document.createElement('div')
  const {
    element,
    id
  } = config
	div.id = config.id
	document.body.appendChild(div)
	console.log(div)
	createApp(element).mount(`#${id}`)
}
