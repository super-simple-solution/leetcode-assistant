import apiMap from '@/api'
let isZH = location.origin.includes('leetcode-cn')

async function useTag(options) {
  let tags = []
  let tagRes = await apiMap.discussTags(options)
  // todo 中文
  if (!tagRes) return
  if (isZH) {
    tags = tagRes.solutionTags.languageTags
  } else {
    tags = tagRes.discussQuestionTopicTags.splice(0, 11)
  }
  const selectedTags = options.selectedTags || []
  return {
    tags: tags.map((item) => {
      return {
        ...item,
        questionId: options.questionId,
        questionName: options.questionName,
        active: selectedTags.length ? selectedTags.includes(item.slug) : false,
      }
    }),
  }
}

export default useTag
