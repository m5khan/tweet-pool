import React from "react";
import "../styles/detailPane.css"

interface IProps {
    [key:string]: any
}

const DetailPane = (props:IProps) => (
    <div className="detail">
        {(props.tweetDetail ? JSON.stringify(props.tweetDetail) : '')}
    </div>
)

export default DetailPane;