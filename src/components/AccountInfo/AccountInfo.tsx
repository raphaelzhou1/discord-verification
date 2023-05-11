import React, { useEffect, useMemo, useState } from 'react';
import { IoCopySharp, IoSendSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useQueryClient, useWallet } from '@sei-js/react';

import { BalanceResponseType } from '@sparrowswap/types';
import {convertMicroDenomToDenom, formatTokenBalance} from '@sparrowswap/util'
import { useRefetchQueries } from '@sparrowswap/hooks/useRefetchQueries';
import styles from './styles.module.css'
import {Card, CardContent, CircularProgress, Divider, Stack} from '@mui/material'
import {useQuery} from "react-query";

const AccountInfo = () => {
	const { offlineSigner, accounts } = useWallet();
	const { queryClient } = useQueryClient();

	const walletAccount = useMemo(() => accounts?.[0], [accounts]);

  const refetchBalances = useRefetchQueries(['balances'], 500)

	useEffect(() => {
		refetchBalances()
	}, [offlineSigner, refetchBalances]);

  const { data: walletBalances, isLoading: isLoadingBalances } = useQuery(
    `balances`,
  async () => {
      const defaultBalance = {amount: "0", denom: process.env.NEXT_PUBLIC_DENOM} as BalanceResponseType
    if (queryClient && walletAccount) {
      const { balances } = await queryClient.cosmos.bank.v1beta1.allBalances({ address: walletAccount.address });
      return balances.filter((balance) => balance.denom === process.env.NEXT_PUBLIC_DENOM) as BalanceResponseType[] || [];
    }
    return [];
  },    {
    enabled: Boolean(
      walletAccount
    ),
      cacheTime: 0,
      keepPreviousData: false,
      refetchOnMount: 'always',
      refetchInterval: 15000,
      refetchIntervalInBackground: true,

      onError(error) {
      console.error('Cannot fetch token balance bc:', error)
    },
  })

	const renderBalances = () => {
		if (!walletAccount) {
			return <p>Wallet not connected</p>;
		}
		if (walletBalances?.length === 0) {
			return (
        <CircularProgress color="inherit" size={25} />
			);
		}

		return walletBalances?.map((balance) => {
			return (
				<Stack key={balance.denom} spacing={0.5}>
					<div className={styles.tokenAmount}>{
            formatTokenBalance(
              convertMicroDenomToDenom(balance.amount, 6),
              {
                includeCommaSeparation: true
              })
          }&nbsp; USDC</div>
				</Stack>
			);
		});
	};

	const onClickCopy = () => {
		toast.info('Copied address to clipboard!');
		navigator.clipboard.writeText(walletAccount?.address || '').then();
	};

  if (!walletAccount?.address) {
    return <></>
  }

	return (
		<Card>
      <CardContent>
      <h3>Wallet Address</h3>
				<Stack direction='row' alignItems='center'>
					{walletAccount?.address || 'No account found!'}
          {walletAccount?.address && <IoCopySharp className={styles.copy} onClick={onClickCopy} />}
				</Stack>
      </CardContent>
		</Card>
	);
};

export default AccountInfo;
