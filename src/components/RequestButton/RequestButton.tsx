import { useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useWallet } from '@sei-js/react'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  Button,
  CircularProgress,
  Stack
} from '@mui/material'
import { useMutation } from 'react-query'
import { AccountData } from '@cosmjs/proto-signing'
import axios from 'axios'
import { useRefetchQueries } from "@sparrowswap/hooks/useRefetchQueries";

type RequestFaucetArgs = {
  account: AccountData
  token: string
}

const sleep = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs))

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const RequestButton = () => {
	const { accounts } = useWallet();
	const walletAccount = useMemo(() => accounts?.[0], [accounts]);
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const refetchBalances = useRefetchQueries(['balances'], 1500)

  const { mutate: requestFaucet, isLoading } = useMutation(
    async (args: RequestFaucetArgs) => {
      if (process.env.NEXT_PUBLIC_ENABLED !== 'true') {
        throw new Error('Faucet is not available at the moment. Please swap for USDC on SparrowSwap. https://sparrowswap.xyz/')
      }

      await sleep(10000 + getRandomInt(30000))
      const { data: response } = await axios.get('/api/faucet', {params: {
          dest: args.account.address,
          token: args.token
      }})
      console.log(response.data)
    },
    {
      onSuccess: () => {
        console.log('success')
        toast.success('Faucet request successful!')
      },
      onError: (error) => {
        console.log(error)
        toast.error((error as any)?.message ?? error?.toString())
      },
      onSettled: () => {
        recaptchaRef.current?.reset()
        setRecaptchaToken(null)
        refetchBalances()
      }
    }
  )

  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY env variable')
  }

	return (
    <Stack spacing={2}>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        size='normal'
        onChange={setRecaptchaToken}
        ref={recaptchaRef}
      />
      <Button
        disabled={isLoading || !walletAccount || !recaptchaToken}
        color='primary'
        variant='contained'
        size='large'
        startIcon = {
          isLoading ? <CircularProgress color="inherit" size={25} /> : null
        }
        onClick={() => requestFaucet({account: walletAccount, token: recaptchaToken ?? ''})}
      >
        Request
      </Button>
    </Stack>
	);
};

export default RequestButton;
