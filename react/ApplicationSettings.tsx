import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'

import './styles.global.css'
import ApplicationSettingsComponent from './components/settings/ApplicationSettingsComponent'

const ApplicationSettings = () => {
  return (
    <Layout fullWidth={true}
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-application-settings.title" />}
        />
      }
    >
       <PageBlock variation="full">
        <ApplicationSettingsComponent></ApplicationSettingsComponent>
       </PageBlock>
    </Layout>
  )
}

export default ApplicationSettings
