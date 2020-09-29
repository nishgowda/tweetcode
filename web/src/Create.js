import React, {useRef, useState, useContext} from "react";
import {ControlledEditor as MonacoEditor} from "@monaco-editor/react";
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Grid, IconButton} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Axios from 'axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import { CurrentUser } from './models/CurrentUser'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    root: {
        width: '100%',
        backgroundColor: '#EDEDED'
    }
}));

export default function Create() {

    const classes = useStyles();
    const [code, setCode] = useState('print("hello")');
    const [theme, setTheme] = useState('vs');
    const [title, setTitle] = useState('')
    const [language, setLanguage] = useState('python');
    const [status, setStatus] = useState('Public');
    const languages = [
        'abap',
        'apex',
        'azcli',
        'bat',
        'cameligo',
        'clojure',
        'coffee',
        'cpp',
        'csharp',
        'csp',
        'css',
        'dockerfile',
        'fsharp',
        'go',
        'graphql',
        'handlebars',
        'html',
        'ini',
        'java',
        'javascript',
        'json',
        'kotlin',
        'less',
        'lua',
        'markdown',
        'mips',
        'msdax',
        'mysql',
        'objective-c',
        'pascal',
        'pascaligo',
        'perl',
        'pgsql',
        'php',
        'postiats',
        'powerquery',
        'powershell',
        'pug',
        'python',
        'r',
        'razor',
        'redis',
        'redshift',
        'restructuredtext',
        'ruby',
        'rust',
        'sb',
        'scheme',
        'scss',
        'shell',
        'solidity',
        'sophia',
        'sql',
        'st',
        'swift',
        'tcl',
        'twig',
        'typescript',
        'vb',
        'xml',
        'yaml'
    ];
    const valueGetter = useRef();
    const { currentUid } = useContext(CurrentUser);
    const [auth, setAuth] = useState(true);
    const [_, setOpen] = useState(false);

    const options = {
        minimap: {
            enabled: true
        }
    };

    const changeHandler = (evt, newText) => {
        setCode(newText);
    };

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };
    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }
    const handleStatusChange = (event) => {
        setStatus(event.target.value)
    }
    const editorDidMount = (_valueGetter) => {
        valueGetter.current = _valueGetter;
        
    };
    const handleClose = () => {
        setOpen(false);
        window.location.href = "/login"
    };
    window.onload = () => {
        if (!currentUid) {
            setAuth(false);
        }
    }
    let data = {
        code: code,
        language: language,
        title: title,
        status: status
    }
    const handleSubmit = event => {
        event.preventDefault();
        Axios({
            method: 'post',
            url: '/api/create',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then(function (response) {
            window.location.href = '/tweet/' + response.data[0].cid
        }).catch(function (error) {
            console.log(error)
        });
    }

    return (
        <>
            {
                auth === true ?
                <>
            <AppBar position="static"
                style={
                    {backgroundColor: "#FFFFFF"}
            }>
                <Grid container direction="row" justify="center" alignItems="center">
                    <IconButton style={
                            {color: "#1589FF"}
                        }
                        href="/"><ArrowBackIcon/></IconButton>
                    <form onSubmit={handleSubmit}>
                        <FormControl className={
                            classes.formControl
                        }>
                            <TextField type="text"
                                onChange={handleTitleChange}
                                label="Title"/>
                        </FormControl>
                        <FormControl className={
                            classes.formControl
                        }>
                            <InputLabel id="langauge-change-label">Language</InputLabel>
                            <Select labelId="langauge-change-label" id="langauge-change-select"
                                value={language}
                                onChange={handleLanguageChange}>
                                {
                                languages.map((item, keyIndex) => <MenuItem key={keyIndex}
                                    value={item}>
                                    {item}</MenuItem>)
                            } </Select>
                        </FormControl>
                        <FormControl className={
                            classes.formControl
                        }>
                            <InputLabel id="theme-change-label">Theme</InputLabel>
                            <Select labelId="theme-change-label" id="theme-change-select"
                                value={theme}
                                onChange={handleThemeChange}>
                                <MenuItem value={'vs'}>Light</MenuItem>
                                <MenuItem value={'vs-dark'}>Dark</MenuItem>
                                <MenuItem value={'hc-black'}>High Contrast</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={
                            classes.formControl
                        }>
                            <InputLabel id="status-change-label">Status</InputLabel>
                            <Select labelId="status-change-label" id="status-change-select"
                                value={status}
                                onChange={handleStatusChange}>
                                <MenuItem value={'public'}>public</MenuItem>
                                <MenuItem value={'private'}>private</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={
                            classes.formControl
                        }>
                            <Button type="submit" variant="contained"
                                style={
                                    {
                                        backgroundColor: "#1589FF",
                                        color: "#FFFFFF"
                                    }
                            }>Save</Button>
                        </FormControl>
                    </form>
                </Grid>
            </AppBar>
            <div className={
                classes.root
            }>
                <Grid container direction="column" justify="center" alignItems="center">
                    <MonacoEditor width="900px" height="100vh"
                        language={language}
                        theme={theme}
                        value={code}
                        options={options}
                        onChange={changeHandler}
                        editorDidMount={editorDidMount}/>

                </Grid>
                    </div>
                    </>
                 : 
                    <>
                        <Dialog
                   open={true}
                   onClose={handleClose}
                   aria-labelledby="alert-dialog-title"
                   aria-describedby="alert-dialog-description"
                 >
                   <DialogTitle id="alert-dialog-title">{"You aren't authenticated!"}</DialogTitle>
                   <DialogContent>
                     <DialogContentText id="alert-dialog-description">
                       You aren't logged in! Please log in to create a document.
                     </DialogContentText>
                   </DialogContent>
                   <DialogActions>

                     <Button href="/" color="primary" autoFocus>
                                Back
                     </Button>
                     <Button  onClick={handleClose} color="primary" autoFocus>
                                Log In
                     </Button>
                   </DialogActions>
                        </Dialog>
                        </>}
        </>
    );
};
