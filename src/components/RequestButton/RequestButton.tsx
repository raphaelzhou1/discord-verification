import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { walletTypeState } from "@sparrowswap/types/walletTypeState";

const RequestButton = () => {
  const [failModal, setFailModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [walletType, setWalletType] = useRecoilState(walletTypeState);

  const router = useRouter()
  const user_id = router.query.user_id

  const checkNFTKeplr = async () => {
    try {
      if (!window.keplr) {
        console.log("Please install Keplr");
        alert("Please install keplr extension");
        return;
      }

      // Get Keplr offlineSigner
      const offlineSigner = await window.keplr.getOfflineSigner("atlantic-2");
      console.log("Offlinesigner: ", offlineSigner)
      const account = (await offlineSigner.getAccounts())[0]
      const signDoc = {
        msgs: [{
          type: 'autopirate-login',
          value: user_id
        }],
        fee: {
          amount: [],
          // Note: this needs to be 0 gas to comply with ADR36, but Keplr current throws an error. See: https://github.com/cosmos/cosmos-sdk/blob/master/docs/architecture/adr-036-arbitrary-signature.md#decision
          gas: "1"
        },
        chain_id: "atlantic-2",
        memo: "",
        account_number: "0",
        sequence: "0",
      };
      console.log("Checking NFT presence")

      const {signed, signature} = await offlineSigner.signAmino(account.address, signDoc);

      console.log("Sending request to server: ", {
        account: account,
        user_id: user_id,
        signed,
        signature: signature,
      })
      const response = await axios.post('http://localhost:8090/role_assign_upon_nft', {
        account: account,
        user_id: user_id,
        signed: signed,
        signature: signature,
      });
      // Check the response if needed
      console.log("Response.data", response.data);
      console.log("Response.status", response.status);

      if (response.status == 200) {
        setSuccessModal(true);
      } else {
        setFailModal(true)
      }
    } catch (error) {
      console.error(error);
      setFailModal(true)
    }
  };

  const checkNFTLeap = async () => {
    try {
      if (!window.keplr || !window.leap) {
        console.log("Please install Leap");
        alert("Please install leap extension");
        return;
      }

      // Get offlineSigner
      const offlineSigner = await window.keplr.getOfflineSigner("atlantic-2");
      console.log("Offlinesigner: ", offlineSigner)
      const account = (await offlineSigner.getAccounts())[0]
      const signDoc = {
        msgs: [{
          type: 'autopirate-login',
          value: user_id
        }],
        fee: {
          amount: [],
          // Note: this needs to be 0 gas to comply with ADR36, but Keplr current throws an error. See: https://github.com/cosmos/cosmos-sdk/blob/master/docs/architecture/adr-036-arbitrary-signature.md#decision
          gas: "1"
        },
        chain_id: "atlantic-2",
        memo: "",
        account_number: "0",
        sequence: "0",
      };
      console.log("Checking NFT presence")

      const {signed, signature} = await offlineSigner.signAmino(account.address, signDoc);

      console.log("Sending request to server: ", {
        account: account,
        user_id: user_id,
        signed,
        signature: signature,
      })
      const response = await axios.post('http://localhost:8090/role_assign_upon_nft', {
        account: account,
        user_id: user_id,
        signed: signed,
        signature: signature,
      });
      // Check the response if needed
      console.log("Response.data", response.data);
      console.log("Response.status", response.status);

      if (response.status == 200) {
        setSuccessModal(true);
      } else {
        setFailModal(true)
      }
    } catch (error) {
      console.error(error);
      setFailModal(true)
    }
  };

  const checkNFT = async () => {
    if (walletType === 'keplr') {
      await checkNFTKeplr();
    } else if (walletType === 'leap') {
      await checkNFTLeap();
    } else {
      console.error(`Unsupported wallet type: ${walletType}`);
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
      {failModal && (
        <Dialog
          open={failModal}
          onClose={() => setFailModal(false)}
        >
          <DialogContent>
            <DialogContentText>
              Arr, there&apos;s a hitch in Captain Autopirate&apos;s sea charts, seek counsel from yer crew on Discord or hail the Discord harbor master! 🏴‍☠️
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {successModal && (
        <Dialog
          open={successModal}
          onClose={() => setSuccessModal(false)}
        >
          <DialogContent>
            <DialogContentText>
              Signature sent to Captain Autopirate.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RequestButton;
