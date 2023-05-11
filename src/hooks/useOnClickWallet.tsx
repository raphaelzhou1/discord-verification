import { useEffect} from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'
import { SeiSigningCosmWasmClient, WalletWindowKey } from '@sei-js/core'
import { WalletStatusType } from '../state/atoms/walletAtoms'
import {
  AminoTypes,
  createIbcAminoConverters,
  GasPrice,
} from '@cosmjs/stargate'
import {
  createWasmAminoConverters,
} from '@cosmjs/cosmwasm-stargate'
import { walletState } from '../state/atoms/walletAtoms'
import { useChainInfo } from './useChainInfo'

export const useOnClickWallet = () => {
  const [{ status, windowKey }, setWalletState] = useRecoilState(walletState)
  const [chainInfo] = useChainInfo()
  const tryKeplrConnectWallet = async () => {
    try {
      console.log("Trying to connect to Keplr")
      await window.keplr.experimentalSuggestChain(chainInfo)
      await window.keplr.enable(chainInfo.chainId)
      const offlineSigner = await window.keplr.getOfflineSignerAuto(chainInfo.chainId)
      const wasmChainClient = await SeiSigningCosmWasmClient.connectWithSigner(
        chainInfo.rpc,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString(GAS_PRICE),
          /*
           * passing ibc amino types for all the amino signers (eg ledger, wallet connect)
           * to enable ibc & wasm transactions
           * */
          aminoTypes: new AminoTypes(
            Object.assign(
              createIbcAminoConverters(),
              createWasmAminoConverters()
            )
          ),
        }
      )

      const [{address}] = await offlineSigner.getAccounts()
      const key = await window.keplr.getKey(chainInfo.chainId)
      /* successfully update the wallet state */
      setWalletState({
        key,
        address,
        windowKey: 'keplr',
        client: wasmChainClient,
        status: WalletStatusType.connected,
      })
    } catch (e) {
      /* set the error state */
      setWalletState({
        key: null,
        windowKey: null,
        address: '',
        client: null,
        status: WalletStatusType.error,
      })

      /* throw the error for the UI */
      throw e
    }
  }

  const tryLeapConnectWallet = async () => {
    try {
      await window.leap.experimentalSuggestChain(chainInfo)
      await window.leap.enable(chainInfo.chainId)
      const offlineSigner = await window.leap.getOfflineSignerAuto(chainInfo.chainId)

      const wasmChainClient = await SeiSigningCosmWasmClient.connectWithSigner(
        chainInfo.rpc,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString(GAS_PRICE),
          aminoTypes: new AminoTypes(
            Object.assign(
              createIbcAminoConverters(),
              createWasmAminoConverters()
            )
          ),
        }
      )


      const [{address}] = await offlineSigner.getAccounts()
      // @ts-ignore
      const key = await window.leap.getKey(chainInfo.chainId)
      /* successfully update the wallet state */
      setWalletState({
        windowKey: 'leap',
        key: key,
        address,
        client: wasmChainClient,
        status: WalletStatusType.connected,
      })
    } catch (e) {
      /* set the error state */
      setWalletState({
        key: null,
        windowKey: null,
        address: '',
        client: null,
        status: WalletStatusType.error,
      })

      /* throw the error for the UI */
      throw e
    }
  }

  const tryCoin98ConnectWallet = async () => {
    try {
      await window.coin98.keplr.experimentalSuggestChain(chainInfo)
      await window.coin98.keplr.enable(chainInfo.chainId)
      const offlineSigner = await window.coin98.keplr.getOfflineSignerAuto(chainInfo.chainId)
      const wasmChainClient = await SeiSigningCosmWasmClient.connectWithSigner(
        chainInfo.rpc,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString(GAS_PRICE),
          /*
           * passing ibc amino types for all the amino signers (eg ledger, wallet connect)
           * to enable ibc & wasm transactions
           * */
          aminoTypes: new AminoTypes(
            Object.assign(
              createIbcAminoConverters(),
              createWasmAminoConverters()
            )
          ),
        }
      )

      const [{address}] = await offlineSigner.getAccounts()
      const key = await window.coin98.keplr.getKey(chainInfo.chainId)
      /* successfully update the wallet state */
      setWalletState({
        key,
        address,
        windowKey: 'coin98',
        client: wasmChainClient,
        status: WalletStatusType.connected,
      })
    } catch (e) {
      /* set the error state */
      setWalletState({
        key: null,
        windowKey: null,
        address: '',
        client: null,
        status: WalletStatusType.error,
      })

      /* throw the error for the UI */
      throw e
    }
  }

  const mutation = useMutation (async (windowKey: WalletWindowKey) => {
    switch ( windowKey ) {
      case 'keplr':
        if (window && !window?.keplr) {
          alert('Please install the Keplr extension and refresh the page.')
          window.open('https://www.keplr.app/download', '_blank');
        } else {
          setWalletState((value) => ({
            ...value,
            windowKey: 'keplr',
            client: null,
            state: WalletStatusType.connecting,
          }))
          await tryKeplrConnectWallet()
        }
        break;
      case 'leap':
        if (window && !window?.leap) {
          alert('Please install the Leap extension and refresh the page.')
          window.open(isMobile ? 'https://www.leapwallet.io/cosmos' : 'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg', '_blank')
        } else {
          setWalletState((value) => ({
            ...value,
            windowKey: 'leap',
            client: null,
            state: WalletStatusType.connecting,
          }))
          await tryLeapConnectWallet()
        }
        break;
      case 'coin98':
        if (window && !window?.coin98) {
          alert('Please install the Coin98 extension and refresh the page.')
          window.open(isMobile ? 'https://coin98.com/wallet' : 'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg', '_blank')
        } else {
          setWalletState((value) => ({
            ...value,
            windowKey: 'coin98',
            client: null,
            state: WalletStatusType.connecting,
          }))
          await tryCoin98ConnectWallet()
        }
        break;
    }
  })

  return mutation
}
