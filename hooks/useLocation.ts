import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';

const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);


  const fetchLocation = async () => {
    setIsFetching(true);
    try {

        
  
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsFetching(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setTitle("Emergency Assistance Request");
      setDescription("Emergency Assistance Request");

      console.log('Setting done')

    } catch (error: any) {
      setErrorMsg("Can't get location");
      
    } finally {
      setIsFetching(false);
    }
  };

  const submitMarker = async () => {
    try {
      console.log('Submitting data:', { latitude, longitude, title, description });
      
      if (!latitude || !longitude) {
        console.error('Latitude or longitude is missing');
        return;
      }
      
      const markerResponse = await axios.post('http://192.168.100.127:3000/submit', {
        latitude,
        longitude,
        title: 'Got you',  // This overrides the title you set earlier
        description: "Got you",  // This overrides the description you set earlier
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Marker submission success:', markerResponse.data);
    } catch (error) {
      console.error('Error submitting marker:', error);
    }
  };
  
  
  useEffect(() => {
    fetchLocation();
  }, []);
  
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      console.log('Submitting marker with:', { latitude, longitude });
      submitMarker();
    }
  }, [latitude, longitude]);  // This will wait until latitude and longitude are set
  
  

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
    fetchLocation
  };
};

export default useLocation;