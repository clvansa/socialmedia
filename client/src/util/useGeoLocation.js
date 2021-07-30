import React, { useEffect, useState } from 'react'

const useGeoLocation = () => {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: "", lng: "" }
    })

    const onSuccess = (location) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lan: location.coords.longitude
            }
        })
    }

    const onError = (error) => {
        setLocation({
            loaded: true,
            error,
        })
    }
    useEffect(() => {
        if ((!"geolocaton" in navigator)) {
            onError({
                code: 0,
                message: "Geoloction not supprted"
            })
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError)

    }, [])

    return location
}

export default useGeoLocation
