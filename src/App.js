import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Checkout from './components/Checkout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './components/Login';
import Payment from './components/Payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Orders from './components/Orders';
import { useContext, useEffect, useState } from 'react';
import { StateContext } from './StateProvider';

const promise = loadStripe('pk_test_51J00fuSGUWY7RZxWqyUWJXb768W5KRj1iUdGnFeqOqCNFQSp3QJkG19nCK74E64ZX4EkBgWweuOUUqRoJsU4cSPB00h2MKyH8z');

function App() {
  const { state, dispatch } = useContext(StateContext);
  const [initial, setInitial] = useState(false);

  useEffect(() => {
    if (state?.user?.uid) {
      let data = localStorage.getItem('amazonDetails');
      if (data) {
        data = JSON.parse(data);
        if (data?.user === state?.user?.uid) {
          dispatch({
            type: 'ADD_BASKET',
            basket: data.basket
          })
        }
      }
    }
  }, [state.user])

  useEffect(() => {
    if (initial && state?.user && state.logged) {
      let data = {
        user: state?.user?.uid,
        basket: state?.basket
      }
      localStorage.setItem('amazonDetails', JSON.stringify(data));
    }
    setInitial(true);
  }, [state.basket, state.logged])

  return (
    <>
      <Router>
        <div className="app">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>

            <Route path="/checkout">
              <Header />
              <Checkout />
            </Route>

            <Route path="/payment">
              <Header />
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            </Route>

            <Route path="/orders">
              <Header />
              <Orders />
            </Route>

            <Route path="/">
              <Header />
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
