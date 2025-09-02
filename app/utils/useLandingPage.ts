async function useLandingPage() {
  return useAsyncData(
    'landing',
    () => queryCollection('landing').first()
  )
}

export default createGlobalState(useLandingPage)
