import { TokenInfo } from './TokenInfo'

export type AssetInfo = {
  'token': {
    'contract_addr': string
  }
} | {
  'native_token': {
    'denom': string
  }
}

export function toAssetInfo(tokenInfo: TokenInfo): AssetInfo {
  if (tokenInfo.native) {
    return {
      native_token: {
        denom: tokenInfo.denom,
      },
    }
  }
  return {
    token: {
      contract_addr: tokenInfo.token_address,
    },
  }
}
