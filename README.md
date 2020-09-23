user/signup:
  request:
    body:
      - email
      - password
      - firstName
      - lastName
  respond:
    status: 200
    body:
      - email
      - password
      - firstName
      - lastName
  errors:
    badRequest:
      status: 400
      body:
        message: [ 'invalid_email' | 'invalid_password' | 'invalid_firstname' | 'invalid_lastname' ]
    dupEmail:
      status: 500
      body:
        message: 'duplicate_email'
    internalError:
      status: 500
      body:
        message: 'internal_server_error'

user/login:
  request:
    body:
      - email
      - password
  respond:
    status: 200
    body:
      - email
      - firstName
      - lastName
  errors:
    badRequest:
      status: 400
      body:
        message: [ 'invalid_email' | 'invalid_password' ]
    badCredentials:
      status: 401
      body:
        message: 'invalid_credentials'
    internalError:
      status: 500
      body:
        message: 'internal_server_error

connection/add:
  request:
    body:
      userId
      connections:
        - name: <string>, linkedUsername: <string>
  respond:
    status: 200
    body:
      - email
      - firstName
      - lastName
  errors:
    badRequest:
      status: 400
      body:
        message: [ 'invalid_email' | 'invalid_password' ]
    badCredentials:
      status: 401
      body:
        message: 'invalid_credentials'
    internalError:
      status: 500
      body:
        message: 'internal_server_error'