import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from './codingTag1.png';
import Axios from 'axios';
import {useParams} from "react-router-dom";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit">
                TweetCode
            </Link>
            {' '}
            {new Date().getFullYear()}
            {'.'} </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
      },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function Reset() {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const [updated, setUpdated] = useState(false)

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }
    const { token } = useParams()
    useEffect(() => {
        fetch('/auth/reset/' + token, {credentials: 'include'}).then(data => {
            return data.json();
        }).then(data => {
            if (data.message === 'Valid password link') {
                setEmail(data.email)
            }
        }).catch(err => {
            console.log(err);
        });
    }, [])

    

    const handleFormSubmit = (event) => {
        event.preventDefault();
        Axios.put('/auth/updatePassword', {
            email: email,
            password: password,
        }).then(response => {
            if (response.data === 'Password Updated') {
                setUpdated(true)
            }
        })
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={
                classes.paper
            }>
                <Avatar className={
                        classes.avatar
                    }
                    src={Logo}></Avatar>
             
                    {updated === false ? 
                       <>
                <Typography component="h1" variant="h5">
                        Change Password
                </Typography>
                <form className={
                        classes.form
                    }
                    onSubmit={handleFormSubmit}
                    noValidate>
                    <Grid container
                        spacing={2}>
                        <Grid item
                            xs={12}>
                                    <TextField variant="outlined" margin="normal" required fullWidth
                                        name="password" label="Password" id="password"
                                        type="password"
                                defaultValue={password}
                                onChange={handlePassword}
                                autoComplete="current-password"/>
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary"
                        className={
                            classes.submit
                    }>
                        Submit
                    </Button>
                        </form>
                        </>
                    : <>
                         <Grid container
                        spacing={2}>
                        <Grid item
                            xs={12} alignItems="center">
                        <Typography component="h3" variant="h5">
                            Password Reset
                        </Typography>
                                <Link href="/login">Login</Link>
                            </Grid>
                            </Grid>
                    </>}
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
