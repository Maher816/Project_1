############### Blackjack Project #####################

#Difficulty Normal 😎: Use all Hints below to complete the project.
#Difficulty Hard 🤔: Use only Hints 1, 2, 3 to complete the project.
#Difficulty Extra Hard 😭: Only use Hints 1 & 2 to complete the project.
#Difficulty Expert 🤯: Only use Hint 1 to complete the project.

############### Our Blackjack House Rules #####################

## The deck is unlimited in size. 
## There are no jokers. 
## The Jack/Queen/King all count as 10.
## The the Ace can count as 11 or 1.
## Use the following list as the deck of cards:
## cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
## The cards in the list have equal probability of being drawn.
## Cards are not removed from the deck as they are drawn.
## The computer is the dealer.

##################### Hints #####################

#Hint 1: Go to this website and try out the Blackjack game: 
#   https://games.washingtonpost.com/games/blackjack/
#Then try out the completed Blackjack project here: 
#   https://appbrewery.github.io/python-day11-demo/

#Hint 2: Read this breakdown of program requirements: 
#   http://listmoz.com/view/6h34DJpvJBFVRlZfJvxF
#Then try to create your own flowchart for the program.

#Hint 3: Download and read this flow chart I've created: 
#   https://drive.google.com/uc?export=download&id=1rDkiHCrhaf9eX7u7yjM1qwSuyEk-rPnt

#Hint 4: Create a deal_card() function that uses the List below to *return* a random card.
#11 is the Ace.
#cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]

#Hint 5: Deal the user and computer 2 cards each using deal_card() and append().
#user_cards = []
#computer_cards = []

#Hint 6: Create a function called calculate_score() that takes a List of cards as input 
#and returns the score. 
#Look up the sum() function to help you do this.

#Hint 7: Inside calculate_score() check for a blackjack (a hand with only 2 cards: ace + 10) and return 0 instead of the actual score. 0 will represent a blackjack in our game.

#Hint 8: Inside calculate_score() check for an 11 (ace). If the score is already over 21, remove the 11 and replace it with a 1. You might need to look up append() and remove().

#Hint 9: Call calculate_score(). If the computer or the user has a blackjack (0) or if the user's score is over 21, then the game ends.

#Hint 10: If the game has not ended, ask the user if they want to draw another card. If yes, then use the deal_card() function to add another card to the user_cards List. If no, then the game has ended.

#Hint 11: The score will need to be rechecked with every new card drawn and the checks in Hint 9 need to be repeated until the game ends.

#Hint 12: Once the user is done, it's time to let the computer play. The computer should keep drawing cards as long as it has a score less than 17.

#Hint 13: Create a function called compare() and pass in the user_score and computer_score. If the computer and user both have the same score, then it's a draw. If the computer has a blackjack (0), then the user loses. If the user has a blackjack (0), then the user wins. If the user_score is over 21, then the user loses. If the computer_score is over 21, then the computer loses. If none of the above, then the player with the highest score wins.

#Hint 14: Ask the user if they want to restart the game. If they answer yes, clear the console and start a new game of blackjack and show the logo from art.py.

#begin here
#4
#everything seems to be working fine but the clear function cannot be called.
#using the 'from replit import clear' doesn't seem to work.
import python_art_folder
import random

import python_art_folder.blackjack_art #very impotrant

play_again = True



def deal_card():  
  """retrieves a random card from the deck"""
  return random.choice(cards)

#6
#instructor's solution is better than mine, I forgot about the input and using the parameter
#which can make it easier to process the card list instead of specifically making statements for each card deck
def calculate_score(cards):
  """takes a list of cards and returns the score calculated from the cards"""
  #7
  if sum(cards) == 21 and len(cards) == 2:
    return 0
  #8
  if 11 in cards and sum(cards) > 21:  #I don't really understand this part, would the user get over 21 in the first 2 cards, or is it used as like a grace when the user has more cards so they can downgrade the ace value to 1?
    cards.remove(11)
    cards.append(1)
  return sum(cards)



#13
def compare(user, dealer):
  if user == dealer:
    return "Draw"
  elif dealer == 0:
    return "Dealer has Blackjack, you lose"
  elif user == 0:
    return "You have Blackjack, you win"
  elif user > 21:
    return "You went over, you lose"
  elif dealer > 21:
    return "Dealer went over, you win"
  elif user > dealer:
    return f"{user} -Player wins"
  else:
    return f"{dealer} -Dealer wins"

while play_again:
  print(python_art_folder.blackjack_art.logo)
  game_over = False
  
  cards = [11,2,3,4,5,6,7,8,9,10,10,10,10]
  #ace is 11, jack, queen, king are 10
  
  #5
  user_cards = []      #player
  computer_cards = []  #dealer
  
  #initial card dealing
  for card in range(2):  #deals 2 cards randomly to each player
    user_cards.append(deal_card())
    computer_cards.append(deal_card())
  
  user_score = 0  
  dealer_score = 0
  while not game_over:
    #9
    user_score = calculate_score(user_cards)
    dealer_score = calculate_score(computer_cards)
    
    #beginning the game only the dealer's first card is revealed
    print(f"  Your cards: {user_cards}, current score: {user_score}")
    print(f"  Computer's first card: {computer_cards[0]}")
  
    #print(user_cards)
    #print(computer_cards)
  
    if user_score == 0 or dealer_score == 0 or user_score > 21:
      #print(f"{dealer_score} -Dealer wins")
      game_over = True
  
    # elif user_score == 0 or dealer_score > 21:
    #   print(f"{user_score} -Player wins")
    #   game_over = True
    else:
    
    #10 if player wants to draw another card, else passes turn to dealer and ends the game
      if input("Type 'y' to get another card, type 'n' to pass: ") == 'y':
        user_cards.append(deal_card())
      else:
        game_over = True
  #11 I first had this while loop inside the while loop above, but I realized I needed to break the loop when the game ends, so I moved it
  while dealer_score != 0 and dealer_score < 17:  #a typo happened here that was causing a bug, fixed it
    computer_cards.append(deal_card())
    dealer_score = calculate_score(computer_cards)
    #print(computer_cards)
      

  print(f"  Your final hand: {user_cards}, final score: {user_score}")
  print(f"  Computer's final hand: {computer_cards}, final score: {dealer_score}")
  print(compare(user_score, dealer_score))

  if input("Do you want to play again? Type 'y' or 'n': ") == 'n':
    play_again = False
    print("closing game")


