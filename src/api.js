import service from '@/utils/fetch'

const config = {
  headers: {
    'content-type': 'application/json',
  },
}

const lang = location.origin.includes('leetcode-cn') ? 'zh' : 'en'

const bodyGene = {
  zh: {
    desc: (options) => {
      const { questionName } = options
      return {
        operationName: 'questionData',
        variables: { titleSlug: questionName },
        query:
          'query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    categoryTitle\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    langToValidPlayground\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    envInfo\n    book {\n      id\n      bookName\n      pressName\n      source\n      shortDescription\n      fullDescription\n      bookImgUrl\n      pressImgUrl\n      productUrl\n      __typename\n    }\n    isSubscribed\n    isDailyQuestion\n    dailyRecordStatus\n    editorType\n    ugcQuestionId\n    style\n    exampleTestcases\n    __typename\n  }\n}\n',
      }
    },
    solution: (options) => {
      const { questionName } = options
      return {
        operationName: 'QuestionNote',
        query:
          'query QuestionNote($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    article\n    solution {\n      id\n      content\n      contentTypeId\n      canSeeDetail\n      paidOnly\n      hasVideoSolution\n      paidOnlyVideo\n      rating {\n        id\n        count\n        average\n        userRating {\n          score\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        variables: { titleSlug: questionName },
      }
    },
    zhDiscussList: (options) => {
      const { questionName, skip = 0, tagSlugs = [] } = options
      return {
        operationName: 'questionSolutionArticles',
        query:
          'query questionSolutionArticles($questionSlug: String!, $skip: Int, $first: Int, $orderBy: SolutionArticleOrderBy, $userInput: String, $tagSlugs: [String!]) {\n  questionSolutionArticles(questionSlug: $questionSlug, skip: $skip, first: $first, orderBy: $orderBy, userInput: $userInput, tagSlugs: $tagSlugs) {\n    totalNum\n    edges {\n      node {\n        ...solutionArticle\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment solutionArticle on SolutionArticleNode {\n  rewardEnabled\n  canEditReward\n  uuid\n  title\n  slug\n  sunk\n  chargeType\n  status\n  identifier\n  canEdit\n  canSee\n  reactionType\n  reactionsV2 {\n    count\n    reactionType\n    __typename\n  }\n  tags {\n    name\n    nameTranslated\n    slug\n    tagType\n    __typename\n  }\n  createdAt\n  thumbnail\n  author {\n    username\n    profile {\n      userAvatar\n      userSlug\n      realName\n      __typename\n    }\n    __typename\n  }\n  summary\n  topic {\n    id\n    commentCount\n    viewCount\n    __typename\n  }\n  byLeetcode\n  isMyFavorite\n  isMostPopular\n  isEditorsPick\n  hitCount\n  videosInfo {\n    videoId\n    coverUrl\n    duration\n    __typename\n  }\n  __typename\n}\n',
        variables: { questionSlug: questionName, first: 10, skip, orderBy: 'DEFAULT', tagSlugs },
      }
    },
    curSolutionResolve: (options) => {
      const { slug } = options
      return {
        operationName: 'solutionDetailArticle',
        query:
          'query solutionDetailArticle($slug: String!, $orderBy: SolutionArticleOrderBy!) {\n  solutionArticle(slug: $slug, orderBy: $orderBy) {\n    ...solutionArticle\n    content\n    question {\n      questionTitleSlug\n      __typename\n    }\n    position\n    next {\n      slug\n      title\n      __typename\n    }\n    prev {\n      slug\n      title\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment solutionArticle on SolutionArticleNode {\n  rewardEnabled\n  canEditReward\n  uuid\n  title\n  slug\n  sunk\n  chargeType\n  status\n  identifier\n  canEdit\n  canSee\n  reactionType\n  reactionsV2 {\n    count\n    reactionType\n    __typename\n  }\n  tags {\n    name\n    nameTranslated\n    slug\n    tagType\n    __typename\n  }\n  createdAt\n  thumbnail\n  author {\n    username\n    profile {\n      userAvatar\n      userSlug\n      realName\n      __typename\n    }\n    __typename\n  }\n  summary\n  topic {\n    id\n    commentCount\n    viewCount\n    __typename\n  }\n  byLeetcode\n  isMyFavorite\n  isMostPopular\n  isEditorsPick\n  hitCount\n  videosInfo {\n    videoId\n    coverUrl\n    duration\n    __typename\n  }\n  __typename\n}\n',
        variables: { slug: slug, orderBy: 'DEFAULT' },
      }
    },
    discussTags: (options) => {
      const { questionName } = options
      return {
        operationName: 'solutionTags',
        variables: { questionSlug: questionName },
        query:
          'query solutionTags($questionSlug: String!) {\n  solutionTags(questionSlug: $questionSlug) {\n    allTags {\n      name\n      nameTranslated\n      slug\n      __typename\n    }\n    languageTags {\n      name\n      nameTranslated\n      slug\n      __typename\n    }\n    otherTags {\n      name\n      nameTranslated\n      slug\n      __typename\n    }\n    __typename\n  }\n}\n',
      }
    },
  },
  en: {
    desc: (options) => {
      const { questionName } = options
      return {
        operationName: 'questionData',
        query:
          'query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    exampleTestcases\n    categoryTitle\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      paidOnly\n      hasVideoSolution\n      paidOnlyVideo\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    enableTestMode\n    enableDebugger\n    envInfo\n    libraryUrl\n    adminUrl\n    challengeQuestion {\n      id\n      date\n      incompleteChallengeCount\n      streakCount\n      type\n      __typename\n    }\n    __typename\n  }\n}\n',
        variables: { titleSlug: questionName },
      }
    },
    solution: (options) => {
      const { questionName } = options
      return {
        operationName: 'QuestionNote',
        query:
          'query QuestionNote($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    article\n    solution {\n      id\n      content\n      contentTypeId\n      canSeeDetail\n      paidOnly\n      hasVideoSolution\n      paidOnlyVideo\n      rating {\n        id\n        count\n        average\n        userRating {\n          score\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        variables: { titleSlug: questionName },
      }
    },
    getTags: (options) => {
      const { questionId, selectedTags = [] } = options
      return {
        operationName: 'discussQuestionTopicTags',
        query:
          'query discussQuestionTopicTags($tagType: String, $questionId: String!, $selectedTags: [String!]) {\n  discussQuestionTopicTags(tagType: $tagType, questionId: $questionId, selectedTags: $selectedTags) {\n    ...TopicTag\n    __typename\n  }\n}\n\nfragment TopicTag on DiscussTopicTagNode {\n  id\n  name\n  slug\n  numTopics\n  __typename\n}\n',
        variables: {
          questionId,
          selectedTags,
        },
      }
    },
    enDiscussList: (options) => {
      const { questionId, skip = 0, tags = [] } = options
      return {
        operationName: 'questionTopicsList',
        query:
          'query questionTopicsList($questionId: String!, $orderBy: TopicSortingOption, $skip: Int, $query: String, $first: Int!, $tags: [String!]) {\n  questionTopicsList(questionId: $questionId, orderBy: $orderBy, skip: $skip, query: $query, first: $first, tags: $tags) {\n    ...TopicsList\n    __typename\n  }\n}\n\nfragment TopicsList on TopicConnection {\n  totalNum\n  edges {\n    node {\n      id\n      title\n      commentCount\n      viewCount\n      pinned\n      tags {\n        name\n        slug\n        __typename\n      }\n      post {\n        id\n        voteCount\n        creationDate\n        isHidden\n        author {\n          username\n          isActive\n          nameColor\n          activeBadge {\n            displayName\n            icon\n            __typename\n          }\n          profile {\n            userAvatar\n            __typename\n          }\n          __typename\n        }\n        status\n        coinRewards {\n          ...CoinReward\n          __typename\n        }\n        __typename\n      }\n      lastComment {\n        id\n        post {\n          id\n          author {\n            isActive\n            username\n            __typename\n          }\n          peek\n          creationDate\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    cursor\n    __typename\n  }\n  __typename\n}\n\nfragment CoinReward on ScoreNode {\n  id\n  score\n  description\n  date\n  __typename\n}\n',
        variables: { orderBy: 'most_votes', query: '', skip, first: 15, tags, questionId: questionId },
      }
    },
    curDiscussResolve: (options) => {
      const { topicId } = options
      return {
        operationName: 'DiscussTopic',
        query:
          'query DiscussTopic($topicId: Int!) {\n  topic(id: $topicId) {\n    id\n    viewCount\n    topLevelCommentCount\n    subscribed\n    title\n    pinned\n    tags\n    hideFromTrending\n    post {\n      ...DiscussPost\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment DiscussPost on PostNode {\n  id\n  voteCount\n  voteStatus\n  content\n  updationDate\n  creationDate\n  status\n  isHidden\n  coinRewards {\n    ...CoinReward\n    __typename\n  }\n  author {\n    isDiscussAdmin\n    isDiscussStaff\n    username\n    nameColor\n    activeBadge {\n      displayName\n      icon\n      __typename\n    }\n    profile {\n      userAvatar\n      reputation\n      __typename\n    }\n    isActive\n    __typename\n  }\n  authorIsModerator\n  isOwnPost\n  __typename\n}\n\nfragment CoinReward on ScoreNode {\n  id\n  score\n  description\n  date\n  __typename\n}\n',
        variables: { topicId: topicId },
      }
    },
    discussTags: (options) => {
      const { questionId, selectedTags = [] } = options
      return {
        operationName: 'discussQuestionTopicTags',
        query:
          'query discussQuestionTopicTags($tagType: String, $questionId: String!, $selectedTags: [String!]) {\n  discussQuestionTopicTags(tagType: $tagType, questionId: $questionId, selectedTags: $selectedTags) {\n    ...TopicTag\n    __typename\n  }\n}\n\nfragment TopicTag on DiscussTopicTagNode {\n  id\n  name\n  slug\n  numTopics\n  __typename\n}\n',
        variables: { selectedTags, questionId },
      }
    },
  },
}

const apiMap = {}
for (const key in bodyGene[lang]) {
  apiMap[key] = (options) => service.post('', bodyGene[lang][key](options), config)
}

export default apiMap
