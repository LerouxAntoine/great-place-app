import * as FileSystem from "expo-file-system"
import vars from "../env"
export const ADD_PLACE = "ADD_PLACE"
export const SET_PLACES = "SET_PLACES"
import { insertPlace, fetchPlaces } from "../helpers/db"

export const addPlace = (title, image, location) => {
    return async dispatch => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${vars.googleApiKey}`)

        if (!response.ok) {
            throw new Error("Something went wrong")
        }

        const respData = await response.json()
        if (!respData.results) {
            throw new Error("Something went wrong")
        }

        const address = respData.results[0].formatted_address


        const fileName = image.split("/").pop()
        const newPath = FileSystem.documentDirectory + fileName

        try {
            await FileSystem.moveAsync({
                from: image,
                to: newPath
            })
            const dbResult = await insertPlace(title, newPath, address, location.lat, location.lng)
            dispatch({
                type: ADD_PLACE,
                placeData: {
                    id: dbResult.insertId,
                    title: title,
                    image: newPath,
                    address: address,
                    coords: {
                        lat: location.lat,
                        lng: location.lng
                    }
                }
            })
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
}

export const loadPlaces = () => {
    return async dispatch => {
        try {
            const dbResult = await fetchPlaces()
            dispatch({ type: SET_PLACES, places: dbResult.rows._array })
        } catch (err) {
            throw err;
        }
    }
}