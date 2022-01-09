import { createApp } from 'vue'
import '@/style/index.css'
import { getEle, getAttrs } from '@/utils'
import apiMap from '@/api'
import { Drawer } from 'ant-design-vue'

export default function (dom) {
  let container = getEle(dom)
  if (!container) return
  let list = Array.from(container.children).map(item => {
    let link = getEle('.truncate a', item)
    return {
      dom: item.outerHTML,
      attrs: getAttrs(item),
      tag: item.tagName,
      data: {
        desc: '',
        solution: ''
      },
      info: {
        questionName: link.href.match(/problems\/([^?/]+)/)[1],
        questionFullName: link.textContent,
        questionId: '',
      }
    }
  })

  console.log(list.length, 'list')
  const app = createApp({})
  app.component('app', {
    data() {
      return {
        curIndex: null,
        descVisible: false,
        solutionVisible: false,
      }
    },
    mounted() {
      console.log(this.list.length, 'list length')
    },
    computed: {
      curItem() {
        return this.list[this.curIndex] || {}
      },
      curDesc() {
        return this.curItem.data?.desc
      },
      curSolution() {
        return this.curItem.data?.solution
      },
      curQuestionName() {
        return this.curItem.info?.questionFullName
      }
    },
    template: `
      <div>
        <div class="relative" v-for="(item, index) in list" :key="index">
          <component :is="item.tag"  v-bind="item.attrs" v-html="item.dom"></component>
          <a-button type="primary" size="small" class="absolute top-0 right-0" @click="showDrawer(item, index)">描述</a-button>
        </div>
        <a-drawer
          :title="list[curIndex || 0].info.questionFullName"
          placement="left"
          :closable="false"
          :visible="visible"
          width="800"
          @close="onClose"
        >
          <a-button type="primary" size="small" @click="showSolution">查看题解</a-button>
          <p v-html="curDesc"></p>
          <a-drawer
            v-model:visible="solutionVisible"
            title="题解"
            width="600"
            :closable="false"
          >
            <p v-html="curSolution"></p>
          </a-drawer>
        </a-drawer>
      </div>
    `,
    methods: {
      showDrawer(index) {
        this.curIndex = index
        let item = this.list[index]
        if (item.data.desc) {
          this.descVisible = true
        } else {
          apiMap.desc({
            questionName: item.info.questionName
          }).then(res => {
            item.data.desc = res.content
            item.info.questionId = res.questionId
            this.descVisible = true
          })
        }
      },
      showSolution() {
        let index = this.curIndex
        let item = this.list[index]
        if (item.data.solution) {
          this.solutionVisible = true
        } else {
          apiMap.solution({
            questionName: item.info.questionName
          }).then(res => {
            console.log(res, 'res')
            item.data.desc = res.content
            item.info.questionId = res.questionId
            this.solutionVisible = true
          })
        }
      },
      onClose() {
        this.visible = false
      }
    }
  })
  app.mount(dom)
}