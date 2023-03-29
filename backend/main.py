from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import random
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import uvicorn

app = FastAPI(prefix = "/api")
mock_data = []

# Allow cross-origin resource sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data model
class Product(BaseModel):
    id: int
    product_name: str
    scrum_master: str
    product_owner: str
    developer_names: List[str] # This is wrapped in a list since there would be up to 5 names
    start_date: str
    methodology: str
        
# Randomly generate a list of developer names
def random_name_list(names):
    num_names = random.randint(1,5)
    return random.sample(names, num_names)

# The function first checks if there exists a data file. If the file does exist, read the file; else create a new one
def generate_mock_data(num_products: int) -> List[dict]:
    data_file = "data.json"
    if os.path.exists(data_file):
        with open(data_file, "r") as f:
            data = json.load(f)
    else:
        data = []
        names = ["Alice", "Bob", "Charlie", "Dave", "Eve"]
        num_devs = random.randint(1,5)
        
        for i in range(1, num_products + 1):
            product = {
                "id": i,
                "product_name": f"Product {i}",
                "scrum_master": random.choice(['John', 'Appleseed', 'Paco', 'n/a']), # Randomly select from one of four
                "product_owner": f"Product Owner {i}",
                "developer_names": random_name_list(names)[:num_devs], # Randomly generate one to five names
                "start_date": f"2022-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
                "methodology": random.choice(["Agile", "Waterfall"]) # Randomly select from one of two
            }
            data.append(product)

        with open(data_file, "w") as f:
            json.dump(data, f) # Serialize the object into a JSON formatted string, then write it to a file-like object

    return data

mock_data = generate_mock_data(40) # Generate 40 datapoints

# This code block ensures that mock_data is always available for use, either by loading it from a file, or generating it on the fly
if not mock_data:
    try:
        with open('data.json', 'r') as f:
            mock_data = json.load(f)
    except FileNotFoundError:
        mock_data = generate_mock_data(40)
        with open('data.json', 'w') as f:
            json.dump(mock_data, f)

# Display entire JSON file
@app.get("/products", response_model=List[Product])
async def read_products():
    return mock_data

# Display the specified datapoint only by adding {product_id}
@app.get("/products/{product_id}", response_model=Product)
async def read_product(product_id: int):
    for product in mock_data:
        if product['id'] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

# Create new datapoint and write the new data to the JSON file
@app.post("/products", response_model=Product)
async def create_product(product: Product):
    product_dict = product.dict()
    product_dict["id"] = len(mock_data) + 1
    mock_data.append(product_dict)
    
    with open("data.json", "w") as f:
        json.dump(mock_data, f)

    return product_dict

# Delete specified datapoint from the JSON file
@app.delete("/products/{product_id}")
async def delete_product(product_id: int):
    for i, product in enumerate(mock_data):
        if product["id"] == product_id:
            del mock_data[i]
            with open("data.json", "w") as f:
                json.dump(mock_data, f)
            return {"message": "Product successfully deleted"}
    raise HTTPException(status_code=404, detail="Product not found")


# Update the specified datapoint and write it to the JSON file
@app.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: int, product: Product):
    for index, p in enumerate(mock_data):
        if p["id"] == product_id:
            mock_data[index] = product.dict()

            with open("data.json", "w") as f:
                json.dump(mock_data, f)
            return product
    raise HTTPException(status_code=404, detail="Product not found")
    
# Optional, FastAPI runs on localhost:8000 by default. Uncomment this block if you want it to run on localhost:3000
'''
if '__name__' == '__main__':
    uvicorn.run(app, host="localhost", port=3000)
'''
