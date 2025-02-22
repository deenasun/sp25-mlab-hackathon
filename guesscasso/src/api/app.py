import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
import matplotlib.pyplot as plt
import random
from flask import Flask, jsonify
from io import BytesIO
from PIL import Image
import base64

# Load environment variables from .env file
load_dotenv()

random_seed = random.randint(0, 1)
app = Flask(__name__)
# MODELS
# stabilityai/stable-diffusion-2-1
# stable-diffusion-v1-5/stable-diffusion-v1-5
# Initialize client

print("OPOP", os.getenv("HUGGINGFACE_API_KEY"))
client = InferenceClient(
    api_key=os.getenv("HUGGINGFACE_API_KEY")
)
params = {
    "width": 512,
    "height": 512,
    "num_inference_steps": 5,
    "guidance_scale": 6.5,
    "seed": random_seed
}

@app.route('/')
def hello():
    return "Hello, World!"

@app.route('/api/generate')
def run_model():  # prompt is text
    prompt = "dog-cat hybrid"
    print("started generation")
    params = {
    "width": 512,
    "height": 512,
    "num_inference_steps": 5,
    "guidance_scale": 6.5,
    "seed": random_seed
}
    steps = params['num_inference_steps']
    try:
        img = client.text_to_image(
            prompt,
            model="stable-diffusion-v1-5/stable-diffusion-v1-5",
            **params
        )
        print("finished generation")
    except Exception as e:
        print("generation failed:", e)
        img = Image.new('RGB', (512, 512), color='blue')
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)  # Move to the beginning of the buffer
    img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
    return jsonify({'image': f'data:image/png;base64,{img_base64}'})