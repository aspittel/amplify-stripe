/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["stripe_key"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	AUTH_MEMBERSHIPSITE2F91F61B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const aws = require('aws-sdk')

// declare a new express app
const app = express()
app.use(bodyParser.json({
  verify: function (req, res, buf) {
    req.rawBody = buf.toString()
  }
}))
app.use(awsServerlessExpressMiddleware.eventContext())

const getStripeKey = async () => {
  const { Parameters } = await (new aws.SSM())
    .getParameters({
      Names: ['stripe_key'].map(secretName => process.env[secretName]),
      WithDecryption: true
    })
    .promise()
  return Parameters[0].Value
}
// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

app.post('/webhook', async function (req, res) {
  // Add your code here
  const stripeKey = await getStripeKey()
  const stripe = require('stripe')(stripeKey)
  const customer = await stripe.customers.retrieve(req.body.data.object.customer)
  const userEmail = customer.email

  const cognito = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' })

  cognito.adminCreateUser({
    UserPoolId: process.env.AUTH_MEMBERSHIPSITE2F91F61B_USERPOOLID,
    Username: userEmail,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      { Name: 'email', Value: userEmail }
    ],
    ValidationData: [
      { Name: 'email', Value: userEmail }
    ]
  }, function (err, data) {
    if (err) console.log(err, err.stack)
    else {
      console.log(data)
      res.sendStatus(200)
    }
  })
})

app.listen(3000, function () {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
