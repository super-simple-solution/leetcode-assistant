import apiMap from '@/api'
let isZH = location.origin.includes('leetcode-cn')

async function useTag(options) {
  let tags = []
  let tagRes = await apiMap.discussTags(options)
  if (!tagRes) return
  if (isZH) {
    tags = tagRes.solutionTags.languageTags
  } else {
    tags = tagRes.discussQuestionTopicTags.splice(0, 11)
  }
  return {
    tags: tags.map((item) => {
      return {
        ...item,
        questionId: options.questionId,
        questionName: options.questionName,
      }
    }),
  }
}

export default useTag
