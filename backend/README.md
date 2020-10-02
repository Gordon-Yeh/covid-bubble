# REST API
## Table of Content
## Signup
Used register a user onto the service.  

**URL** : `/user/signup`  
**Method** : `POST`  
**Auth required** : NO  
**Request Body**
```
{
  "email": "",
  "password": "",
  "firstName": "",
  "lastName": ""
  "username": ""
}
```
### Success Response
**Status** : `200` 
**Headers**  
```
{
  "Set-Cookie": "cobu_sessionToken={token}; expiry={date}; Secure; HttpOnly;"
}
``` 
**Body**
```
{
  "user": <user>
}
```
### Error Response
**Status** : `400`    
**Condition** : the format of the inputs were invalid  
**Body**:
```
{
  "message": "invalid_email; invalid_password; invalid_firstname; invalid_lastname"
}
```

## Login
Used to acquire a session token with email and password credentials.  

**URL** : `user/login`  
**Method** : `POST`  
**Auth required** : NO  
**Request Body**
```
{
  "email": "",
  "password": ""
}
```
### Success Response
**Status** : `200`  
**Headers**  
```
{
  "Set-Cookie": "cobu_sessionToken={token}; expiry={date}; Secure; HttpOnly;"
}
```
**Body**
```
{
  "user": <user>,
  "bubble": <bubble>
}
```
### Error Response
**Status** : `400`    
**Condition** : the format of the inputs were invalid  
**Body**:
```
{
  "message": "invalid_email; invalid_password"
}
```
**Status** : `401`    
**Condition** : the email or password was incorrect  
**Body**:
```
{
  "message": "invalid_credentials"
}
```

## Add Connections
Add first degree connections to user's network.  

**URL** : `/user/connections`  
**Method** : `POST`  
**Auth required** : YES  
**Request Body**
```
{
  connections: [
    { "name": "", linkedUsername: "" },
    { "name": "", linkedUsername: "" },
    ...
  ]
}
```
### Success Response
**Status** : `200`  
**Details** : returns a adjacency list for the connections that were added  
**Body**
```
{
  "bubble": <bubble>
}
```
### Error Response
**Status** : `400`    
**Condition** : the format of the inputs were invalid  
**Body**:
```
{
  "message": "invalid_email; invalid_password"
}
```
**Status** : `401`    
**Condition** : invalid token  
**Body**:
```
{
  "message": "unauthorized"
}
```

## Get Connections
Get the user's entire bubble.  

**URL** : `/user/connections`  
**Method** : `GET`  
**Auth required** : YES  
### Success Response
**Status** : `200`  
**Details** : returns a adjacency list of your entire bubble  
**Body**
```
{
  "bubble": <bubble>
}
```
### Error Response
**Status** : `401`    
**Condition** : invalid token  
**Body**:
```
{
  "message": "unauthorized"
}
```

# Data Format
**Bubble**  
```
<bubble> {
  "[your_id]": [
    {
      "name": "[name_of_user1_in_bubble]",
      "id": "[id_of_user1_in_bubble]"
    },
    ...
  ],
  "[id_of_user1_in_bubble]": [ ... ],
  "[id_of_user2_in_bubble]": [ ... ],
  ...
}
```
**User**  
```
<user> {
  "email": <string>,
  "id": <string>,
  "username": <string>,
  "firstName": <string>,
  "lastName": <string>
}
```