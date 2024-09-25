import useSWR, { mutate } from 'swr'
export const useSwrHelper = <T>(key: string, dataFn: () => Promise<T>, options?: { revalidateOnFocus?: boolean; refreshInterval?: number }) => {
  const fetcherFunction = async (_url: string, _key: string) => {
    return dataFn()
  }
  const { data, isLoading, isValidating, error } = useSWR(key, ([url, key]) => fetcherFunction(url, key), options)
  const loading = isLoading || isValidating

  return {
    isLoading: loading,
    data,
    mutate,
    error,
  }
}
