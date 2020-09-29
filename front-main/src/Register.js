import React, {useState} from 'react';
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
import {GithubLoginButton, GoogleLoginButton} from "react-social-login-buttons";
import Logo from './codingTag1.png';
import Axios from 'axios';
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

export default function Register() {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsername = (event, newUsername) => {
        setUsername(event.target.value);
    }
    const handleEmail = (event, newEmail) => {
        setEmail(event.target.value);
    }
    const handlePassword = (event, newPass) => {
        setPassword(event.target.value);
    }
    const handleGoogleLogin = event => {
        window.location.href = "/auth/google";
    }
    const handleGithubLogin = event => {
        window.location.href = "/auth/github";
    }
    const handleFormSubmit = (event) => {
        event.preventDefault();
        let userData = {
            username: username,
            email: email,
            password: password
        };
        console.log(userData)
        Axios({
            method: 'POST',
            url: '/auth/register',
            data: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then((response) => {
            if (response.status === 200 && response.data === "Authorized") {
                window.location.href = '/login';
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error);
            alert(error)
        });
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
                <Typography component="h1" variant="h5">
                    Register
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
                            <TextField variant="outlined" margin="normal" required fullWidth id="username" label="Username" name="username"
                                defaultValue={username}
                                onChange={handleUsername}
                                autoComplete="username"/>
                        </Grid>
                        <Grid item
                            xs={12}>
                            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email"
                                defaultValue={email}
                                onChange={handleEmail}/>
                        </Grid>
                        <Grid item
                            xs={12}>

                            <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" id="password"
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
                        Register
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {" Already have an account? Sign in "} </Link>
                        </Grid>
                    </Grid>
                </form>

                <GoogleLoginButton onClick={handleGoogleLogin}/>
                <GithubLoginButton onClick={handleGithubLogin}/>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
