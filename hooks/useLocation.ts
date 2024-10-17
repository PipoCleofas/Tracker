import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';

const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('Emergency Assistance Request');
  const [description, setDescription] = useState<string>('Emergency Assistance Request');

  // Fetch the location
  const fetchLocation = async () => {
    setIsFetching(true);
    try {
      // Request permission for location access
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      console.log('Location fetched:', location.coords);

    } catch (error: any) {
      setErrorMsg("Unable to retrieve location");
      console.error('Location fetch error:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Submit marker to the server
  const submitMarker = async () => {
    if (!latitude || !longitude) {
      console.error('Latitude or longitude is missing');
      return;
    }

    try {
      console.log('Submitting marker:', { latitude, longitude, title, description });

      // Send marker data to the backend
      const markerResponse = await axios.post('http://192.168.100.127:3000/submit', {
        latitude,
        longitude,
        title,  // Use dynamic title
        description,  // Use dynamic description
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Marker submitted successfully:', markerResponse.data);
    } catch (error) {
      console.error('Error submitting marker:', error);
    }
  };

  // Fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // Submit marker when latitude and longitude are set
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      console.log('Coordinates ready, submitting marker...');
      submitMarker();
    }
  }, [latitude, longitude]);

  return {
    location,
    errorMsg,
    isFetching,
    latitude,
    longitude,
    title,
    description,
    setLatitude,
    setLongitude,
    setTitle,
    setDescription,
    fetchLocation,
  };
};

export default useLocation;
