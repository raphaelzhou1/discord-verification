"use client"

import { SeiWalletProvider } from '@sei-js/react'
import { useRecoilValue } from 'recoil'

import { selectedChainConfigSelector } from '@sparrowswap/recoil'
import { ChainInfo, RequestButton } from '@sparrowswap/components'
import {Box, Container, Stack} from '@mui/material'

const Faucet = () => {
  const selectedChainConfigUrls = useRecoilValue(selectedChainConfigSelector)

  return (
    <SeiWalletProvider chainConfiguration={selectedChainConfigUrls}>
      <Container maxWidth='sm'>
        <div>
          <h1>Ahoy, me seilor! </h1>
          <h2> 🏴‍☠️ At the behest of Captain Autopirate, I&apos;m here to scrutinize yer treasure chest and bestow upon ye the rightful Discord ranks, matey! 🏴‍☠️</h2>
        </div>
        <div>
          <Stack spacing={2}>
            <ChainInfo />
            <RequestButton />
            {/*<AccountInfo />*/}
          </Stack>

        </div>
      </Container>
    </SeiWalletProvider>
  )
}

export default Faucet
