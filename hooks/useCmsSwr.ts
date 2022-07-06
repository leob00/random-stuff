import useSWR from 'swr'

export const useCmsSwr = (url: string, id: string, fetcher: (url: string, arg: string) => Promise<any>, fallbackData: any, intervalSeconds: number) => {
  return useSWR([url, id], (url: string, id: string) => fetcher(url, id), {
    fallbackData: fallbackData,
    refreshInterval: intervalSeconds * 1000,
    revalidateOnFocus: false,
  })
}
