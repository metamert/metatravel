import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import * as nearAPI from "near-api-js";
import "./App.css";
import Room from "./components/room";
import Navbar from "./components/navbar";
import Profile from "./components/profile";
import Home from "./components/home";
import { Buffer } from "buffer";
global.Buffer = Buffer;
const { connect, keyStores, WalletConnection } = nearAPI;
const config = {
  networkId: "mainnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.mainnet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://explorer.mainnet.near.org",
};


export default function App() {
  const [near, setNear] = useState();
  const [wallet, setWallet] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    initNear();
  }, []);

  const initNear = async (data) => {
    const near = await connect(config);
    const wallet = new WalletConnection(near);
    setNear(near);
    setWallet(wallet);

    if (wallet.isSignedIn()) {
      setUser(wallet.getAccountId());
    }

  };

  const signOut = () => {
    wallet.signOut();
    setUser(null);
  };

  const signIn = () => {
    wallet.requestSignIn(
     "616a3afcca582619b0fa5eae57a4f79dff5a147bea4e31774cf61072248c9cfc", // contract requesting access
      "Metatravel", // optional
      "https://metatravel.vercel.app"
    );
  };
  return (
    <Router>
      {near && wallet && (
        <div>
          
            <Navbar signIn={signIn} user={wallet?.getAccountId()} near={near} wallet={wallet} signOut={signOut}></Navbar>
          
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/">
              <Home near={near} wallet={wallet} user={wallet?.getAccountId()} />
            </Route>
            <Route exact path="/profile">
              {wallet?.isSignedIn() ? <Profile near={near} wallet={wallet} user={wallet?.getAccountId()}/> : <Redirect to="/"></Redirect>}
            </Route>
            <Route exact path="/rooms">
              <Room near={near} wallet={wallet} user={wallet?.getAccountId()} />
            </Route>
          </Switch>
        </div>
      )}
    </Router>
  );
}
