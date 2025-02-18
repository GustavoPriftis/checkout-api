Checkout API Documentation

This API provides a checkout system that applies various promotions to the shopping cart. This documentation explains how to interact with the API, run it locally, and test it.

Base URL

Local: http://localhost:3000
Docker: Ensure that you map the container port to your host.

Endpoints

POST /api/checkout
Description:
Calculates the total amount for the items in the shopping cart while applying available promotions.

Request Body:

Send a JSON array of cart items. Each item should include the sku and the quantity.

Example Request:

[
  { "sku": "120P90", "quantity": 3 },
  { "sku": "A304SD", "quantity": 4 }
]

Example cURL Command:

curl -X POST http://localhost:3000/api/checkout -H "Content-Type: application/json" -d '[ {"sku": "120P90", "quantity": 3}, {"sku": "A304SD", "quantity": 4} ]'

Example Response:

{
  "total": 394.20,
  "items": [
    {
      "product": {
        "sku": "120P90",
        "name": "Google Home",
        "price": 49.99
      },
      "quantity": 2,
      "unitPrice": 49.99
    },
    {
      "product": {
        "sku": "A304SD",
        "name": "Alexa Speaker",
        "price": 109.50
      },
      "quantity": 4,
      "unitPrice": 98.55,
      "discount": 0.1
    }
  ],
  "promotionsApplied": [
    "Google Home promotion applied: groups of 3 cost the price of 2.",
    "Alexa Speaker promotion applied: 10% discount on all Alexa speakers."
  ]
}

Using Postman

Method: POST
URL: http://localhost:3000/api/checkout
Set the Request Body:

Go to the Body tab.
Select raw and choose JSON as the format.
Paste the following JSON:
json
Copiar
Editar
[
  { "sku": "120P90", "quantity": 3 },
  { "sku": "A304SD", "quantity": 4 }
]

Send the Request:

Observe the response and save the request in your collection for future testing or sharing with your team.

Additional Notes

Error Handling: The API returns a 500 status code with an error message if any server error occurs during checkout.
Extensibility: The API is designed to be extensible. Additional promotions can be added to the business logic in the checkout service.
Logging: Server-side logs provide details on requests and processing steps. Check the application logs for debugging and monitoring.
Testing: Unit and integration tests are included to ensure proper functionality. Feel free to run tests using your preferred NodeJS testing framework (e.g., Jest).
Build and Run Instructions

Running Locally

Install Dependencies:

npm install
Run in Development Mode:

npm run dev
The API will start on http://localhost:3000.

Build and Run:

npm run build
npm start
Running with Docker
Build the Docker Image:

docker build -t checkout-api .
Run the Container:

docker run -p 3000:3000 checkout-api
The API will be accessible at http://localhost:3000.
