import React, { useState } from "react";
import { makeStyles, Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {useParams} from "react-router-dom";
import RateReviewIcon from '@material-ui/icons/RateReview';
import { IconButton } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';
import {CurrentUser} from '../models/CurrentUser'
const useStyles = makeStyles({
    root: {
        width: 500,
        height: 400
    },
    textArea: {
        width: 400,
    },
    input: {
      width: 400,
    },
  });
  
const ReviewModal = () => {
    const classes = useStyles();
    const [review, setReview] = useState('');
    const [score, setScore] = useState(0);
    const [open, setOpen] = useState(false);
    const { cid } = useParams()
    const {currentUid} = React.useContext(CurrentUser)
    const handleReview = (event) => {
        setReview(event.target.value);
    }

    const handleScore = (event, newValue) => {
        setScore(newValue)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }


    const handleCloseSubmit = (event) => {
        event.preventDefault();
        setOpen(false);
            var data = {
                review: review,
                score: score,
                cid: cid,
                owner_id: currentUid
            }
            axios({
                method: 'post',
                url: '/api/reviews/',
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                alert('Your review was saved!')
            }).catch(function (error) {
                console.log(error.response);
            });
        }


    return (
        <div >
                    <Tooltip title="Write a Review">
                <IconButton onClick={handleClickOpen}><RateReviewIcon /></IconButton>
                </Tooltip>
            <Dialog open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Review</DialogTitle>
                <DialogContent className={classes.root}>
                <DialogContentText component="div">
                        Write a Review for this TweetCode
                    </DialogContentText>
                    <Grid container alignItems="center" spacing={3}>
                    
                        <Grid item >
                            <TextField value={review}
                            className={classes.textArea}
                            onChange={handleReview}
                            multiline
                            label="Review" />
                        </Grid>
                        <Grid item>
                        <Typography id="discrete-slider-small-steps" gutterBottom>
                        Score
                        </Typography>
                       
                        </Grid>
                    </Grid>
                    <Slider
                            defaultValue={score}
                            onChange={handleScore}
                            aria-labelledby="discrete-slider-small-steps"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            valueLabelDisplay="auto"
                        />
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
        </div>
    );

}
export default ReviewModal;
