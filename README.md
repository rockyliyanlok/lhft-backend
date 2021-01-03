# lhft-backend
A backend service generate symbols pricing and handle client connection.

# Run the service locally
```
# git clone https://github.com/rockyliyanlok/lhft-backend.git
# cd lhft-backend
# npm install --save
# DEBUG=lhft-backend:* npm run start
```

# Run eslint before commit
```
# npm run eslint
```

# Demo (heroku deployment)
The backend service is deployed to heroku for demo:  
https://lhft-backend.herokuapp.com/

# API endpoints

## SSE subscribe endpoint
__Method__: `GET`  
__Path__: `/subscribe`  
__Description__: An endpoint for client side to subscribe Server Side Event  

## Retrieve config
__Method__: `GET`  
__Path__: `/config`  
__Description__: An endpoint for client side to get current configuration on server
__cURL__:  
```
curl -X GET \
  https://lhft-backend.herokuapp.com/config \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: lhft-backend.herokuapp.com' \
  -H 'cache-control: no-cache'
```
__Sample result__:  
```json
{
  "symbols": [
    "AAAA",
    "BBBB",
    "CCCC",
    "DDDD",
    "EEEE",
    "FFFF"
  ],
  "update_frequency_milliseconds": 200,
  "elements_per_update": 2
}
```

## Update config
__Method__: `POST`  
__Path__: `/config`  
__cURL__:  
```
curl -X POST \
  https://lhft-backend.herokuapp.com/config \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 161' \
  -H 'Content-Type: application/json' \
  -H 'Host: lhft-backend.herokuapp.com' \
  -d '{
  "symbols": [
    "BBBB",
    "AAAA",
    "CCCC",
    "DDDD",
    "EEEE",
    "FFFF"
  ],
  "update_frequency_milliseconds": 200,
  "elements_per_update": 2
}'
```
__Description__: An endpoint for client side to update current configuration on server

## Retrieve history data
__Method__: `GET`  
__Path__: `/history`  
__Params__:  
| key | description | required | sample |
| :---: | :---: | :---: | :---: |
| symbol | get historical data with specific symbol | YES | 'AAAA' |
| start | get historical data after `start` timestamp | NO | 1609660379000 |
| end | get historical data before `end` timestamp | NO | 1609760383000 |  

__Description__: An endpoint for client side to get historical data  
__cURL__:  
```
curl -X GET \
  'https://lhft-backend.herokuapp.com/history?symbol=AAAA&start=1609660379000&end=1609760383000' \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: lhft-backend.herokuapp.com' \
  -H 'cache-control: no-cache'
```
__Sample result__:  
```json
{
  "status": 200,
  "histories": [
    {
      "symbol": "AAAA",
      "price": 81146,
      "__v": 0,
      "createdAt": "2021-01-03T08:11:34.512Z"
    },
    {
      "_id": "5ff17c376857de0017d75ceb",
      "symbol": "AAAA",
      "price": 62689,
      "__v": 0,
      "createdAt": "2021-01-03T08:11:35.518Z"
    },
    {
      "_id": "5ff17c386857de0017d75cf3",
      "symbol": "AAAA",
      "price": 83130,
      "__v": 0,
      "createdAt": "2021-01-03T08:11:36.514Z"
    }
  ]
}
```
