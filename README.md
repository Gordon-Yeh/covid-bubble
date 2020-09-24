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
**Body**
```
{
  "token": ""
}
```
### Error Response
**Status** : `400`    
**Condition** : the format of the inputs were invalid  
**Body**:
```
{
  "errors": [ "invalid_email" | "invalid_password" | "invalid_firstname" | "invalid_lastname" ]
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
**Body**
```
{
  "token": "",
  "user": "",
  "connections": ""
}
```
### Error Response
**Status** : `400`    
**Condition** : the format of the inputs were invalid  
**Body**:
```
{
  "errors": [ "invalid_email" | "invalid_password" ]
}
```
**Status** : `401`    
**Condition** : the email or password was incorrect  
**Body**:
```
{
  "errors": [ "invalid_credentials" ]
}
```

## Add Connections
Add first degree connections to user's network.  

**URL** : `/connection/add`  
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
  "connections": {
    "[linkedUsername1]": [
      {
        "name": "[name_of_user1_in_network]",
        "username": "[username_of_user1_in_network]"
      },
      ...
    ],
    "[linkedUsername2]": [ ... ],
    "[name_of_user1_in_network]": [ ... ]
    ...
  }
}
```
### Error Response
**Status** : `400`    
**Condition** : the format of the inputs were invalid  
**Body**:
```
{
  "errors": [ "invalid_email" | "invalid_password" ]
}
```
**Status** : `401`    
**Condition** : invalid token  
**Body**:
```
{
  "errors": [ "unauthorized" ]
}
```

## Get Connections
Get the user's entire network.  

**URL** : `/connection/get`  
**Method** : `GET`  
**Auth required** : YES  
### Success Response
**Status** : `200`  
**Details** : returns a adjacency list of your entire network  
**Body**
```
{
  "connections": {
    "[your_username]": [
      {
        "name": "[name_of_user1_in_network]",
        "username": "[username_of_user1_in_network]"
      },
      ...
    ],
    "[username_of_user1_in_network]": [ ... ],
    "[username_of_user2_in_network]": [ ... ],
    ...
  }
}
```
### Error Response
**Status** : `401`    
**Condition** : invalid token  
**Body**:
```
{
  "errors": [ "unauthorized" ]
}
```