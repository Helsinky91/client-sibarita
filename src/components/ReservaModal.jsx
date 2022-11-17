import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createReservaService } from "../services/restaurant.services";

function ReservaModal() {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState("");
  const [hour, setHour] = useState("");
  const [pax, setPax] = useState(1);
  const [hasConsumed, setHasConsumed] = useState(false); //has not been used yet due to lack of time to implement comments, not deleted for a future use
  const [errorMessage, setErrorMessage] = useState("");
  const { restId } = useParams();
  const [show, setShow] = useState(false);
  //once you close down the reserve modal, does not only hide the modal, but makes sure the input fields for the reserve are empty again
  const handleClose = () => {
    setFecha("");
    setHour("");
    setPax("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  //tracks the changes being made on the input fields to change the state
  const handleFechaChange = (e) => setFecha(e.target.value);
  const handleHourChange = (e) => setHour(e.target.value);
  const handlePaxChange = (e) => setPax(e.target.value);
 //Handles the creation of a reservation on a restaurant and once done, closes the modal so you can keep looking at the restaurant details
  const handleReserve = async (e) => {
    e.preventDefault();

    const newReserve = {
      fecha: fecha,
      hour: hour,
      pax: pax,
      hasConsumed: hasConsumed,
    };

    try {
      await createReservaService(newReserve, restId);

      handleClose();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        navigate("/error");
      }
    }
  };
  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Haz tu reserva
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Haz tu reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form onSubmit={handleReserve}>
            <fieldset>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="disabledTextInput">Día:</Form.Label>
                <Form.Control
                  id="disabledTextInput"
                  type="date"
                  name="fecha"
                  value={fecha}
                  onChange={handleFechaChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="disabledTextInput">Hora:</Form.Label>
                <Form.Control
                  id="disabledTextInput"
                  type="time"
                  name="hour"
                  value={hour}
                  onChange={handleHourChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="disabledTextInput">
                  Nº de comensales:
                </Form.Label>
                <Form.Control
                  id="disabledTextInput"
                  type="number"
                  name="pax"
                  max="15"
                  min="1"
                  value={pax}
                  onChange={handlePaxChange}
                />
              </Form.Group>

              {errorMessage !== "" && <p>{errorMessage}</p>}
            </fieldset>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleReserve}>
            Reservar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReservaModal;
