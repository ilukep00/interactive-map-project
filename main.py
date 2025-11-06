from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from ps_utilities.ps_fn_building_register_call import fn_building_register_call


class Item(BaseModel):
    p_wkt: str
    p_building_cod: str
    p_observation: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
async def read_item(item_id):
    return {"item_id": item_id}

@app.post("/registerBuilding/")
async def register_building(item: Item):
    return fn_building_register_call(item.p_wkt, item.p_building_cod, item.p_observation)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)