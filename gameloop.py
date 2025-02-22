# Game Start: Initialize everything.
# Theme Selection: Players pick two random themes.
# Word & Image Generation: The system generates words, picks two, and creates an image.
# Image Reveal: Display the noisy image and gradually reveal it.
# Player Guessing: Accept player inputs and track time taken.
# Scoring & Feedback: Award points based on response time.
# Next Round/End: Move to the next round or finish the game.

theme_dict = {"Kitchen" : [],
              "Office" : [],
              "Tools"  : [],
              "Animals" : [],
              "Plants" : [],
              "Magic" : [],
              "Superpowers" : [],
              "Food" : [],
              "Games" : [],
              "Ancient" : [],
              "Space" : [],
              "Ocean" : [],
              "Spooky" : [],
              "Futuristic" : []}

def main():
    game = True
    points = 0

    while game:
        print("Here is the current list of themes to choose from.")
        print(themes)
        theme_one = input("Choose the first theme. ")
        theme_two = input("Choose the second theme.")

        word = generate_word(theme_one, theme_two, theme_dict)

        player_guess_one = input("What was the first word used to generate the image? ")
        player_guess_two = input("What was the second word used to generate the image? ")

        
        player_input = input("Do you want to play another round? (y/n) ")
        if player_input == 'n':
            game = False

def generate_word(theme_a, theme_b, theme_dict):
    word = ""
    list_a = theme_dict[theme_a]
    list_b = theme_dict[theme_b]


    return word

def generate_theme_words():
    new_dict = {}
    for theme in themes:
        new_dict[theme] = []

    return new_dict


