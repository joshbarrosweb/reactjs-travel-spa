import * as React from "react";
import axios from "axios";

import Map, { FullscreenControl, Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";

import "./App.css";

import Login from "./components/login";
import Register from "./components/register";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = React.useState(null);
  const [pins, setPins] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);

  const [title, setTitle] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [rating, setRating] = React.useState(0);

  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  const [mapProps, setMapProps] = React.useState({
    latitude: -22.833939029014687,
    longitude: -43.38916320179018,
    zoom: 10,
  });

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get("/pins");
        setPins(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, latitude, longitude) => {
    setCurrentPlaceId(id);
    setMapProps({ zoom: 4, latitude, longitude }); // map should move towards clicked pin (doesnt work)
  };

  const handleAddClick = (e) => {
    const { lat, lng } = e.lngLat;

    setNewPlace({
      lat,
      lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      description,
      rating,
      latitude: newPlace.lat,
      longitude: newPlace.lng,
    };

    try {
      const response = await axios.post("/pins", newPin);
      setPins([...pins, response.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      initialViewState={mapProps}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={handleAddClick}
    >
      {pins.map((p) => (
        <div key={p._id}>
          <Marker
            latitude={p.latitude}
            longitude={p.longitude}
            offsetLeft={-mapProps.zoom * 3.5}
            offsetTop={-mapProps.zoom * 3.5}
          >
            <RoomIcon
              style={{
                fontSize: mapProps.zoom * 7,
                color: "slateblue",
                cursor: "pointer",
              }}
              onClick={() => handleMarkerClick(p._id, p.latitude, p.longitude)}
            />
          </Marker>

          {p._id === currentPlaceId && (
            <Popup
              latitude={p.latitude}
              longitude={p.longitude}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={() => setCurrentPlaceId(null)}
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="description">{p.description}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<StarIcon className="star" />)}
                </div>
                <label>Information</label>
                <span className="username">
                  Created by <b>{p.username}</b>
                </span>
                <span className="date">{p.createdAt}</span>
              </div>
            </Popup>
          )}
        </div>
      ))}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.lng}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder="Enter a Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                placeholder="Say us something about this location."
                onChange={(e) => setDescription(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">
                Add Pin
              </button>
            </form>
          </div>
        </Popup>
      )}

      {currentUser ? (
        <div className="buttons">
          <button className="button logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      <FullscreenControl />
    </Map>
  );
}

export default App;
