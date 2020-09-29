import React, {useState, useEffect} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {ListItem} from "@material-ui/core";
import List from '@material-ui/core/List';
import {Avatar} from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import {useParams} from "react-router-dom";

const Modal = () => {
    const [email, setEmail] = useState('');
    const { cid } = useParams()

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

    var userData = {
        email: email
    };

    const [allUsers, setUsers] = useState([]);
    useEffect(() => {
        fetch('/api/users', { credentials: "include" }).then(data => {
            return data.json();
        }).then(data => {
            setUsers(data);
        }).catch(err => {
            console.log(err);
        })
    }, []);
    const [collaborators, setCollaborators] = useState([]);
    useEffect(() => {
        fetch(`/api/tweetusers/${cid}`, { credentials: "include" }).then(data => {
            return data.json();
        }).then(data => {
            setCollaborators(data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    const handleCloseSubmit = (event) => {
        event.preventDefault();
        if (!(allUsers.some(user => user.email === email))) {
            alert(email + " is not a TweetCode user")
            return;
        } else {
            setOpen(false);
            axios({
                method: 'post',
                url: '/api/tweets-invite/' + cid,
                data: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                alert(response.data + ' was invited to this document')
            }).catch(function (error) {
                console.log(error.response);
            });
        }


    }

    return (
        <React.Fragment>
            <Button variant="contained" color="primary"
                onClick={handleClickOpen}>
                Share
            </Button>
            <Dialog open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Share</DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        Collaborators for this script:
                        <List> {
                            collaborators.map((el, index) => {
                                return <ListItem key={index}>
                                    <ListItemAvatar>
                                        {el.imageurl.length > 1 ? 
                                        <Avatar src={
                                            el.imageurl
                                        } />
                                            : <Avatar alt="avater">{el.username.charAt(0)}</Avatar> }
                                    </ListItemAvatar>
                                    <ListItemText primary={
                                        el.username
                                    }/>
                                </ListItem>
                        })
                        } </List>
                    </DialogContentText>
                    <DialogContentText>
                        Invite a user to collaborate with you on this script.
                    </DialogContentText>

                    <TextField value={email}
                        onChange={handleEmail}
                        margin="normal"
                        variant="outlined"
                        type="email"
                        label="Email Address"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
                        color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCloseSubmit}
                        color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );

}
export default Modal;
