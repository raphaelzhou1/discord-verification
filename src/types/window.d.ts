import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types'

declare global {
  // eslint-disable-next-line
  interface Window extends KeplrWindow {
    coin98?: {
      keplr: Keplr
    }
  }
}
