import os
from random import choice, sample

folder_path = "words"

word_dict = {}

for file in os.scandir(folder_path):
    if file.is_file():
        category = os.path.splitext(file.name)[0]

        with open(file.path, "r", encoding="utf-8") as f:
            words = [line.strip().lower() for line in f.readlines()]

        word_dict[category] = words

category1, category2 = sample(tuple(word_dict.keys()), 2)
word1, word2 = choice(word_dict[category1]), choice(word_dict[category2])

prompt = f"{word1}-{word2} hybrid"