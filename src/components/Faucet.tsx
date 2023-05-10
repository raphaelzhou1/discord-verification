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
          <h1>USDC Faucet</h1>
          <p>Receive 100 USDC on Sei&rsquo;s <Box component='span' sx={{ fontFamily: 'Monospace' }}>atlantic-2</Box> testnet.</p>
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
