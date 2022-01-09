import { $$, getEle } from '@/utils'
export function getListInfo(className, domList, pageType) {
  return $$(className).map((item, index) => {
    let dom = domList[index]
    let itemHref = item.getAttribute('href').split('#')[0]
    let milestoneEle = getEle('.issuable-milestone a', dom)
    let todoEle = getEle('.js-done-todo', dom)
    let milestone = milestoneEle && milestoneEle.textContent.trim()
    let pageText = pageTypeMap[typeOfLink(itemHref)].pageText
    let pageTextPath = pageText === 'tree' ? 'tree' : pageText + 's'
    // TODO: mr link has '-/'
    const issueInfo = itemHref.replace('-/', '').split(`/${pageTextPath}/`)
    return {
      disabled: pageType === 'branch' && !!getEle('.btn-remove.disabled', dom),
      href: itemHref,
      milestone: milestone || '',
      todoId: todoEle ? todoEle.getAttribute('data-href').match(/[0-9]+/)[0] : '',
      iid: issueInfo[1],
      projectPath: issueInfo[0].slice(1),
      title: item.innerText,
      labels: $$('.gl-label-text, .badge', dom).map(item => item.textContent.trim()),
      assignees: [],
      type: typeOfLink(itemHref)
    }
  })
}