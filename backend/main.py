from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import random
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import uvicorn

app = FastAPI()
mock_data = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(BaseModel):
    id: int
    product_name: str
    scrum_master: Optional[str]
    product_owner: str
    developer_names: List[str]
    start_date: str
    methodology: str

def generate_mock_data(num_products: int) -> List[dict]:
    data_file = "data.json"
    if os.path.exists(data_file):
        with open(data_file, "r") as f:
            data = json.load(f)
    else:
        data = []
        for i in range(1, num_products + 1):
            product = {
                "id": i,
                "product_name": f"Product {i}",
                "scrum_master": random.choice(['Scrum Master 1', 'Scrum Master 2', 'Scrum Master 3', 'Scrum Master 4', 'n/a']),
                "product_owner": f"Product Owner {i}",
                "developer_names": [f"Developer {j}" for j in range(1, random.randint(2, 6))],
                "start_date": f"2022-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
                "methodology": random.choice(["Agile", "Waterfall"])
            }
            data.append(product)

        with open(data_file, "w") as f:
            json.dump(data, f)

    return data

mock_data = generate_mock_data(40)

if not mock_data:
    try:
        with open('data.json', 'r') as f:
            mock_data = json.load(f)
    except FileNotFoundError:
        mock_data = generate_mock_data(40)
        with open('data.json', 'w') as f:
            json.dump(mock_data, f)

@app.get("/products", response_model=List[Product])
async def read_products():
    return mock_data

@app.get("/products/{product_id}", response_model=Product)
async def read_product(product_id: int):
    for product in mock_data:
        if product['id'] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

@app.post("/products", response_model=Product)
async def create_product(product: Product):
    product_dict = product.dict()
    product_dict["id"] = len(mock_data) + 1
    mock_data.append(product_dict)

    # write the new data to the JSON file
    with open("data.json", "w") as f:
        json.dump(mock_data, f)

    return product_dict

@app.delete("/products/{product_id}")
async def delete_product(product_id: int):
    for i, product in enumerate(mock_data):
        if product["id"] == product_id:
            del mock_data[i]
            with open("data.json", "w") as f:
                json.dump(mock_data, f)
            return {"message": "Product successfully deleted"}
    raise HTTPException(status_code=404, detail="Product not found")


@app.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: int, product: Product):
    for index, p in enumerate(mock_data):
        if p["id"] == product_id:
            mock_data[index] = product.dict()
            # write the updated data to the JSON file
            with open("data.json", "w") as f:
                json.dump(mock_data, f)
            return product
    raise HTTPException(status_code=404, detail="Product not found")
