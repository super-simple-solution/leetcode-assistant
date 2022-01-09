import service from '@/utils/fetch'

const config = {
  headers: {
    'content-type': 'application/json',
  },
}

const bodyGene = {
  desc: (options) => {
    const {
      questionName
    } = options
    return `{\"operationName\":\"questionData\",\"variables\":{\"titleSlug\":\"${questionName}\"},\"query\":\"query questionData($titleSlug: String!) {\\n  question(titleSlug: $titleSlug) {\\n    questionId\\n    questionFrontendId\\n    boundTopicId\\n    title\\n    titleSlug\\n    content\\n    translatedTitle\\n    translatedContent\\n    isPaidOnly\\n    difficulty\\n    likes\\n    dislikes\\n    isLiked\\n    similarQuestions\\n    exampleTestcases\\n    contributors {\\n      username\\n      profileUrl\\n      avatarUrl\\n      __typename\\n    }\\n    topicTags {\\n      name\\n      slug\\n      translatedName\\n      __typename\\n    }\\n    companyTagStats\\n    codeSnippets {\\n      lang\\n      langSlug\\n      code\\n      __typename\\n    }\\n    stats\\n    hints\\n    solution {\\n      id\\n      canSeeDetail\\n      paidOnly\\n      hasVideoSolution\\n      paidOnlyVideo\\n      __typename\\n    }\\n    status\\n    sampleTestCase\\n    metaData\\n    judgerAvailable\\n    judgeType\\n    mysqlSchemas\\n    enableRunCode\\n    enableTestMode\\n    enableDebugger\\n    envInfo\\n    libraryUrl\\n    adminUrl\\n    challengeQuestion {\\n      id\\n      date\\n      incompleteChallengeCount\\n      streakCount\\n      type\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`
  },
  solution: (options) => {
    const {
      questionName
    } = options
    return `{\"operationName\":\"QuestionNote\",\"variables\":{\"titleSlug\":\"${questionName}\"},\"query\":\"query QuestionNote($titleSlug: String!) {\\n  question(titleSlug: $titleSlug) {\\n    questionId\\n    article\\n    solution {\\n      id\\n      content\\n      contentTypeId\\n      canSeeDetail\\n      paidOnly\\n      hasVideoSolution\\n      paidOnlyVideo\\n      rating {\\n        id\\n        count\\n        average\\n        userRating {\\n          score\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`
  }
}

let apiMap = {}
for (let key in bodyGene) {
  apiMap[key] = (options) => service.post('', bodyGene[key](options), config)
}

export default apiMap