import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'

import './styles.global.css'
import AuthenticationSalesforceManagement from './components/authentication/AutehenticationSalesforceManagement'

const AuthenticationSalesforce = () => {
  return (
    <Layout fullWidth={true}
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-authentication-salesforce.title" />}
        />
      }
    >
       <PageBlock variation="full">
        <AuthenticationSalesforceManagement></AuthenticationSalesforceManagement>
       </PageBlock>
    </Layout>
  )
}

export default AuthenticationSalesforce
