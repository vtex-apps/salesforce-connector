import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Input } from 'vtex.styleguide';

const ApplicationSettingsComponent: React.FC = () => {
  const [data, setData] = useState({
    isModalOpen: false,
    userName: '',
    password: '',
    clientId: '',
    clientSecret: ''
  });

  const [responseSettings, setresponseSettings] = useState('');
  
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

  const handleSettings = () => {
    axios.post('https://salesforcetest--felipedev.myvtex.com/v1/vtex/configuration', data)
      .then((response) => {
        console.log(response.data);
        setresponseSettings("Configuration process completed successfully");
      })
      .catch((error) => {
        console.error(error);
      });
    
    setData({
      ...data,
      isModalOpen: false
    });
  };

  const handleLogin = () => {
    // Lógica para realizar la autenticación con Salesforce
    const clientId = '3MVG9gtDqcOkH4PKx5GaxzwrPnOsL886NZvqUj3hQddpkMGoEXP_KVm.Sg0tW8l34hWD1amdP3Hl_X9EbLZE1'; // Reemplaza con tu Client ID
    const redirectUri = 'https://login.salesforce.com/services/oauth2/success'; // Reemplaza con tu Redirect URI

    // Construye la URL de autorización
    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
    
    // Abre una nueva ventana del navegador para la autenticación en Salesforce
    const authWindow = window.open(authUrl, '_blank', 'width=600,height=400');
    
    // Agrega un listener para detectar cuando la ventana de autenticación se cierre
    window.addEventListener('message', (event) => {
      if (event.origin === redirectUri) {
        // Extrae el token de acceso del fragmento de la URL
        const token = event.data.access_token;
        console.log(token);
        
        // Cierra la ventana de autenticación
        authWindow?.close();
      }
    });
  };

  return (
    <div>
      <div className='mb4'>
        <Button onClick={handleOpenModal}>Login</Button>
        <Button onClick={handleLogin}>Login2</Button>
      </div>

      <div className='mb4'>
        <Button onClick={handleSettings}>Save Settings</Button>
        <p>{responseSettings}</p>
      </div>

      <Modal
        isOpen={data.isModalOpen}
        title="Login"
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

export default ApplicationSettingsComponent;
