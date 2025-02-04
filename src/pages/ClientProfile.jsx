import { useEffect, useState } from "react";
import { getUserService } from "../services/user.services";
import { getReservaService } from "../services/reserva.services";
import { useNavigate, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";

import Table from "react-bootstrap/Table";
import EditProfileModal from "../components/EditProfileModal";
import DeleteReserveModal from "../components/DeleteReserveModal";
import EditReserveModal from "../components/EditReserveModal";
import { MoonLoader } from "react-spinners";

function ClientProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    getDataUser();
    getReservationList();
  }, []);
//gets all the information of the current user logged in the app and shows the data setting them on the state
  const getDataUser = async () => {
    try {
      const response = await getUserService(userId);
      const { data } = response;
      setUsername(data.username);
      setPhoneNumber(data.phoneNumber);
      setEmail(data.email);
    } catch (error) {
      navigate("/error");
    }
  };
//gets all the reservations that the logged user has done in all the restaurants 
  const getReservationList = async () => {
    try {
      let response = await getReservaService(userId);
      setReservations(response.data);
      setIsFetching(false);
    } catch (error) {
      navigate("/error");
    }
  };

  //A cool spinner when you are waiting for the data to be retrieved
  if (isFetching) {
    return (
      <div className="spinner">
        <MoonLoader color="black" size={95} speedMultiplier={0.4} />
      </div>
    );
  }
  return (
    <div>
      <div>
        <Card style={{ width: "100%", paddingTop: "30px" }}>
          <Card.Body>
            <Card.Title>Nombre de usuario: {username}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{email}</Card.Subtitle>
            <Card.Text>Número de telefono: {phoneNumber}</Card.Text>
            <Card.Link href="#">
              {" "}
              <EditProfileModal
                parentGetUserDetails={[username, phoneNumber, email]}
                parentSetUserDetails= {[setUsername, setPhoneNumber, setEmail]}
                getDataUser={getDataUser}
              />
            </Card.Link>
          </Card.Body>
        </Card>
      </div>
      <div style={{ width: "30vw", marginLeft: "20px"}}>
        <Table striped style={{color:'white',textShadow:'2px 3px black'}}>
          <thead>
            <tr>
              <th>Restaurante</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Pax</th>
            </tr>
          </thead>

          <tbody >
            {reservations.map((eachReservation) => {
              return (
                <tr key={eachReservation._id} >
                  <td style={{color:'white'}}>{eachReservation.restaurant.name}</td>
                  <td style={{color:'white'}}>{eachReservation.fecha}</td>
                  <td style={{color:'white'}}>{eachReservation.hour}</td>
                  <td style={{color:'white'}}>{eachReservation.pax}</td>
                  <td>
                    <EditReserveModal
                      parentInfo={[
                        eachReservation.fecha,
                        eachReservation.hour,
                        eachReservation.pax,
                      ]}
                      parentId={eachReservation._id}
                      parentReservation={getReservationList}
                    />{" "}
                  </td>
                  <td>
                    {" "}
                    <DeleteReserveModal
                      reservationId={eachReservation._id}
                      parentReservation={getReservationList}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ClientProfile;
