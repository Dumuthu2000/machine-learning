from fastapi import FastAPI, File, UploadFile, HTTPException
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

# Load the model
try:
    MODEL = tf.keras.models.load_model("../model/1.keras")
except Exception as e:
    raise RuntimeError(f"Error loading model: {e}")

# Class names
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]


@app.get("/ping")
async def ping():
    """
    Health check endpoint.
    """
    return {"message": "Hello, I am alive!"}


def read_file_as_image(data: bytes) -> np.ndarray:
    """
    Helper function to read the uploaded file as an image.
    """
    try:
        img = Image.open(BytesIO(data)).convert("RGB")
        return np.array(img)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading image: {e}")


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict endpoint to classify uploaded images.
    """
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Upload a JPEG or PNG image.")

    try:
        # Read and preprocess the image
        image = read_file_as_image(await file.read())
        img_resized = tf.image.resize(image, (224, 224))  # Resize to model input size
        img_batch = np.expand_dims(img_resized / 255.0, axis=0)  # Normalize and create batch

        # Make predictions
        predictions = MODEL.predict(img_batch)
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))

        # Return the response
        return {
            "class": predicted_class,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {e}")


# Main function to run the server
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
