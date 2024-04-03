import { createContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const URL = 'http://localhost:8000'

const CitiesProvider = ({ children }) => {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <CitiesContext.Provider value={{ cities, isLoading }}>{children}</CitiesContext.Provider>
    )
}

export { CitiesProvider, CitiesContext, };