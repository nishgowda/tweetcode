import React from 'react';
import axios from "axios";
import {useParams} from "react-router-dom";

export default class DeleteTweet extends React.Component {

    deleteTweets() {
        const { cid } = useParams()
        
        axios({
            method: 'delete',
            url: '/api/tweets/' + cid,
            withCredentials: true
        }).then(function (response) {
            window.location.href = '/'
        }).catch(function (error) {
            console.log(error)
            alert(error);
        });
    }
    render() {
        return (
            <div>{
                this.deleteTweets()
            }</div>
        )
    }

}
