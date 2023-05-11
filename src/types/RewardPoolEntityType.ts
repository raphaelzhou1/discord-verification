import { TokenInfo } from './TokenInfo';

export type RewardPoolEntityType = {
  pool_id: string
  incentivized_token: TokenInfo,
  profit_token: TokenInfo,
  profit_token_per_block: number,
  staking_address: string,
  tags?: string[]
}
