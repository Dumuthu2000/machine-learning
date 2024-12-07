from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model using TFSMLayer
MODEL = tf.keras.layers.TFSMLayer("../model", call_endpoint="serving_default")

# Class names
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]


@app.get("/ping")
async def ping():
    return "Hello, I am alive"


# Helper function to read the uploaded file as an image
def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read image
    image = read_file_as_image(await file.read())
    # Preprocess image: Expand dimensions to create a batch
    img_batch = np.expand_dims(image, 0)

    # Make predictions
    predictions = MODEL(img_batch)

    # Get the predicted class and confidence
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    # Return the response
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }


# Main function to run the server
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
