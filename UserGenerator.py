import json
import random

def generate_users_and_ratings(num_users):
    names = ["David", "Olivia", "Ethan", "Sophia", "Ava", "Mason", "Isabella", "Liam", "Emma", "Noah",
             "Charlotte", "James", "Amelia", "Benjamin", "Mia", "Lucas", "Harper", "Henry", "Evelyn", "Alexander", "Ahmad"]
    last_names = [ "Conti", "Rossi", "Ferrari", "Esposito", "Bianchi",
    "Romano", "Colombo", "Ricci", "Marino", "Greco",
    "Bruno", "Gallo", "Costa", "Giordano", "Mancini",
    "Diallo", "Ndiaye", "Mbengue", "Faye", "Sow",
    "Cisse", "Seck", "Gueye", "Diop", "Kamara",
    "Balogun", "Abioye", "Adebowale", "Chukwuma", "Eme"]
    genders = ["male", "female"]
    activities = ["running", "fitness"]
    goals = ["lose weight", "improve muscle tone", "increase stamina", "enhance flexibility", "improve cardiovascular health"]
    hobbies = ["cooking", "reading", "painting", "gardening", "knitting", "photography", "baking", "writing", "gaming", "fishing"]
    genderToggles = ["True", "False"]  # Updated genderToggles list
    
    name_to_gender = {
        "David": "male",
        "Olivia": "female",
        "Ethan": "male",
        "Sophia": "female",
        "Ava": "female",
        "Mason": "male",
        "Isabella": "female",
        "Liam": "male",
        "Emma": "female",
        "Noah": "male",
        "Charlotte": "female",
        "James": "male",
        "Amelia": "female",
        "Benjamin": "male",
        "Mia": "female",
        "Lucas": "male",
        "Harper": "female",
        "Henry": "male",
        "Evelyn": "female",
        "Alexander": "male",
        "Ahmad": "male"
    }
    
    users = []
    for user_id in range(1, num_users + 1):
        name = random.choice(names) +  " " + random.choice(last_names)
        password = "password" + str(user_id)
        gender = name_to_gender[name.split()[0]]
        age = random.randint(18, 50)
        activity = random.choice(activities)
        activities_list = [activity]
        goals_list = random.sample(goals, random.randint(1, len(goals)))
        hobbies_list = random.sample(hobbies, random.randint(2, min(10, len(hobbies))))  # Adjusted to ensure a reasonable number of hobbies
        genderToggle = random.choice(genderToggles)  # Updated genderToggle assignment
        username = f"{name.lower()}{user_id}"
        
        user = {
            "name": name,
            "password": password,
            "age": age,
            "gender": gender,
            "genderToggle": genderToggle,
            "activities": activities_list,
            "goals": goals_list,
            "hobbies": hobbies_list,
            "timespan": [],
            "username": username,
            "ratings": []  # Placeholder for ratings to be added later
        }
        users.append(user)
    
    for user in users:
        rating_count = random.randint(1, min(5, num_users - 1))
        rated_users = [u for u in users if u != user]  # Exclude self from rated users
        rated_users = random.sample(rated_users, rating_count)
        for rater in rated_users:
            score = random.randint(1, 10)
            user['ratings'].append({"username": rater['username'], "score": score})
    
    return users

# Generate users and their ratings
generated_users = generate_users_and_ratings(50)

# Display the first user as an example
print(generated_users[0])

# Write the generated users to user.json
with open('user.json', 'w') as file:
    json.dump(generated_users, file, indent=4)
