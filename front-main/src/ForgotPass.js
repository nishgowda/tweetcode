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
import Logo from './codingTag1.png';
import axios from 'axios';
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

export default function ForgotPass() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }
    
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (email.length < 3) return;
        let data = {
            email: email,
        };
        axios({
            method: 'POST',
            url: '/auth/forgotpassword',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then((response) => {
            if (response.data === 'Recovery email sent') {
                setEmailSent(true)
            }
        }).catch((error) => {
            console.log(error);
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
                    {emailSent === false ?
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
                                <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email"
                                    defaultValue={email}
                                    onChange={handleEmail} />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" color="primary"
                            className={
                                classes.submit
                            }>
                            Send
                    </Button>
                        </form>
                        </>
                    : <>
            
                        <Typography variant="h5" component="h2" align="center">
                            Please check your email. This may appear in your spam.
                        </Typography>
                        </>}
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
