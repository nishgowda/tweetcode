import React, { useState } from 'react';

export const Type = React.createContext();

export const TypeProvider = ({ children }) => {
    const [type, setType] = useState('light')
    return (
        <Type.Provider value={{ type, setType }}>
            {children}
        </Type.Provider>
    );
};