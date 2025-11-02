import pandas as pd
import joblib
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager

# --- 1. Define Constants ---

# Emission factors (in kg CO2)
ELECTRICITY_FACTOR_KWH = 0.384
VEHICLE_FACTORS_PER_KM = {
    'Car': 0.248,
    'Motorcycle': 0.114,
    'Scooter': 0.114,
    'E-Bike': 0.077,
    'Bicycle': 0.0,
    'Three-Wheeler': 0.150,
    'Other': 0.248
}
# This is our benchmark for the travel module
AVERAGE_MONTHLY_TRAVEL_CO2 = 150  # (kg)


# --- 2. Define Pydantic Models for Inputs ---

class ElectricityData(BaseModel):
    # Features for the ML model
    homeType: str
    carpetArea_sqft: float
    # Features for the calculation
    monthly_unitsUsed_kwh: float
    monthly_solarUsed_kwh: float

    class Config:
        json_schema_extra = {
            "example": {
                "homeType": "Apartment",
                "carpetArea_sqft": 900.0,
                "monthly_unitsUsed_kwh": 300.0,
                "monthly_solarUsed_kwh": 0.0
            }
        }


class TravelData(BaseModel):
    vehicle_type: str
    kmCovered: float  # Your Node.js backend calculates this

    class Config:
        json_schema_extra = {
            "example": {
                "vehicle_type": "Car",
                "kmCovered": 250.0
            }
        }


# --- 3. Create App State & Lifespan Event ---
app_state = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the new ML model
    print("Loading *electricity benchmark* ML model...")
    # Make sure your new model file is named this:
    app_state["electricity_model"] = joblib.load("electricity_benchmark_model.pkl")
    print("Model loaded successfully.")
    yield
    print("Clearing application state...")
    app_state.clear()


app = FastAPI(lifespan=lifespan)


# --- 4. Define API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "GreenLens Modular AI Engine is running!"}


@app.post("/calculate-electricity")
def calculate_electricity_footprint(data: ElectricityData):
    """
    Calculates CO2 from electricity use and awards tokens by
    comparing against a personalized, ML-generated benchmark.
    """

    # 1. Calculate user's *actual* CO2 footprint
    net_kwh_used = data.monthly_unitsUsed_kwh - data.monthly_solarUsed_kwh
    actual_co2 = max(0, net_kwh_used * ELECTRICITY_FACTOR_KWH)

    # 2. Get the *expected* CO2 benchmark from the ML model
    model = app_state["electricity_model"]

    # Create DataFrame for model prediction
    features_df = pd.DataFrame({
        'homeType': [data.homeType],
        'carpetArea_sqft': [data.carpetArea_sqft]
    })

    expected_co2 = model.predict(features_df).item()

    # 3. Calculate tokens
    tokens_to_award = 0
    if actual_co2 < expected_co2:
        co2_saved = expected_co2 - actual_co2
        # Award 10 base tokens + bonus for savings
        tokens_to_award = 10 + int(co2_saved * 0.1)

    return {
        "status": "success",
        "user_co2_footprint_kg": round(actual_co2, 2),
        "tokens_awarded": tokens_to_award
    }


@app.post("/calculate-travel")
def calculate_travel_footprint(data: TravelData):
    """
    Calculates CO2 from travel and awards tokens by
    comparing against a fixed global benchmark.
    """

    # 1. Calculate user's *actual* CO2 footprint
    vehicle_factor = VEHICLE_FACTORS_PER_KM.get(data.vehicle_type, VEHICLE_FACTORS_PER_KM['Other'])
    actual_co2 = data.kmCovered * vehicle_factor

    # 2. Get the *expected* CO2 benchmark (fixed value)
    expected_co2 = AVERAGE_MONTHLY_TRAVEL_CO2

    # 3. Calculate tokens
    tokens_to_award = 0
    if actual_co2 < expected_co2:
        co2_saved = expected_co2 - actual_co2
        tokens_to_award = 10 + int(co2_saved * 0.1)

    return {
        "status": "success",
        "user_co2_footprint_kg": round(actual_co2, 2),
        "tokens_awarded": tokens_to_award
    }


# --- 5. Main entry point to run the app ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)