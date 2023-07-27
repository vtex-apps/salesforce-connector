import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageHeader,PageBlock } from 'vtex.styleguide'

import './styles.global.css'

const AuthenticationSalesforce = () => {
  return (
    <Layout fullWidth={true}
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-authentication-salesforce.title" />}
        />
      }
    >
       <PageBlock variation="full"></PageBlock>
    </Layout>
  )
}

export default AuthenticationSalesforce
