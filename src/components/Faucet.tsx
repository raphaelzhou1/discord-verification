"use client"

import { SeiWalletProvider } from '@sei-js/react'
import { useRecoilValue } from 'recoil'

import { selectedChainConfigSelector } from '@sparrowswap/recoil'
import { AccountInfo, ChainInfo, RequestButton } from '@sparrowswap/components'
import {Box, Container, Stack} from '@mui/material'

const Faucet = () => {
  const selectedChainConfigUrls = useRecoilValue(selectedChainConfigSelector)

  return (
    <SeiWalletProvider chainConfiguration={selectedChainConfigUrls}>
      <Container maxWidth='sm'>
        <div>
          <h1>Ahoy, me seilor! </h1>
          <h2>Upon Captain Autopirate's request, I'm here to verify yer wallet to proffer Discord roles</h2>
        </div>
        <div>
          <Stack spacing={2}>
            <ChainInfo />
            <RequestButton />
            <AccountInfo />
          </Stack>

        </div>
      </Container>
    </SeiWalletProvider>
  )
}

export default Faucet
