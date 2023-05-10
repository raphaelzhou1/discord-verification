import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'

const Faucet = dynamic(
  () => import('@sparrowswap/components/Faucet'),
  { ssr: false }
)

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>USDC Faucet</title>
        <meta name="description" content="USDC Faucet for Sei atlantic-2" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Faucet />

      </main>
    </>
  )
}
