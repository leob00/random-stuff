import useSWR, { mutate, SWRConfiguration } from 'swr'
export const useSwrHelper = <T>(
  key: string,
  dataFn: () => Promise<T>,
  //options?: { revalidateOnFocus?: boolean; refreshInterval?: number; revalidateOnMount?: boolean },
  options?: SWRConfiguration<any, any, any>,
) => {
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
