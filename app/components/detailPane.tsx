import React from "react";

interface IProps {
    [key:string]: any
}

const DetailPane = (props:IProps) => (
    <div>
        {JSON.stringify(props.tweetDetail)}
    </div>
)

export default DetailPane;