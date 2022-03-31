import apiMap from '@/api'

async function useTag(options) {
  let tags = []
  let tagRes = await apiMap.discussTags(options)
  // todo 中文
  if (!tagRes) return
  tags = tagRes.discussQuestionTopicTags.splice(0, 11)
  const selectedTags = options.selectedTags || []
  return {
    tags: tags.map((item) => {
      return {
        ...item,
        questionId: options.questionId,
        active: selectedTags.length ? selectedTags.includes(item.slug) : false,
      }
    }),
  }
}

export default useTag
