import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const URL = 'http://localhost:8000'

const CitiesProvider = ({ children }) => {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});


    useEffect(() => {
        const fetchCities = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${URL}/cities`);
                const data = await res.json();
                setCities(data);
            }
            catch {
                alert('error')
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();

    }, []);

    const getCity = async (id) => {
        try {
            setIsLoading(true);
            const res = await fetch(`${URL}/cities/${id}`);
            const data = await res.json();
            setCurrentCity(data);
        }
        catch {
            alert('error')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>{children}</CitiesContext.Provider>
    )
}

function useCities() {
    const context = useContext(CitiesContext)
    if (context === undefined) throw new Error('useCities must be used within a CitiesProvider')
    return context;
}

export { CitiesProvider, useCities };