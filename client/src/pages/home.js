import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBarOff";
import "../style/home.css";
import rt1 from '../Assets/rt1.png'
import lt1 from '../Assets/lt1.png'
import girl from '../Assets/girl.png'
import boy from '../Assets/boy.png'
import trvl from '../Assets/trvl.jpg'
import Footer from "../components/Footer"
import Preloader from "./preloader";
var flgcnt = 0;
function Home(){    
    const [loading,setloading] = useState(true);
    useEffect(()=>{
      if(flgcnt != 0) setloading(false);
    },[])
    useEffect(()=>{
      setTimeout(() => {
      if(flgcnt == 0)
      setloading(false);
      flgcnt = flgcnt + 1;
      },5000)
    },[])
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        loading ? <Preloader/>:
        <>
        <div className="home-page">
            <NavBar />
            {windowWidth > 768 ? (
                <div className="home-large">                    
                    <div className="home-page">
                        <h1 className='rm text-6xl text-black text-center pt-10 route-mate'>Routemate</h1>
                    </div>

                    <div className=" ">
                        <div className="rm spin flex h-screen pt-10  w-full  justify-center items-baseline">
                            <div>
                                <img src={lt1} alt="leftarrow"/>
                            </div>  
                            <div className="" >
                                <img src={rt1} alt="rightarrow"/>
                            </div>
                        </div>
                        <div className="flex absolute  mt-40 top-40 left-10 right-10 h-screen  w-full  justify-center items-baseline" id="place">
                            <div className="text-right pr-52">
                                <img src={boy} className="fade-in w-4/5  pr-20" alt="boyimg"/>
                            </div>  
                            <div>
                                <img src={girl} className="fade-in w-4/5 pl-10" alt="girlimg"/>
                            </div>
                        </div>
                        <h1 className='text-4xl -mt-20 pb-52 text-black font-serif text-center'>Find travel buddies and discover the world together</h1>
                    </div>

                    <div className="flex pt-20 pl-10 pr-20 pb-10 w-full flex-row justify-around section-2">
                    <img src={trvl} className="w-[25em] pr-10 rounded" alt="travel"/>
                    <div className="flex flex-col text-black text-justify text-base">
                            <p className="text-bold text-5xl pb-20 mr-[2em]">About Us</p>
                            <p className='text-xl mr-[2em]'>Welcome to Route Mate, your trusted travel companion for shared journeys to your home town and beyond. Connect with fellow students from IIT Kanpur and embark on safe, enjoyable trips together. Our platform features a chat function, allowing you to communicate with potential travel companions and plan your trip seamlessly. </p>
                            <p className='pt-4 text-xl mr-[2em]'>Additionally, explore our blog section for travel tips, destination guides, and inspiring stories. Want to share your own experiences? Create your own blogs and inspire others with your adventures. Join our community today and travel with confidence.</p>
                        </div>
                    </div>      
                </div>
            ) : (
                <div className="home-small">
                    <h1>Small Screen Content</h1>
                </div>
            )}

            <Footer />
        </div>
        </>
    );
}

export default Home;