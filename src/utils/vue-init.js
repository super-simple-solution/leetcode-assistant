import { createApp } from 'vue'

export default function (config) {
  const div = document.createElement('div')
  const { element, id } = config
  div.id = config.id
  document.body.appendChild(div)
  createApp(element).mount(`#${id}`)
}
