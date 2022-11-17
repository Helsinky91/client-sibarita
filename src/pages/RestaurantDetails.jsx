import { useContext, useEffect, useState } from "react";
import { getRestaurantService } from "../services/restaurant.services";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantEdit from "../pages/RestaurantEdit";
import AllDishesModal from "../pages/AllDishesModal";
import ReservaModal from "../components/ReservaModal";
import Carousel from "react-bootstrap/Carousel";
import { AuthContext } from "../context/auth.context";
import LoginModal from "../components/LoginModal";
import { MoonLoader } from "react-spinners";
import RestaurantReservations from "../components/RestaurantReservations";

function RestaurantDetails() {
  const { user, isLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();
  const [details, setDetails] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const { restId } = useParams();

  useEffect(() => {
    getRestaurant();
  }, []);

  const getRestaurant = async () => {
    try {
      let response = await getRestaurantService(restId);
      setDetails(response.data);
      setIsFetching(false);
    } catch (error) {
      navigate("/error");
    }
  };

  if (isFetching) {
    return (
      <div className="spinner">
        <MoonLoader color="black" size={95} speedMultiplier={0.4} />
      </div>
    );
  }

  return (
    <div>
      <div id="card">
        <Carousel fade>
          {details.photos.map((eachPhoto, index) => {
            return (
              <Carousel.Item
                key={index}
                style={{ backgroundColor: "lightgrey" }}
              >
                <img
                  className="d-block w-100"
                  src={eachPhoto}
                  alt="restaurant-img"
                />
              </Carousel.Item>
            );
          })}
        </Carousel>

        <div className="personal">
          <div className="nameHolder">
            <h1>{details.name}</h1>
          </div>
        </div>
        <div className="info">
          <h3>Location: {details.location}</h3>
          <h3>Ciusin Type: {details.cuisinType}</h3>
        </div>
        <div className="info"></div>
        <div className="followers">
          <div>
            <h2> Phone Number: {details.phoneNumber}</h2>
          </div>
          <div>{/* <h6> Owner: {details.owner}</h6> */}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            paddingTop: "20px",
          }}
        >
          {isLoggedIn === true ? (
            <ReservaModal />
          ) : (
            <div>
              Para reservar
              <LoginModal />
            </div>
          )}

          {details !== undefined && (
            <AllDishesModal restaurantDetails={details} />
          )}

          {isLoggedIn === true && user.user._id === details.owner && (
            <RestaurantEdit />
          )}
          {isLoggedIn === true && user.user._id === details.owner && (
            <RestaurantReservations parentId={restId} />
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
