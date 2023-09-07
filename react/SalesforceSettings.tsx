import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'

import './styles.global.css'
import SalesforceSettingsComponent from './components/settings/SalesforceSettingsComponent'

const ApplicationSettings = () => {
  return (
    <Layout fullWidth={true}
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-salesforce-settings.title" />}
        />
      }
    >
       <PageBlock variation="full">
        <SalesforceSettingsComponent></SalesforceSettingsComponent>
       </PageBlock>
    </Layout>
  )
}

export default ApplicationSettings
