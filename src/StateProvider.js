import React, { createContext, useEffect, useReducer } from 'react';
import { auth } from './firebase';

// Create a Context
export const StateContext = createContext();

export const StateProvider = ({ initialState, reducer, children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            auth.onAuthStateChanged(authUser => {
                if (authUser) {
                    dispatch({
                        type: 'SET_USER',
                        user: authUser
                    })
                    dispatch({
                        type: 'LOGGED',
                        logged: true
                    });
                } else {
                    dispatch({
                        type: 'SET_USER',
                        user: null
                    })
                    dispatch({
                        type: 'LOGGED',
                        logged: false
                    });
                }
            })
        });

        return () => unsubscribe();
    }, []);

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            {children}
        </StateContext.Provider>
    );
};
