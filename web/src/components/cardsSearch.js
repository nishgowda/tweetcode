import React, {useState,useEffect, useContext} from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {
    makeStyles,
    Divider,
    Box,
    Container,
    IconButton
} from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import Pagination from "@material-ui/lab/Pagination";
import Avatar from "@material-ui/core/Avatar";
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {CurrentUser} from '../models/CurrentUser'
import Nav from './Nav'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import {useParams} from "react-router-dom";


const useStyles = makeStyles(theme => ({
    Card: {
        minWidth: 275,
        maxHeight: 300

    },
    root: {
        flexGrow: 1
    },
    title: {
        fontSize: 14
    },
    item: {
        padding: theme.spacing(1.2)
    },
    paginator: {
        justifyContent: "center",
        padding: "10px"
    },
    pos: {
        marginBottom: 12
    },
    container: {
        maxWidth: "md"
    },
    flexGrid: {
        minWidth: 80
    }

}));
function createData(owner, title, date, editButton, deleteButton, language, cid) {
    return {
        owner,
        title,
        date,
        editButton,
        deleteButton,
        language,
        cid
    };
}

const CardsSearch = () => {
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const {currentUid, auth} = useContext(CurrentUser)
    const [items, setItems] = useState([])
    const [open, setOpen] = React.useState(false);

    const rows = []

    function returnEditLink(item) {
        return "/tweet/" + item;
    }
    function returnDeleteLink(item) {
        return "/delete/" + item
    }
    const handleClose = () => {
        setOpen(false);
        window.location.href = "/login"
      };
    let sub =  window.location.href.split('/search/')[1];
    let query = sub;
    useEffect(() => {
        fetch("/api/search/" + query, { credentials: "include" }).then(data => {
            return data.json();
        }).then(data => {
            setItems(data);
        }).catch(err => {
            alert(err);
            console.log(err);
        })
    }, []);
const returnAvatar = (username, imageurl, uid) => {
        return (
            <Grid item
                key={uid}
                className={
                    classes.flexGrid
                }
                component='div'>
                <Tooltip title={username}
                    aria-label="username">

                { imageurl.length > 1 ?
                    <Avatar component='span'
                            src={imageurl} />
                        : <Avatar component='span'
                        >{username.charAt(0)}</Avatar>
                    }
                </Tooltip>
            </Grid>
        );
}

    {
        if (currentUid !== null) {
            items.map(item => {
                (currentUid === item.row_to_json.owner_id) ? rows.push(createData(
                    <Grid container direction="row"
                        component={'div'}>

                        {
                            item.row_to_json.collabs.map(col => returnAvatar(col.username, col.imageurl, col.uid))
                        }</Grid>,
                    item.row_to_json.title,
                    item.row_to_json.date,
                    <IconButton href={
                        returnEditLink(item.row_to_json.cid)
                    }
                        size="small"
                        color="inherit"><EditIcon />
                    </IconButton>,
                    <IconButton href={
                        returnDeleteLink(item.row_to_json.cid)
                    }
                        color="inherit"
                        size="small"><DeleteIcon /></IconButton>,
                    item['row_to_json'].language,
                    item['row_to_json'].cid
                )) : (currentUid !== null) ? rows.push(createData(
                    <Grid container direction="row"
                        component={'div'}>

                        {
                            item.row_to_json.collabs.map(col => returnAvatar(col.username, col.imageurl))
                        }</Grid>,
                    item.row_to_json.title,
                    item.row_to_json.date,
                    <IconButton href={
                        returnEditLink(item.row_to_json.cid)
                    }
                        size="small"
                        color="inherit"><EditIcon />
                    </IconButton>,
                    <IconButton className='disabled-link'
                        href={
                            returnDeleteLink(item.row_to_json.cid)
                        }
                        color="inherit"
                        size="small"><DeleteIcon /></IconButton>,
                    item['row_to_json'].language,
                    item.cid
                )) : rows.push(createData(
                    <Grid container direction="row"
                        component={'div'}>

                        {
                            item.row_to_json.collabs.map(col => returnAvatar(col.username, col.imageurl))
                        }</Grid>,
                    item.row_to_json.title,
                    item.row_to_json.date,
                    <IconButton href={
                        returnEditLink(item.row_to_json.cid)
                    }
                        className='disabled-link'
                        size="small"
                        color="inherit"><EditIcon />
                    </IconButton>,
                    <IconButton className='disabled-link'
                        href={
                            returnDeleteLink(item.row_to_json.cid)
                        }
                        color="inherit"
                        size="small"><DeleteIcon /></IconButton>,
                    item['row_to_json'].language,
                    item.cid
                ))
            })
        }
    }

    const itemsPerPage = 10;
    const noOfPages = Math.ceil(rows.length / itemsPerPage)

    const handleChange = (event, value) => {
        setPage(value);
    };
    return (
        <>
            <Nav></Nav>
        <Container maxWidth="md"
            className={
                classes.root
        }>
                <Typography component="h3" variant="h3" align="center">
                    Search Results...
                </Typography>
                {currentUid !== false ? 
            <Grid container
                spacing={3}
                alignItems="center">
                {
                rows.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(row => {
                    return (
                        <Grid item
                            key={
                                row.cid
                            }
                            xs={12}>
                            <Card key={
                                    row.cid
                                }
                                className={
                                    classes.Card
                                }
                                variant="elevation"
                                component={'div'}>
                                <CardContent component={'div'}>
                                    <Typography className={
                                            classes.title
                                        }
                                        color="textSecondary"
                                        component={'div'}
                                        gutterBottom>
                                        {
                                        row.date
                                    } </Typography>
                                    <Typography variant="h5"
                                        component={'div'}>
                                        {
                                        row.title
                                    } </Typography>
                                    <Typography className={
                                            classes.pos
                                        }
                                        color="textSecondary"
                                        component='div'>

                                        {

                                        row.owner.props.children.length > 1 ? "Contributers: " : "Contributer: "
                                    }
                                        {
                                        row.owner
                                    } </Typography>
                                    <Typography className={
                                            classes.title
                                        }
                                        color="textPrimary"
                                        gutterBottom
                                        component={'div'}>
                                        Language: {
                                        row.language
                                    } </Typography>
                                </CardContent>
                                <Grid item
                                    xs={6}>
                                    <CardActions> {
                                        row.editButton
                                    }
                                        {
                                        row.deleteButton
                                    } </CardActions>
                                </Grid>
                            </Card>
                        </Grid>

                    );
                })
                        } </Grid>
                    :
                    <>
                    <Dialog
                   open={true}
                   onClose={handleClose}
                   aria-labelledby="alert-dialog-title"
                   aria-describedby="alert-dialog-description"
                 >
                   <DialogTitle id="alert-dialog-title">{"Not Logged in"}</DialogTitle>
                   <DialogContent>
                     <DialogContentText id="alert-dialog-description">
                       You aren't signed in! Please sign in to continue.
                     </DialogContentText>
                   </DialogContent>
                   <DialogActions>
                     <Button onClick={handleClose} color="primary" autoFocus>
                       Sign In
                     </Button>
                   </DialogActions>
                        </Dialog>
                        </>
             }
        </Container>
        <Container  maxWidth="md"
            className={
                classes.root
        }>
                
                {rows.length > 0 ? 
                    <>
            <Divider/>
            <Box component="span">
                <Pagination count={noOfPages}
                    page={page}
                    onChange={handleChange}
                    defaultPage={1}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    classes={
                        {ul: classes.paginator}
                    }/>
                        </Box>
                        </>
                    :
                    <> </>}
        </Container>
        </>

    );
    
}

export default CardsSearch;