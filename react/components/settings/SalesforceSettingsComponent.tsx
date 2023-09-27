import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Input } from 'vtex.styleguide'

import {
  REDIRECT_URI,
  URI_ADD_CREDENTIALS_SALESFORCE,
  URI_CONFIGURATION_SALESFORCE,
  URI_GET_PARAMETERS,
  URI_SALESFORCE_AUTHORIZE,
} from '../../utils/constans'

const SalesforceSettingsComponent: React.FC = () => {
  const [data, setData] = useState({
    isModalOpen: false,
    accountSalesforce: '',
    clientId: '',
    clientSecret: '',
  })

  const [responseSettings, setresponseSettings] = useState('')
  const [responseAddCredentials, setresponseAddCredentials] = useState('')

  useEffect(() => {
    axios
      .get(URI_GET_PARAMETERS)
      .then((response) => {
        setData({
          ...response.data,
          isModalOpen: false,
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const handleOpenModal = () => {
    setData({
      ...data,
      isModalOpen: true,
    })
  }

  const handleCloseModal = () => {
    setData({
      ...data,
      isModalOpen: false,
    })
  }

  const handleInputChange = (e: {
    target: { name: string; value: string }
  }) => {
    const { name, value } = e.target

    setData({
      ...data,
      [name]: value,
    })
  }

  const handleCredentials = () => {
    axios
      .post(URI_ADD_CREDENTIALS_SALESFORCE, data)
      .then(() => {
        setresponseAddCredentials('Credentials have been added successfully')
      })
      .catch((error) => {
        console.error(error)
      })

    setData({
      ...data,
      isModalOpen: false,
    })
  }

  const handleLogin = () => {
    const { host } = window.location

    const authUrl = `${URI_SALESFORCE_AUTHORIZE}?response_type=code&client_id=${data.clientId}&redirect_uri=https://${host}${REDIRECT_URI}`

    window.open(authUrl, '_blank', 'width=600,height=600')
  }

  const handleSettings = () => {
    axios
      .post(URI_CONFIGURATION_SALESFORCE, data)
      .then(() => {
        setresponseSettings('Configuration process executed successfully')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div>
      <div className="mb6">
        <Button onClick={handleOpenModal}>Add Salesforce Credentials</Button>
        <p>{responseAddCredentials}</p>
      </div>

      <hr />

      <div className="mt6 mb6">
        <Button onClick={handleLogin}>Login Salesforce</Button>
      </div>

      <hr />

      <div className="mt6">
        <Button onClick={handleSettings}>Create Salesforce Settings</Button>
        <p>{responseSettings}</p>
      </div>

      <Modal
        isOpen={data.isModalOpen}
        title="Returns Settings"
        responsiveFullScreen
        bottomBar={
          <div className="nowrap">
            <span className="mr4">
              <Button variation="tertiary" onClick={handleCloseModal}>
                Cancel
              </Button>
            </span>
            <span>
              <Button variation="primary" onClick={handleCredentials}>
                Add Credentials
              </Button>
            </span>
          </div>
        }
        onClose={handleCloseModal}
      >
        <div>
          <div className="w-100 mv6">
            <Input
              type="text"
              value={data ? data.accountSalesforce : ''}
              name="accountSalesforce"
              placeholder="Account Salesforce"
              size="large"
              label="Account Salesforce"
              onChange={handleInputChange}
            />
          </div>
          <div className="w-100 mv6">
            <Input
              type="text"
              value={data ? data.clientId : ''}
              name="clientId"
              placeholder="Client Id"
              size="large"
              label="Client Id"
              onChange={handleInputChange}
            />
          </div>
          <div className="w-100 mv6">
            <Input
              type="password"
              value={data ? data.clientSecret : ''}
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

export default SalesforceSettingsComponent
