import { ref } from 'vue'
function useCurSolutionResolve(index, api) {
  let spining = ref(false)
  return  {
    spining: spining.value
  }
}


export default useCurSolutionResolve