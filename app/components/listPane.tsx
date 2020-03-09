import React, { ReactNode } from "react";

interface props {
    [key: string]: any
}

interface states {
    [key: string]: any
}

class ListPane extends React.Component<props,states> {

    constructor(props: React.Props<any>) {
        super(props);
    }

    render (): ReactNode {
        return (
            <div>
                {this.props.tweetList.map((e:any) => (
                    <li key={e._id} onClick={this.props.tweetClickHandler.bind(this, e._source.id)}>{e._source.text}</li>
                ))}
            </div>
        )
    }

}

export default ListPane;