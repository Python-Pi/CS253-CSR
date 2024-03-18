import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaTrainSubway } from "react-icons/fa6";
import { ImAirplane } from "react-icons/im";
import Select from "react-select";

import TrainCell from "../components/trainCell";
import NavBarOn from "../components/NavBarOn";
import train_data from "../info/stations2.json";

import "../style/styles.css";
import "../style/TrainSearch.css";

export default function TrainSearch() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dateOfTravel, setDateOfTravel] = useState("");
  const [trainList, setTrainList] = useState([]);
  const [info, setMessage] = useState("");
  const [foundTrains, setFoundTrains] = useState(true);
  const [type, setType] = React.useState(1);
  const [train_options, setTrainOptions] = React.useState([]);

  useEffect(() => {
    if (type === 1) {
      document.querySelector("#train").classList.add("visible");
      document.querySelector("#plane").classList.remove("visible");
    } else if (type === 2) {
      document.querySelector("#train").classList.remove("visible");
      document.querySelector("#plane").classList.add("visible");
    }
  }, [type]);

  useEffect(() => {
    setTrainOptions(
      train_data.data.map((item) => ({
        label: `${item.name} ${item.code}`,
        value: item.code,
      }))
    );
  }, []);

  const handleButtonPress = () => {
    console.log(origin);
    console.log(destination);
    console.log(dateOfTravel);
    console.log(1234);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      origin,
      destination,
      dateOfTravel,
    };
    console.log(formData);

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP}:8000/api/getTrainsBetweenStations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setTrainList([]);
      if (!data.status) {
        alert("We are facing issues at the server. Please try again later.");
        navigate("/dashboard");
      }
      if (
        !data.success ||
        origin === null ||
        destination === null ||
        dateOfTravel === null
      ) {
        setFoundTrains(false);
        setTrainList([]);
      } else {
        setFoundTrains(true);
        setTrainList(
          data.data.map((train, index) => (
            <TrainCell
              key={index}
              train={train}
              date={dateOfTravel}
              origin={origin}
              destination={destination}
            />
          ))
        );
      }
      window.scrollTo(0, 300);
    } catch (error) {
      console.log(
        "Error while fetching data from api/getTrainsBetweenStations"
      );
    }
  };
  useEffect(() => {
    fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setMessage(data));
  }, []);

  const handleAirplane = () => {
    setType(1);
  };

  return (
    <div className="flex flex-col">
      <NavBarOn />
      <motion.div className="progress-bar" style={{ scaleX }} />
      <div className="app-container mt-20">
        {type == 1 ? (
          <motion.div
            className="query-box"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="transport-type">
              <motion.div
                className="transport-background"
                id="train"
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  setType(1);
                }}
              >
                <FaTrainSubway className="icons" name="train" />
              </motion.div>

              <motion.div
                className="transport-background"
                id="plane"
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  setType(2);
                }}
              >
                <ImAirplane className="icons" name="plane" />
              </motion.div>
            </div>

            <div className="details">
              <div className=" box from-box">
                <label htmlFor="from">From</label>
                <Select
                  options={train_options}
                  onChange={(e) => setOrigin(e.value)}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      height: "60px",
                      width: "clamp(100px, 30vw, 200px)",
                      borderRadius: "10px",
                      border: "1px solid #385de1",
                      padding: " 10px",
                      marginTop: "5px",
                      fontSize: "15px",
                    }),
                  }}
                />
              </div>
              <div className="box to-box">
                <label htmlFor="to">To</label>
                <Select
                  options={train_options}
                  onChange={(e) => setDestination(e.value)}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      height: "60px",
                      width: "clamp(100px, 30vw, 200px)",
                      borderRadius: "10px",
                      border: "1px solid #385de1",
                      padding: " 10px",
                      marginTop: "5px",
                      fontSize: "15px",
                    }),
                  }}
                />
              </div>
              <div className=" box date-box">
                <label htmlFor="date">Departure</label>
                <input
                  onChange={(e) => setDateOfTravel(e.target.value)}
                  className="pankaj-input"
                  type="date"
                  name="date"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="submit-button"
              onClick={handleSubmit}
            >
              search
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="query-box"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div className="transport-type">
              <motion.div
                className="transport-background"
                id="train"
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  setType(1);
                }}
              >
                <FaTrainSubway className="icons" name="train" />
              </motion.div>

              <motion.div
                className="transport-background"
                id="plane"
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  setType(2);
                }}
              >
                <ImAirplane className="icons" name="plane" />
              </motion.div>
            </div>

            <div className="details">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="submit-button-airplane"
                onClick={handleAirplane}
              >
                Still Under Development
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="HSTCbody flex flex-col pt-10 ">
        {!foundTrains && <div>No trains found</div>}
        {trainList}
      </div>
    </div>
  );
}
