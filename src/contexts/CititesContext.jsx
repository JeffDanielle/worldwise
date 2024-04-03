import { createContext, useContext, useEffect, useReducer, useState } from "react";

const CitiesContext = createContext();

const URL = 'http://localhost:8000'

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ''
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                isLoading: true
            }

        case 'cities/loaded':
            return {
                ...state,
                isLoading: false,
                cities: action.payload
            }

        case 'city/loaded':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload
            }
        case 'city/created':
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload
            }

        case 'cities/deleted':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter((city) => city.id !== action.payload),
                currentCity: {}
            }

        case 'rejected':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }

        default:
            throw new Error('Unknown action type')
    }
}

const CitiesProvider = ({ children }) => {
    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchCities = async () => {
            dispatch({ type: 'loading' });
            try {
                const res = await fetch(`${URL}/cities`);
                const data = await res.json();
                dispatch({ type: 'cities/loaded', payload: data });
            }
            catch {
                dispatch({ type: 'rejected', payload: 'error fetching cities' });
            }
        }
        fetchCities();
    }, []);

    const getCity = async (id) => {
        if (Number(id) === currentCity.id) return;

        dispatch({ type: 'loading' });
        try {
            const res = await fetch(`${URL}/cities/${id}`);
            const data = await res.json();
            dispatch({ type: 'city/loaded', payload: data });
        }
        catch {
            dispatch({ type: 'rejected', payload: 'error getting city' });
        }
    }

    const createCity = async (newCity) => {
        dispatch({ type: 'loading' });
        try {
            const res = await fetch(`${URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await res.json();
            dispatch({ type: 'city/created', payload: data });
        }
        catch {
            dispatch({ type: 'rejected', payload: 'error creating city' });
        }
    }

    const deleteCity = async (id) => {
        dispatch({ type: 'loading' });
        try {
            await fetch(`${URL}/cities/${id}`,
                {
                    method: 'DELETE',
                });
            dispatch({ type: 'cities/deleted', payload: id });
        }
        catch {
            dispatch({ type: 'rejected', payload: 'error deleting city' });
        }
    }

    return (
        <CitiesContext.Provider value={{ cities, isLoading, error, currentCity, getCity, createCity, deleteCity }}>{children}</CitiesContext.Provider>
    )
}

function useCities() {
    const context = useContext(CitiesContext)
    if (context === undefined) throw new Error('useCities must be used within a CitiesProvider')
    return context;
}

export { CitiesProvider, useCities };