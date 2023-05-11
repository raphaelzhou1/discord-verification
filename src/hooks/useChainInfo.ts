import { ChainInfo } from '@keplr-wallet/types'
import { useQuery } from 'react-query'

import chainInfo from '../public/chain_info.testnet.json';

const chainInfoQueryKey = '@chain-info'

export const useChainInfo = () => {
  const { data, isLoading } = useQuery<ChainInfo>(
    chainInfoQueryKey,
    async () => {
      return chainInfo;
    },
    {
      onError(e) {
        console.error('Error loading chain info:', e)
      },
    }
  )

  return [data, isLoading] as const
}
