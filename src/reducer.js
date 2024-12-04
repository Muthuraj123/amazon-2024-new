export const initialState = {
    basket: [],
    user: null,
    search: '',
    logged: true,
    listening: false
};

export function getTotalItem(basket) {
    return basket.reduce(
        (accumulator, currentValue) => accumulator + currentValue.quantity,
        0,
    );
}

export function getTotalAmount(basket) {
    return basket.reduce(
        (accumulator, currentValue) => {
            let total = currentValue.quantity * currentValue.price;
            return accumulator + total
        },
        0,
    );
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_BASKET': {
            return {
                ...state, basket: [...state.basket, { ...action.item, quantity: 1 }]
            }
        }
        case 'ADD_BASKET': {
            return {
                ...state, basket: [...action.basket]
            }
        }
        case 'DELETE_FROM_BASKET': {
            const index = state.basket.findIndex(
                (basketItem) => basketItem.id === action.id
            );
            let newBasket = [...state.basket];

            newBasket.splice(index, 1);

            return {
                ...state,
                basket: newBasket
            }
        }
        case 'UPDATE_QUANTITY': {
            const index = state.basket.findIndex(
                (basketItem) => basketItem.id === action.data.id
            );
            let newBasket = [...state.basket];

            if (action.data.qty === 0) {
                newBasket.splice(index, 1);
            } else {
                newBasket[index].quantity = action.data.qty;
            }

            return {
                ...state,
                basket: newBasket
            }
        }
        case 'SET_USER': {
            return {
                ...state,
                user: action.user
            }
        }
        case 'REMOVE_BASKET': {
            return {
                ...state,
                basket: []
            }
        }
        case 'UPDATE_SEARCH': {
            return {
                ...state,
                search: action.search,
                listening: action.listening
            }
        }
        case 'LOGGED': {
            return {
                ...state,
                logged: action.logged,
            }
        }
        default:
            return state;
    }
}