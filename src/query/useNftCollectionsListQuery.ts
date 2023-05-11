import { useQuery } from 'react-query'

import { NftCollectionEntityType } from '../types/NftCollectionEntityType'
import nftInfo from '../public/nft_list.testnet.json';

type NFTCollectionsListQueryResponse = {
  collections: Array<NftCollectionEntityType>
  collectionsById: Record<string, NftCollectionEntityType>
  name: string
}

export const useNftCollectionsListQuery = (options?: Parameters<typeof useQuery>[1]) => {
  return useQuery<NFTCollectionsListQueryResponse>(
    '@nft-collection-list',
    async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_NFT_LIST_URL)
      const nftList = await response.json()

      return {
        ...nftList,
        collectionsById: nftList.collections.reduce(
          (collectionsById, collection) => ((collectionsById[collection.id] = collection), collectionsById),
          {}
        ),
      }
    },
    Object.assign(
      {
        refetchOnMount: false,
      },
      options || {}
    )
  )
}
