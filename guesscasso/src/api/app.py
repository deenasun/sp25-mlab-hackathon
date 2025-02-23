import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
import random
from flask import Flask, jsonify, request
from io import BytesIO
from PIL import Image
import base64
from groq import Groq

# Load environment variables from .env file
load_dotenv()

random_seed = random.randint(0, 1)
app = Flask(__name__)

# Initialize Hugging Face client
client = InferenceClient(
    api_key=os.getenv("HUGGINGFACE_API_KEY")
)

# Initialize Groq client
groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
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
    print("started generation")
    params = {
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 20,
    "guidance_scale": 4.5,
    "seed": random_seed
}
    word1, word2 = "lion", "fish"
    prompt = f"A single creature that is a {word1} and a {word2} merged together into one entity"
    # neg = "split, two separate things, half-and-half, side-by-side, blurry, low resolution"
    print("started generation")

    steps = params['num_inference_steps']
    try:
        img = client.text_to_image(
        prompt,
        model="stabilityai/stable-diffusion-3.5-large",
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
    return jsonify({'answer': prompt, 'image': f'data:image/png;base64,{img_base64}'})

@app.route('/api/check')
def check():
    guess = request.args.get('guess')
    answer = request.args.get('answer')
    print(guess)
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""
I will give you a guess and an answer. Give a score of 1 if the guess is similar semantically (i.e. a synonym) to the answer and a score of 0 otherwise.
Please only return a single number of either 0 or 1.
Guess: {guess}
Answer: {answer}"""
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    return jsonify({'score': chat_completion.choices[0].message.content, 'status': 'ok'})
