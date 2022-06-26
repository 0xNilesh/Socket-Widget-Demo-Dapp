import React, { useEffect, useState } from 'react';
import { BridgeWidget } from "socket-bridge-widget";
import { ethers } from "ethers";
import Slider from '@mui/material/Slider';

let ethereum = (window as any).ethereum;

function App() {
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState({} as any);
  const [widthWidget, setWidthWidget] = useState(window.innerWidth/2);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    setProvider(provider);

    // MetaMask requires requesting permission to connect users accounts
    const response = await provider.send("eth_requestAccounts", []);
    setAddress(response[0]);
  }

  useEffect(() => {
    if (ethereum) {
      ethereum.on('chainChanged', () => {
        connectWallet();
      })
      ethereum.on('accountsChanged', () => {
        connectWallet();
      })
    }
  }, []);

  return (
    <div>
      <div style={{margin: "20px"}}>
        <button
          onClick={connectWallet}
          style={{backgroundColor: "blue", padding: "12px", margin: "auto"}}
        >
          {address ? address : 'Connect Metamask Wallet'}
        </button>
      </div>
      <div>
        <Slider
          defaultValue={window.innerWidth/2}
          onChange={(_, value) =>
            setWidthWidget(Number(value))
          }
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          min={1}
          max={window.innerWidth}
        />
      </div>
      <div style={{ margin: "20px" }}>Width of Widget: {widthWidget}</div>
      <div style={{padding: "20px", width:widthWidget, margin: "auto"}}>
        <BridgeWidget
          apiKey={process.env.REACT_APP_SOCKET_API_KEY}
          provider={provider}
        />
      </div>
    </div>
  );
}

export default App;
