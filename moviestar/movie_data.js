// --- HOLLYWOOD DATABASE ---

const FIRST_NAMES_M = [
    "Leo", "Brad", "Tom", "Johnny", "Robert", "Chris", "Ryan", "Keanu", "Denzel", "Will", 
    "Samuel", "Morgan", "Harrison", "Clint", "Al", "Joaquin", "Christian", "Matt", "Ben", 
    "George", "Adam", "Jared", "Idris", "Jason", "Dwayne", "Kevin", "Mark", "Tim", "Oscar", "Zac",
    "Cillian", "Austin", "Pedro", "Timothee", "Jeremy", "Bradley", "Hugh", "Jake", "Andrew", "Tobey",
    "Benedict", "Chadwick", "Daniel", "Michael", "Liam", "Ethan", "James", "Edward", "Colin", "Jude",
    "Viggo", "Orlando", "Elijah", "Ian", "Patrick", "Sean", "Pierce", "Roger", "Timothy", "Josh"
];

const FIRST_NAMES_F = [
    "Scarlett", "Margot", "Emma", "Jennifer", "Angelina", "Meryl", "Viola", "Zendaya", "Florence", 
    "Anya", "Natalie", "Julia", "Sandra", "Reese", "Nicole", "Charlize", "Halle", "Salma", 
    "Gal", "Brie", "Saoirse", "Jessica", "Anne", "Emily", "Blake", "Mila", "Kristen", "Dakota", "Sydney", 
    "Jenna", "Millie", "Sadie", "Lupita", "Cate", "Tilda", "Helena", "Winona", "Uma", "Julianne", "Amy",
    "Rachel", "Keira", "Rosamund", "Carey", "Lily", "Elizabeth", "Mary", "Sophie", "Maisie", "Emilia",
    "Lena", "Gwendoline", "Michelle", "Lucy", "Zoe", "Karen", "Pom", "Evangeline", "Cobie", "Gwyneth"
];

const LAST_NAMES = [
    "Dicaprio", "Pitt", "Cruise", "Depp", "Downey", "Hemsworth", "Reynolds", "Reeves", "Washington", 
    "Smith", "Jackson", "Freeman", "Ford", "Eastwood", "Pacino", "Phoenix", "Bale", "Damon", 
    "Affleck", "Clooney", "Driver", "Leto", "Elba", "Momoa", "Johnson", "Hart", "Wahlberg", 
    "Chalamet", "Holland", "Butler", "Pascal", "Stallone", "Schwarzenegger", "Willis", "Nolan", 
    "Spielberg", "Tarantino", "Scorsese", "Fincher", "Kubrick", "Coppola", "Cameron", "Lucas", "Bay",
    "Anderson", "Villeneuve", "Gerwig", "Peele", "Aster", "Eggers", "Snyder", "Ritchie", "Vaughn",
    "Wright", "Miller", "Scott", "Stone", "Lawrence", "Robbie", "Watson", "Gadot", "Larson"
];

const GENRES = ["Action", "Horror", "Sci-Fi", "Drama", "Comedy", "Romance", "Thriller", "Fantasy", "Mystery", "Western", "Musical", "Documentary"];

const SKILLS_SHOP = [
    { id: 'acting_101', name: 'Acting 101', type: 'acting', boost: 5, cost: 500, desc: "Learn to cry on command." },
    { id: 'improv_class', name: 'Improv Club', type: 'acting', boost: 10, cost: 1200, desc: "Yes, and..." },
    { id: 'method_acting', name: 'Method Acting', type: 'acting', boost: 20, cost: 5000, desc: "Stay in character for 3 months." },
    { id: 'masterclass', name: 'Masterclass', type: 'acting', boost: 40, cost: 25000, desc: "Taught by a legend." },
    { id: 'voice_coach', name: 'Vocal Training', type: 'speech', boost: 5, cost: 600, desc: "Stop mumbling." },
    { id: 'public_speaking', name: 'Public Speaking', type: 'speech', boost: 15, cost: 2000, desc: "Nail your interviews." },
    { id: 'accent_coach', name: 'Dialect Coach', type: 'speech', boost: 30, cost: 8000, desc: "Master the British accent." },
    { id: 'gym_membership', name: 'Gym Membership', type: 'looks', boost: 5, cost: 300, desc: "Basic fitness." },
    { id: 'stylist', name: 'Personal Stylist', type: 'looks', boost: 15, cost: 4000, desc: "Drip upgrade." },
    { id: 'plastic_surgery', name: 'Cosmetic Touch-up', type: 'looks', boost: 35, cost: 50000, desc: "A little botox never hurt." }
];

const JOBS = [
    { title: "Background Extra", pay: 100, req: 0, fame: 0, type: "gig", desc: "Stand there and don't look at the camera." },
    { title: "Commercial Lead", pay: 2500, req: 10, fame: 2, type: "gig", desc: "Hold a soda can and smile." },
    { title: "Student Film", pay: 500, req: 15, fame: 5, type: "movie", desc: "Artistic, but pays in pizza." },
    { title: "Indie Horror Victim", pay: 15000, req: 25, fame: 15, type: "movie", desc: "Scream loud, die first." },
    { title: "Soap Opera Guest", pay: 8000, req: 30, fame: 10, type: "show", desc: "Dramatic reveal of an evil twin." },
    { title: "Sitcom Neighbor", pay: 40000, req: 45, fame: 30, type: "show", desc: "Walk in, say catchphrase, leave." },
    { title: "Rom-Com Best Friend", pay: 80000, req: 55, fame: 50, type: "movie", desc: "Give bad advice to the lead." },
    { title: "Action Sidekick", pay: 150000, req: 70, fame: 100, type: "movie", desc: "Look cool while things explode." },
    { title: "Prestige Drama Lead", pay: 500000, req: 85, fame: 250, type: "show", desc: "Win an Emmy." },
    { title: "Marvel Hero", pay: 5000000, req: 95, fame: 1000, type: "movie", desc: "Green screen suit required." }
];
