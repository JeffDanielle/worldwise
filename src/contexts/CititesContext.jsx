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

    const createCity = async (newCity) => {
        try {
            setIsLoading(true);
            const res = await fetch(`${URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await res.json();
            setCities(cities => [...cities, data]);
        }
        catch {
            alert('error creating the city')
        } finally {
            setIsLoading(false);
        }
    }

    const deleteCity = async (id) => {
        try {
            setIsLoading(true);
            await fetch(`${URL}/cities/${id}`,
                {
                    method: 'DELETE',
                });
            setCities((cities) => cities.filter((city) => city.id !== id));
        }
        catch {
            alert('error deleting city')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity, createCity, deleteCity }}>{children}</CitiesContext.Provider>
    )
}

function useCities() {
    const context = useContext(CitiesContext)
    if (context === undefined) throw new Error('useCities must be used within a CitiesProvider')
    return context;
}

export { CitiesProvider, useCities };