// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  AccountData,
  Coin,
  coin,
  DirectSecp256k1HdWallet,
  EncodeObject
} from '@cosmjs/proto-signing'
import { getSigningCosmWasmClient } from '@sei-js/core'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { calculateFee, GasPrice, isDeliverTxFailure } from '@cosmjs/stargate'

type Data = {
  status: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {


  try {
    if (process.env.NEXT_PUBLIC_ENABLED !== 'true') {
      throw new Error('Faucet is not available at the moment. Please swap for USDC on SparrowSwap. https://sparrowswap.xyz/')
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      throw new Error('Set the RECAPTCHA_SECRET_KEY environment variable')
    }

    if (typeof req.query.dest !== 'string' || typeof req.query.token !== 'string') {
      return res.status(422).json({
        status: 'Cannot process request. Please provide the required fields'
      });
    }
    const { dest, token } = req.query

    // Ping the google recaptcha verify API to verify the captcha code you received
    const catpchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        method: "POST",
      }
    );
    const captchaValidation = await catpchaResponse.json();
    /**
     * The structure of response from the veirfy API is
     * {
     *  "success": true|false,
     *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
     *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
     *  "error-codes": [...]        // optional
        }
     */
    if (!captchaValidation.success) {
      return res.status(422).json({
        status: "Unproccesable request. Invalid captcha.",
      });
    }

    const { account, client, gasPrice } = await newWallet()
    const toSend = faucetCoin()
    await client.sendTokens(account.address, dest, [toSend], calculateFee(200000, gasPrice))
    res.status(200).json({status: "success"})
  } catch (e: any) {
    console.error(e)
    res.status(500).json({status: "error"})
  }

}

export interface Wallet {
  account: AccountData
  chainId: string
  client: SigningCosmWasmClient
  gasPrice: GasPrice
}

function faucetCoin(): Coin {
  if (!process.env.NEXT_PUBLIC_DENOM) {
    throw new Error('Set the NEXT_PUBLIC_DENOM env variable to the token to use')
  }

  if (!process.env.AMOUNT) {
    throw new Error('Set the AMOUNT env variable to the amount to use')
  }

  return coin(process.env.AMOUNT, process.env.NEXT_PUBLIC_DENOM)
}

const getRandomElement = (arr: any[]) =>
  arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined
async function newWallet(): Promise<Wallet> {
  if (!process.env.MNEMONIC) {
    throw new Error('Set the MNEMONIC env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC2) {
    throw new Error('Set the MNEMONIC2 env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC3) {
    throw new Error('Set the MNEMONIC3 env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC4) {
    throw new Error('Set the MNEMONIC4 env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC5) {
    throw new Error('Set the MNEMONIC5 env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC6) {
    throw new Error('Set the MNEMONIC6 env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC7) {
    throw new Error('Set the MNEMONIC7 env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC8) {
    throw new Error('Set the MNEMONIC8 env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC9) {
    throw new Error('Set the MNEMONIC9 env variable to the mnemonic of the wallet to use')
  }

  if (!process.env.MNEMONIC10) {
    throw new Error('Set the MNEMONIC10 env variable to the mnemonic of the wallet to use')
  }

  const mnemonic = getRandomElement([
    process.env.MNEMONIC,
    process.env.MNEMONIC2,
    process.env.MNEMONIC3,
    process.env.MNEMONIC4,
    process.env.MNEMONIC5,
    process.env.MNEMONIC6,
    process.env.MNEMONIC7,
    process.env.MNEMONIC8,
    process.env.MNEMONIC9,
    process.env.MNEMONIC10
  ])

  if (!process.env.GAS_PRICE) {
    throw new Error('Set the GAS_PRICE env variable to the gas price to use when creating client')
  }

  if (!process.env.RPC_URL) {
    throw new Error('Set the RPC_URL env variable to the RPC URL of the node to use')
  }

  const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: 'sei'
  })

  const accounts = await signer.getAccounts()
  if (accounts.length === 0) {
    throw new Error('No accounts found in wallet')
  }

  if (accounts.length > 1) {
    throw new Error('Multiple accounts found in wallet. Not sure which to use')
  }

  const account = accounts[0]
  const gasPrice = GasPrice.fromString(process.env.GAS_PRICE)

  const client = await getSigningCosmWasmClient(process.env.RPC_URL, signer, {
    gasPrice: gasPrice
  })
  const chainId = await client.getChainId()

  if (chainId !== process.env.CHAIN_ID) {
    throw new Error(`Chain ID mismatch. Expected ${process.env.CHAIN_ID}, got ${chainId}`)
  }

  return { account, chainId, client, gasPrice }
}
