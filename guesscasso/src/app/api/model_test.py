import os
from huggingface_hub import InferenceClient
import matplotlib.pyplot as plt
import random
random_seed = random.randint(0, 2**32 - 1)
# Initialize client
client = InferenceClient(
    api_key="api_key"
)
params = {
    "width": 512,
    "height": 512,
    "num_inference_steps": 50,
    "guidance_scale": 7.0,
    "seed": random_seed
}
# Generate image
prompt = "cat-dog hybrid creature"
print("started generation")
image = client.text_to_image(
    prompt,
    model="stable-diffusion-v1-5/stable-diffusion-v1-5",
    accelerate=True,
    **params
)
print("finished generation")
plt.title(prompt)
plt.imshow(image)
plt.show()