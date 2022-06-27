import React from "react";
// this is the hook that we will use to access the local storage

const useLocalStorage = (key, initialValue) => {
  // we need to use useState to get the initial value
  const [storedValue, setStoredValue] = React.useState(
    () => {
      try {
        // get from local storage by the key
        const item = window.localStorage.getItem(key);
        // parse the stored json or default value
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // if error also return the initial value
        console.log(error);
        return initialValue;
      }
    }
    // this is the function that will be called when the stored value changes
  );

  // this function will set the stored value in local storage
  const setValue = (value) => {
    try {
      // stringify the value
      const valueToStore = JSON.stringify(value);
      // set the value
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      // if error also return the initial value
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
