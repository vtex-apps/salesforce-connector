import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Input } from 'vtex.styleguide';

const AuthenticationSalesforceManagement = () => {
  const [data, setData] = useState({
    isModalOpen: false,
    userName: '',
    password: '',
    clientId: '',
    clientSecret: ''
  });
  
  const handleOpenModal = () => {
    setData({
      ...data,
      isModalOpen: true
    })
  }

  const handleCloseModal = () => {
    setData({
      ...data,
      isModalOpen: false
    })
  }

  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  }

  const handleSubmit = () => {
    axios.post('https://salesforcetest--felipedev.myvtex.com/v1/vtex/authenticate', data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    
    setData({
      ...data,
      isModalOpen: false
    });
  };

  return (
    <div>
      <Button onClick={handleOpenModal}>Login</Button>

      <Modal
        isOpen={data.isModalOpen}
        title="Iniciar sesión"
        responsiveFullScreen
        bottomBar={
          <div className="nowrap">
            <span className="mr4">
              <Button variation="tertiary" onClick={handleCloseModal}>
                Cancel
              </Button>
            </span>
            <span>
              <Button variation="primary" onClick={handleSubmit}>
                Send
              </Button>
            </span>
          </div>
        }
        onClose={handleCloseModal}>
        <div>
          <div className="w-100 mv6">
            <Input
              type="text"
              name="userName"
              placeholder="UserName"
              size="large"
              label="Username"
              onChange={handleInputChange}
            />
          </div>
          <div className="w-100 mv6">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              size="large"
              label="Password"
              onChange={handleInputChange}
            />
          </div>
          <div className="w-100 mv6">
            <Input
              type="text"
              name="clientId"
              placeholder="Client Id"
              size="large"
              label="Client Id"
              onChange={handleInputChange}
            />
          </div>
          <div className="w-100 mv6">
            <Input
              type="text"
              name="clientSecret"
              placeholder="Client Secret"
              size="large"
              label="Client Secret"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AuthenticationSalesforceManagement;
