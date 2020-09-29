import React, { useState, useContext } from 'react';
import CardsPublic from './components/cardsPublic';
import CardsUser from './components/cardsUsers'
import { makeStyles  } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Nav from './components/Nav';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { CurrentUser } from './models/CurrentUser';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';

export default function Tweets() {
    const [page, setPage] = useState('Public Tweets')
    const { currentUid } = useContext(CurrentUser)


    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1
        },
        fab: {
            margin: theme.spacing(2),
            backgroundColor: "#1589FF"
        },
        absolute: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(3)
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120
        },
    }));
    const handlePageChange = (event, newPage) => {
        setPage(event.target.value);
    }
    const classes = useStyles();
    return (
        <>
            <Nav></Nav>
            <Typography variant="h3" component="h2" align="center">
                {page}
                <Tooltip title="Create">
                    <Fab className={
                            classes.fab
                        }
                        href="/create">
                        <AddIcon/></Fab>
                </Tooltip>
            </Typography>

            {currentUid !== null ? 
                <>
                    <Container maxWidth="md"
            className={
                classes.root
        }>
                         <Grid container spacing={2} direction="column" alignItems="flex-end">
            <Grid item>
            <FormControl className={
                            classes.formControl
                        }>
                            <InputLabel id="page-change-label">Filter</InputLabel>
                            <Select labelId="page-change-label" id="page-change-select"
                                value={page}
                                onChange={handlePageChange}>
                                <MenuItem value={'Public Tweets'}>Public Tweets</MenuItem>
                                <MenuItem value={'Your Tweets'}>Your Tweets</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                    </Grid>
                    </Container>
            <div id="Tweets">
                {page === 'Public Tweets' ?
                        <CardsPublic></CardsPublic>

                    : (page === 'Your Tweets') ?
                        <CardsUser></CardsUser>
                                :
                         
                         <CardsPublic></CardsPublic>}
                    </div>
                    </>
            :
                <>
                    <div id="Tweets">
                    <CardsPublic></CardsPublic>
                        </div>
                </>}
        </>
    );
}
