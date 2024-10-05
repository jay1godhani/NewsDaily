import React from 'react';
import spinnerImage from './Spinner.gif'; // Renamed for clarity

const LoadingSpinner = () => { // Renamed the component
  
    return (
      <div className="text-center">
        <img src={spinnerImage} alt="Loading..." />
      </div>
    );
  
}

export default LoadingSpinner;

