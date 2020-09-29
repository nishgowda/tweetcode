import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Tweets from './Tweets';
import Create from './Create';
import Update from './Show'
import Login from './Login'
import Delete from './DeleteTweet'
import Register from './Register'
import CardsSearch from './components/cardsSearch'
import ForgotPass from './ForgotPass';
import Reset from './Reset';
import NotFound from './NotFound';
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';
import { Type } from './models/Type'

export default function App() {

    const {type} = React.useContext(Type)
    const theme = createMuiTheme({
        palette: {
            type: type
        }
    });

    return (

    

        <main>
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <Switch>
                <Route path="/"
                    component={Tweets}
                    exact/>
                <Route path="/login"
                    component={Login}
                    exact />
                <Route path="/register"
                    component={Register}
                    exact />
                <Route path="/tweet/:cid"
                    component={Update}
                        exact />
                <Route path="/reviews/:uid"
                    component={Update}
                    exact/>
                <Route path="/delete/:cid"
                    component={Delete}
                    exact/>
                <Route path="/create"
                    component={Create}
                    exact />
                <Route path="/search/:qid"
                    component={CardsSearch}
                        exact />
                    <Route exact path="/reset/:token"
                    component={Reset}
                    />
                    <Route path="/forgotpassword"
                    component={ForgotPass}
                        exact />
              <Route path="*" component={NotFound} status={404} />

                </Switch>
                </ThemeProvider>
        </main>
    )
}
