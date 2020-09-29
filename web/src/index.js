import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import CurrentUser from './models/CurrentUser'
import AllTweets from './models/Tweets'
import  { TypeProvider } from './models/Type';

ReactDOM.render (
    <BrowserRouter>
        <CurrentUser>
            <AllTweets>
                <TypeProvider>
                    <App></App>
                    </TypeProvider>
            </AllTweets>
        </CurrentUser>
    </BrowserRouter>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
