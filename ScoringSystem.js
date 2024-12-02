const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const maxPoints = 50;
const normalizeRating = 9;
const maximumAllowedImpact = 0.2;

async function calculateMatchPercentage(person1, person2, username, ignoreMode) {
    let matchPercentage = 0;
    const genderPreference = person1.genderToggle;

    // Find en fælles aktivitet
    const commonActivity = person1.activities.find(activity => person2.activities?.includes(activity));

    if (ignoreMode === false) {
        // Tjek om personens køn matcher kønspræferencen og activiteten er den samme
        if (genderPreference !== "False" && person1.gender !== person2.gender && !commonActivity) {
            return matchPercentage;
        }
    }

    // Tjek om personens brugernavn matcher input brugernavnet
    if (person1.username !== username) {
        return matchPercentage;
    }

    // Beregn aktivitetsscore
    matchPercentage += 20;

    // Beregn målscore
    const commonGoals = person1.goals.filter(goal => person2.goals?.includes(goal));
    matchPercentage += commonGoals.length / person1.goals.length * 10;

    // Beregn hobbiescore
    const commonHobbies = person1.hobbies.filter(hobby => person2.hobbies?.includes(hobby));
    matchPercentage += commonHobbies.length / person1.hobbies.length * 10;

    // Beregn alderscore
    const ageDifference = Math.abs(person1.age - person2.age);
    const ageScore = 10 - ageDifference;
    matchPercentage += ageScore > 0 ? ageScore : 0;

    return matchPercentage / maxPoints;
}

async function main() {
    const uri = 'mongodb+srv://rasmushp03:bIV6MsfnmT4Z72LR@users.jcvjwsz.mongodb.net/';
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db('Users');
        const collection = database.collection('UserData');

        // Få input brugernavnet
        const inputUsername = "david ricci1";

        // Ignorer kønspræferencer og aktiviteter
        ignoreMode = false;

        // Array til at gemme de bedste match
        var bestMatches = [];

        // Array til at gemme fælles interesser og mål
        var commonInterestsAndGoals = [];

        // Match alle personer sammen
        const people = await collection.find().toArray();
        for (let i = 0; i < people.length; i++) {
            const person1 = people[i];
            const matches = [];

            // Tjek om personens brugernavn matcher input brugernavnet
            if (person1.username !== inputUsername) {
                continue; // Spring ud af løkken hvis brugernavnet ikke matcher
            }

            for (let j = 0; j < people.length; j++) {
                if (i === j) {
                    continue; // Spring over sammenligning med sig selv
                }

                const person2 = people[j];

                const matchPercentage = await calculateMatchPercentage(person1, person2, inputUsername, ignoreMode);

                matches.push({
                    person: person2,
                    username: person2.username,
                    matchPercentage: matchPercentage
                });
            }

            // Sorter matches efter matchPercentage i faldende rækkefølge
            matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

            // Gem de 5 bedste matches
            const bestMatchesForPerson = matches.slice(0, 20).map(match => {
                const commonInterests = person1.hobbies.filter(hobby => match.person.hobbies?.includes(hobby));
                const commonGoals = person1.goals.filter(goal => match.person.goals?.includes(goal));

                // Udtræk ratings for den matchede person
                const ratingsUsers = match.person.ratings.map(rating => rating.username);
                const ratings = match.person.ratings.map(rating => rating.score);

                commonInterestsAndGoals.push({
                    person1: person1.name,
                    person2: match.person.name,
                    commonInterests: commonInterests,
                    commonGoals: commonGoals,
                    ratingsUsers: ratingsUsers,
                    ratings: ratings,
                    matches: match.matchPercentage
                });

                return `Bedste match for ${person1.name}: ${match.person.name} (Match Procentdel: ${match.matchPercentage}%)`;
            });

            bestMatches.push(...bestMatchesForPerson);

           await predictRatings(person1, commonInterestsAndGoals, inputUsername, collection, matches);
        }

        async function predictRatings(person1, commonInterestsAndGoals, inputUsername, collection, matches) {
            var matchesWithAdjustedPercentage = []; 
        
            for (let i = 0; i < commonInterestsAndGoals.length; i++) {
                const common = commonInterestsAndGoals[i];
                const ratingsLength = common.ratings.length;
                var weigthedRatings = [];
        
                for (let j = 0; j < ratingsLength; j++) {
                    const rating = common.ratings[j];
                    const raterUsername = common.ratingsUsers[j];
        
                    // Find JSON-objektet i people-arrayet med det matchende brugernavn
                    const raterPerson = await collection.findOne({ username: raterUsername });
        
                    if (raterPerson) {
                        // Beregn match procentdel ved hjælp af raterens information
                        const matchPercentage = await calculateMatchPercentage(person1, raterPerson, inputUsername, ignoreMode = true);
                        const weigthedRating = ((rating - 1) / normalizeRating) * matchPercentage;
                        weigthedRatings.push(weigthedRating);
                    } else {
                        console.log(`Ingen bruger fundet med brugernavn: ${raterUsername}`);
                    }
                }
        
                const sumWeigthedRatings = weigthedRatings.reduce((a, b) => a + b, 0);
                const averageWeightedRatings = sumWeigthedRatings / ratingsLength;
                const adjustmentFactor = averageWeightedRatings - 0.5;
                const adjustedPrecentage = (adjustmentFactor / 0.5) * maximumAllowedImpact;
                matches[i].matchPercentage += adjustedPrecentage;;
        
                // Push an object into matchesWithAdjustedPercentage array
                matchesWithAdjustedPercentage.push({
                    person: common.person2,
                    matchPercentage: matches[i].matchPercentage.toFixed(2) // Adjusted percentage instead of matches[i].matchPercentage
                });
            }
        
            matchesWithAdjustedPercentage.sort((a, b) => b.matchPercentage - a.matchPercentage);
            console.log("ADJUSTED PERCENTAGE: ", matchesWithAdjustedPercentage);

            return matchesWithAdjustedPercentage;
        }


        // Tjek om der er bedste match
        if (bestMatches.length === 0) {
            console.log('Ingen bedste match fundet.');
        } else {
            try {
                // Vis fælles interesser og mål
                console.log('Fælles interesser og mål:');
                commonInterestsAndGoals.forEach(common => {
                    console.log(`Person 1: ${common.person1}`);
                    console.log(`Person 2: ${common.person2}`);
                    console.log(`Fælles interesser: ${common.commonInterests.join(', ')}`);
                    console.log(`Fælles mål: ${common.commonGoals.join(', ')}`);
                    console.log(`Ratings = ${common.ratings.join(', ')}`);
                    console.log(`Match procentdel: ${common.matches * 100}%`)
                    console.log('------------------------');
                });

            } catch (error) {
                console.error("Fejl ved læsning eller parsing af JSON fil:", error);
            }
        }
    } catch (error) {
        console.error("Fejl ved læsning eller parsing af JSON fil:", error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
