import React from "react";
import ReactMarkdown from 'react-markdown';

export default function BlogCell(props){
    console.log("BlogCell create with props: ", props);
    const {user_name, content, title, date} = props;

    return (
        <>
            <div className="bg-gray-200 p-4 rounded-lg" style={{ width: "60vw" }}>
                <h2>{title}</h2>
                <div
                    className="content"
                >
                    <ReactMarkdown>
                        {content}
                    </ReactMarkdown>
                </div>
                <div className="text-gray-500" style={{ textAlign: "right", fontSize: "12px" }}>Posted by: {user_name}</div>
                <div className="text-gray-500" style={{ textAlign: "right", fontSize: "12px" }}>Posted on: {date.split('T')[0]}</div>
            </div>
            <br />
        </>
    );
}