import React, { useState }from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { GithubLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import Logo from './codingTag1.png'
import Axios from 'axios';
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        TweetCode
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
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
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
  const handleEmail = (event, newEmail) => {
        setEmail(event.target.value);
    }
  const handlePassword = (event, newPass) => {
        setPassword(event.target.value);
    }
    const handleGoogleLogin = event => {
        window.location.href = "/auth/google"
    }
    const handleGithubLogin = event => {
        window.location.href = "/auth/github"
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        let userData = {
            email: email,
            password: password
        };
        Axios({
            method: 'POST',
            url: '/auth/login',
            data: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
          },
            withCredentials: true
        }).then((response) => {
            if (response.data === 'password does not match') {
                alert(response.data)
            }
            if (response.data === "Authorized") {
                window.location.href = "/"
            }
        }).catch((error) => {
            console.log(error);
        });
    }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar} src={Logo}>
        </Avatar>
        <Typography component="h1" variant="h5">
                  Sign in
        </Typography>
              <form className={classes.form} onSubmit={handleFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
                      name="email"
                      defaultValue={email}
                      onChange={handleEmail}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
                      id="password"
                      defaultValue={password}
                      onChange={handlePassword}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotpassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
       
              <GoogleLoginButton onClick={handleGoogleLogin}/>
<GithubLoginButton onClick={handleGithubLogin}/>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}