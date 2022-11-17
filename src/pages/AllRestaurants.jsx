import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAllRestaurantsService } from "../services/restaurant.services";
import { MoonLoader } from "react-spinners";

function AllRestaurants() {
  const navigate = useNavigate();

  const [list, setList] = useState();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      let response = await getAllRestaurantsService();
      setList(response.data);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
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
    <div style={{ padding: "35px" }}>
      <Row xs={1} md={2} className="g-4">
        {list.map((eachRestaurant) => {
          return (
            <Col key={eachRestaurant._id}>
              <Card style={{ border: "2px solid grey", borderRadius: "10px", display: 'flex', alignItems: 'center' }}>
                <img
                  src={eachRestaurant.photos}
                  alt="img-restaurant"
                  width={"450px"}

                />
                <Card.Title>{eachRestaurant.name}</Card.Title>
                <Card.Body>
                  <Card.Text key={eachRestaurant._id}>
                    Ubicacion: {eachRestaurant.location}
                  </Card.Text>{" "}
                  <Link to={`/restaurant/${eachRestaurant._id}`}>
                    <Button>Más información</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default AllRestaurants;
