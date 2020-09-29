import React, {useState} from 'react';
import {fade, makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import {Link, Redirect} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Tooltip from '@material-ui/core/Tooltip';
import {Avatar} from '@material-ui/core';
import { CurrentUser } from '../models/CurrentUser'
import { Type } from '../models/Type'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        transition: theme.transitions.create(
            [
                'margin', 'width'
            ],
            {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }
        )
    },

    grow: {
        flexGrow: 1
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        }
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${
            theme.spacing(4)
        }px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch'
        }
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    }
}));

export default function NavBar() {
    const {currentUid, username, image} = React.useContext(CurrentUser)
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [query, setQuery] = React.useState('');
    const {type, setType} = React.useContext(Type)
    const [state, setState] = React.useState(false);
    const [submit, setSubmit] = React.useState(false);
    const handleStateChange = (event) => {
        setState(event.target.checked);
          if (state === true) {
              setType('light')
          } else {
              setType('dark')
          }
      };
    
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };    
    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleQuery = (event) => {
        setQuery(event.target.value)
    }
    const handleLogout = (event) => {
        event.preventDefault();
        window.location.href = "/logout";
    }
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();

        if (query.length > 1) {
            setSubmit(true)
        }
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu anchorEl={anchorEl}
            anchorOrigin={
                {
                    vertical: 'top',
                    horizontal: 'right'
                }
            }
            id={menuId}
            keepMounted
            transformOrigin={
                {
                    vertical: 'top',
                    horizontal: 'right'
                }
            }
            open={isMenuOpen}
            onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>
            Logout
            </MenuItem>
            <MenuItem>
            <FormGroup row>
            <FormControlLabel
                control={<Switch checked={state}  onChange={handleStateChange} name="checkedA" />}
                label="Dark Mode"
                    />
                </FormGroup>
                </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu anchorEl={mobileMoreAnchorEl}
            anchorOrigin={
                {
                    vertical: 'top',
                    horizontal: 'right'
                }
            }
            id={mobileMenuId}
            keepMounted
            transformOrigin={
                {
                    vertical: 'top',
                    horizontal: 'right'
                }
            }
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}>
             {image.length > 1 ? 
            <MenuItem onClick={handleProfileMenuOpen}>
                    <Tooltip title={username}  aria-label="username">
                    <Avatar src={image}
                            alt="avatar" />
                                           
                    </Tooltip>
                    
                </MenuItem>
                : <MenuItem>
                <Button href="/login">
                        Login
                </Button> 
                </MenuItem>}
        </Menu>
    );

    return (
        <div className={
            classes.root
        }>
            {submit === true ?
                <Redirect to={'/search/' + query}></Redirect>
        : <></>}
            <CssBaseline/>
            <AppBar position="static"
                style={
                    {backgroundColor: "#166AD0"}
            }>
                <Toolbar>
                
                    <Typography className={
                            classes.title
                        }
                        variant="h6"
                        noWrap>
                        <Link to="/"
                            style={
                                {
                                    textDecoration: 'none',
                                    color: "#FFFFFF"
                                }
                        }>
                            TweetCode
                        </Link>
                    </Typography>
                    <div className={
                        classes.search
                    }>
                        <div className={
                            classes.searchIcon
                        }>
                            <SearchIcon/>
                        </div>
                        <form onSubmit={handleSearchSubmit}>

                        <InputBase placeholder="Search…"
                            classes={
                                {
                                    root: classes.inputRoot,
                                    input: classes.inputInput
                                }
                            }
                                defaultValue={query}
                                onChange={handleQuery}
                            />
                            </form>
                    </div>
                    <div className={
                        classes.grow
                    } />
                        {
                    (currentUid !== null) ? <>
                        <div className={
                            classes.sectionDesktop
                        }>
                                                                    <MenuItem onClick={handleProfileMenuOpen}>
                                {image.length > 1 ?
                                  
                            <Tooltip title={username}  aria-label="username">
                    <Avatar src={image}
                            alt="avatar" />     
                                        </Tooltip>
                                    :
                                        <Button onClick={handleProfileMenuOpen}>
                              <Tooltip title={username}  aria-label="username">
                                            <Avatar alt="avatar">{username.charAt(0)}</Avatar>
                                        </Tooltip>
                                    </Button>
                                    }
                            </MenuItem>
                        </div>
                        <div className={
                            classes.sectionMobile
                        }>
                            <IconButton aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit">
                                <MoreIcon/>
                            </IconButton>
                        </div>
                    </> : <>
                        <div className={
                            classes.sectionDesktop
                        }>
                            <Button variant="contained" color="primary" href="/login">
                                Login
                            </Button>
                        </div>
                        <div className={
                            classes.sectionMobile
                        }>
                            <IconButton aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit">
                                <MoreIcon/>
                            </IconButton>
                        </div>
                    </>
                } </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu} </div>
    );
}

