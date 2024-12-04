import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { StateContext } from './StateProvider';

const PrivateRoute = ({ children }) => {
    const { state } = useContext(StateContext);

    return state?.user ? children : <Redirect to="/login" />;
};

export default PrivateRoute;