import React, {useEffect, useState} from 'react'

export const AllTweets = React.createContext(null);export default({children}) => {
const [tweets, setTweets] = useState([])
useEffect(() => {
    fetch("/api/tweets",{credentials: 'include'}).then(data => {
        return data.json();
    }).then(data => {
        setTweets(data);
    }).catch(err => {
        console.log(err)
    })
}, []);
const items = {
    items: tweets
};
return <AllTweets.Provider value={items}>
    {children}</AllTweets.Provider>}
