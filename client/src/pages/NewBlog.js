import React,{useState, useEffect} from "react";
import ReactMarkdown from 'react-markdown';
import { useNavigate } from "react-router-dom";
import "../style/NewBlog.css";



export default function NewBlog(props){
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    const [info, setMessage] = useState({});

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []);

    const handlePost = async () => {
        console.log("Posting blog");
        const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/postBlog`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content,
                title: title
            })
        });
        if(!response.ok){
            console.log("Network response was not ok");
            alert("Network response was not ok");
            return;
        }
        const data = await response.json();
        if(data.success){
            console.log(data);
            alert("Blog posted successfully");
            navigate('/blogs');
        }
        else{
            alert("Error posting blog : " + data.error);
            navigate('/dashboard');
        };
    }

    useEffect(()=>{
        if(info.loggedIn === false){
            navigate('/dashboard');
        }
    }, [info.loggedIn])

    return(
        <div className="blog-container">
            <div className="header grid grid-cols-3 pt-4 mx-6">
                <button className="HSbtn max-w-[9em]" onClick={()=>navigate('/blogs')}>DashBoard</button>
                <h1 className="header-title">New Blog</h1>
                <div></div>
            </div>
            <div className="flex flex-row justify-center">
                <input 
                    type="text" 
                    className="form-control mx-4 mb-4" 
                    placeholder="Enter title here" 
                    onChange={(e)=>setTitle(e.target.value)} 
                    value={title}
                />
            </div>
            <div className="content flex flex-col">
                <div className="input-area flex flex-row justify-center">
                    <textarea 
                    className="form-control mx-4"
                    placeholder="Enter markdown here"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
                <div className="text-center text-3xl font-medium mt-10">Preview</div>
                <div className="markdown-display flex flex-row justify-center mx-4">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
            <div className="flex flex-row justify-center mt-6">
                <button className="HSbtn" onClick={handlePost}>Post</button>
            </div>
        </div>
    )
}