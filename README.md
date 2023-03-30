## **Introduction**

This code is an implementation of a simple web application built with React and the FastAPI framework. The frontend enables the user to view and perform addition, editing and deletion; while the backend provides endpoints to listen for user actions using HTTP methods like GET, POST, DELETE, and PUT. The data for the products is stored in a JSON file.

## **Dependencies**

The code depends on several Python libraries, including:

- `fastapi`: a modern, fast web framework for building APIs
- `uvicorn`: a lightning-fast ASGI server
- `pydantic`: a library for data validation and settings management based on Python type annotations
- `random`: a library for generating random numbers
- `json`: a library for handling JSON data
- `os`: a library for interacting with the operating system

## **How to run the code**

To launch the app in your environment, follow these steps:
### Frontend
0. Clone the entire repository:
```bash
git clone https://github.com/bayareahomelander/WEICHEN-SUN-IS24-full-stack-competition-req97073.git
```
1. Navigate to the clond repository:
```bash
cd WEICHEN-SUN-IS24-full-stack-competition-req97073/frontend
```
2. Install npm:
```bash
npm install
```
3. Start the development server. This will start the app on `http://localhost:3000`:
```bash
npm start
```
Note: CORS is enabled, so you can still access the data stored in the API once you have the backend fired up, despite the API being stored on a different server (`http://localhost:8000`).

4. Open your web browser and navigate to `http://localhost:3000` to view the app. Page will be without data if backend is not up.

### Backend
To view with data in the table, you need to install the required libraries first. If you haven't already, you can do this using pip, by running the following commands in your terminal:
```bash
pip3 install fastapi
```
```bash
pip3 install uvicorn
```
```bash
pip3 install pydantic
```
Once you have installed the required libraries, create a new terminal window, navigate to the `backend` folder using the following command:
```bash
cd WEICHEN-SUN-IS24-full-stack-competition-req97073/backend
```
Run the code by excuting the following command:
```bash
uvicorn main:app --reload
```
This will start the web service on http://localhost:8000. You can then access the API and its data using a web browser. Data should display on the frontend after page refresh.

## **Endpoints**
`GET /products`: returns a list of all products in the JSON file.

`GET /products/{products_id}`: returns a single product with the specified ID.

`POST /products`: creates a new product and adds it to the JSON file.

`DELETE /products/{products_id}`: deletes the products with the specified ID from the JSON file.

`PUT /products/{products_id}`: updates the product with the specified ID in the JSON file.

## **Data model**
The data model used for the products is defined using the Pydantic library. The `Product` class defines the fields of a product and their data types:
```python
class Product(BaseModel):
    id: int
    product_name: str
    scrum_master: str
    product_owner: str
    developer_names: List[str]
    start_date: str
    methodology: str
```
Fields are as follows:

`id`: an integer representing the ID of the product

`product_name`: a string representing the name of the product

`scrum_master`: a string representing the name of the Scrum Master

`developer_names`: a list of strings representing the name of the developers working on a specific product

`start_date`: a string representing the date in "yyyy-mm-dd" format

`methodology`: a string representing the name of the methodology used for the product

## **Mock data**
The code generates mock data for the products if the `data.json` file does not exist. The `generate_mock_data` function generates a list of dictionaries, where each dictionary represents a product. The list is then saved to the `data.json` file for future use.

## **Middleware**
The web service uses a middleware provided by the FastAPI framework to enable CORS. The `CORSMiddleware` middleware adds the required headers to enable cross-origin resource sharing.

## **Error handling**
The code uses the `HTTPException` class provided by the FastAPI framework to raise exceptions for errors like a product not found. The web service returns the appropriate HTTP status code and a message explaining the error.

## **Conclusion**
This code provides a basic example of a web application using React and the FastAPI framework.
