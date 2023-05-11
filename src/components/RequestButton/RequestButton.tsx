import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { useWallet } from '@sei-js/react'
import {
  Button,
  Text,
  CircularProgress,
  Stack
} from '@mui/material'
import { useMutation } from 'react-query'
import { AccountData } from '@cosmjs/proto-signing'
import axios from 'axios'
import { useRefetchQueries } from "@sparrowswap/hooks/useRefetchQueries";
import { useChainInfo} from "@sparrowswap/hooks";
import { SeiSigningCosmWasmClient, WalletWindowKey } from '@sei-js/core'
import { useRouter } from 'next/router'

type RequestFaucetArgs = {
  account: AccountData
}

const sleep = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs))

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const RequestButton = () => {
  const [chainInfo] = useChainInfo()
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter()
  const user_id = router.query.user_id

  const checkNFT = async () => {

    if (!window.keplr) {
      alert("Please install keplr extension");
      return;
    }

    console.log("Checking NFT presence")

    // Get Keplr offlineSigner
    const offlineSigner = window.keplr.getOfflineSigner(chainInfo.chainId);

    // Get the accounts associated with the offlineSigner
    // const accounts = await offlineSigner.getAccounts();

    // Assuming you want to use the first account
    // const signerAddress = accounts[0].address;
    const key = await window.keplr.getKey(chainInfo.chainId)

    console.log("Key: ", key)

    const collections =[
      {
        "id": "ogapril2023",
        "name": "Sparrowswap OG April 2023",
        "address": "sei1mn73rzt8yla2qc3vg65jvfan84axwzynepnleukt69yxrqgehwss09x7hl"
      }
    ]
    const msg = {
      tokens: {
        owner: key.bech32Address
      },
    }

    const client = await SeiSigningCosmWasmClient.connectWithSigner(
      chainInfo.rpc,
      offlineSigner,
    )

    console.log("OfflineSigner: ", offlineSigner)
    console.log("Using address: ", key.bech32Address)
    console.log("On collection adddress: ", collections[0].address)
    console.log("With msg ", msg)
    const tokenIDs = await client.queryContractSmart(collections[0].address, msg)

    if (tokenIDs == null) {
      setModalOpen(true);
    } else {
      try {

        console.log("Sending request to server: ", {
          address: key.bech32Address,
          user_id: user_id,
          exists: true,
        })
        const response = await axios.post('http://localhost:8090/role_assign_upon_nft', {
          address: key.bech32Address,
          user_id: user_id,
          exists: true,
        });
        // Check the response if needed
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };


  return (
    <>
      <Button
        disabled={false}
        color='primary'
        variant='contained'
        size='large'
        onClick={() => checkNFT()}
      >
        Request
      </Button>
      {modalOpen && (
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <DialogTitle>NFT Not Found</DialogTitle>
          <DialogContent>
            <DialogContentText>
              NFT is not found, please contact Discord admin.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RequestButton;
