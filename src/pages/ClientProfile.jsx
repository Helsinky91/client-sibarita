import React from "react";
import { useEffect, useState } from "react";
import { getUserService, editUserService } from "../services/user.services";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DeleteUserModal from "../components/DeleteUserModal";

function ClientProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
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

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const updateUser = {
        username: username,
        phoneNumber: phoneNumber,
        email: email,
      };

      await editUserService(updateUser, userId);
      handleClose()
    } catch (error) {
      navigate("/error");
    }
  };
  return (
    <div>
      <h1>Nombre de usuario: {username}</h1>
      <h4>Número de telefono: {phoneNumber}</h4>
      <h4>Dirección de correo:{email}</h4>
      <Button variant="primary" onClick={handleShow}>
        Edit Information
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form onSubmit={handleEdit}>
            <fieldset>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="disabledTextInput">
                  Nombre usuario:{" "}
                </Form.Label>
                <Form.Control
                  id="disabledTextInput"
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="disabledTextInput">
                  Número de teléfono:{" "}
                </Form.Label>
                <Form.Control
                  id="disabledTextInput"
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="disabledTextInput">
                  E-mail:
                </Form.Label>
                <Form.Control
                  id="disabledTextInput"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Form.Group>
              {errorMessage !== "" && <p>{errorMessage}</p>}
            </fieldset>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Editar
          </Button>
          <DeleteUserModal/>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ClientProfile;
