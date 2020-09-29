import React, {useEffect, useState} from 'react'

export const CurrentUser = React.createContext(null);
export default ({ children }) => {
const [currentUser, setUser] = useState(null)
const [currentUsername, setUsername] = useState('')
    const [currentUserImage, setImage] = useState('')
    const [auth, setAuth] = useState(true)
useEffect(() => {
    fetch("/api/usercurrent", {credentials: 'include'}).then(data => {
        return data.json();
    }).then(data => {
        if (data[0].currentUid === 0) {
            setUser(null)
            setImage('')
            setUsername('')
            setAuth(false)
        } else {
            setUser(data[0].currentUid)
            setImage(data[0].imageurl)
            setUsername(data[0].username)
            setAuth(true)
        }

    }).catch(err => {
        console.log(err)
    })
}, []);
    const user = {
        currentUid: currentUser,
        username: currentUsername,
        image: currentUserImage,
        auth: auth
    };
return <CurrentUser.Provider value={user}>
    {children}</CurrentUser.Provider>}
