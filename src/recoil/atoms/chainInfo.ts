import { atom } from 'recoil'
import { ChainConfig } from '@sparrowswap/types/ChainConfig'

export const selectedChainConfigAtom = atom<ChainConfig>({
  key: 'selectedChainConfig',
  default: 'atlantic-2'
})

export const customChainIdAtom = atom<string>({
  key: 'customChainId',
  default: ''
});

export const customRestUrlAtom = atom<string>({
  key: 'customRestUrl',
  default: ''
});

export const customRpcUrlAtom = atom<string>({
  key: 'customRpcUrl',
  default: ''
});
