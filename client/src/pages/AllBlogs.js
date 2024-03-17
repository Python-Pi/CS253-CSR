import React,{useState, useEffect} from "react";
import BlogCell from "../components/BlogCell";
import { useNavigate } from "react-router-dom";


export default function AllBlogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [info, setMessage] = useState({});
    const [search, setSearch] = useState("");
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    const fetchAllBlogs = async () => {
        console.log("Fetching all blogs");
        const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/getAllBlogs`, {
            credentials: 'include',
        });
        if(!response.ok){
            console.log("Network response was not ok");
            return;
        }
        const data = await response.json();
        if(data.success){
            console.log(data);
            setBlogs(data.blogs);
        }
        else{
            console.log("Error fetching blogs");
        };
    };

    

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []); 

        
    useEffect(() => {
        console.log("Fetching all blogs");
        console.log(info);
        if(info.loggedIn){
            fetchAllBlogs();
        }
        else
        {
            console.log("Not logged in");
            if(info.loggedIn === false){
                navigate('/dashboard');
            }
        }
    },[info.loggedIn]);

    useEffect(() => {
        const results = blogs.filter(blog =>
            blog.title.toLowerCase().includes(search.toLowerCase()) ||
            blog.content.toLowerCase().includes(search.toLowerCase()) ||
            blog.user_name.toLowerCase().includes(search.toLowerCase())
        );
    
        setFilteredBlogs(results);
    }, [search, blogs]);

    // if(!info.loggedIn){
    //     navigate('/dashboard');
    //     return;
    // }
    // else
    // {
    //     return(
    //         <div>
    //             <button onClick={()=>navigate('/dashboard')}>DashBoard</button>
    //             <input 
    //             type="text" 
    //             placeholder="Search" 
    //             value={search}
    //             onChange={(e) => setSearch(e.target.value)}
    //             />
    //             {/* {filteredBlogs} */}
    //             {filteredBlogs.map((blog, index) => (
    //                 <BlogCell key={index} user_name={blog.user_name} content={blog.content} />
    //             ))}
    //         </div>
    //     )   
    // }
    return (
        <div>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                DashBoard
            </button>
            <button className="btn btn-primary" onClick={()=>navigate('/blogs/newBlog')}>New Blog</button>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input
                type="text"
                placeholder="Search"
                value={search}
                style={{ width: '40vw' }}
                className="form-control"
                onChange={(e) => setSearch(e.target.value)}
            />
            </div>
            {filteredBlogs.map((blog, index) => (
                <BlogCell key={index} user_name={blog.user_name} content={blog.content} title={blog.title} date={blog.created_at}/>
            ))}
        </div>
    );  
}