import React, {useState, useEffect} from "react";
import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Avatar} from '@material-ui/core';
import {useParams, Redirect} from "react-router-dom";
import { makeStyles, Container, Divider, Box } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { Grid, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
  },
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
  
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  function createData(owner, review, score, date) {
    return {owner, review, score, date };
}

  
const TweetModal = () => {
    const classes = useStyles();
    const { cid } = useParams()
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

  
    const handleChange = (event, value) => {
      setPage(value);
    };
  const rows = []
  const itemsPerPage = 10;
  const noOfPages = Math.ceil(rows.length / itemsPerPage)
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
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        fetch(`/api/reviews/${cid}`, { credentials: "include" }).then(data => {
            return data.json();
        }).then(data => {
            setReviews(data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    reviews.map(item => {
        rows.push(createData(
            <Grid container direction="row"
                component={'div'}>

                {
                    item.row_to_json.reviewers.map(col => returnAvatar(col.username, col.imageurl, col.uid))
                }</Grid>,
                item.row_to_json.review,
            item.row_to_json.score,
            item.row_to_json.date
        ));
    });
  return (
   
<>
        <Tooltip title="See Reviews">
          <IconButton onClick={handleClickOpen}><VisibilityIcon /></IconButton>
          </Tooltip>
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Reviews for this TweetCode
              </Typography>
            </Toolbar>
        </AppBar>
        <Grid container
                spacing={3}
                alignItems="center">
                {
                rows.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(row => {
                        return(
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
                            row.review
                        } </Typography>
                        <Typography className={
                                classes.pos
                            }
                            color="textSecondary"
                            component='div'>
                            {
                            row.owner
                        } </Typography>
                        <Typography className={
                                classes.title
                            }
                            color="textPrimary"
                            gutterBottom
                            component={'div'}>
                            Score: {
                            row.score
                        } </Typography>
                    </CardContent>
                
                </Card>
            </Grid>
          );
          })
              } 
         
        </Grid>
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
      </Dialog>
      </>
    );

}
export default TweetModal;
