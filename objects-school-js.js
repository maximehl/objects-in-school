var Person = function(idNumber, firstName, lastName){
    this.idNumber = idNumber;
    this.firstName = firstName;
    this.lastName = lastName;
};


var Student = function(grade){
    this.grade = grade;
};

Student.prototype = Person;

var Teacher = function(subject){
    this.subject = subject;
};

Teacher.prototype =  Person;

var Section = function(name, subject, gradeLevel, period, idNumber, maxSize, teacher){
    this.name = name;
    this.subject = subject;
    this.gradeLevel = gradeLevel;
    this.period = period;
    this.idNumber = idNumber;
    this.maxSize = maxSize;
    this.teacher = teacher;
    this.studentsTaking = [];
    this.addStudent = function(personIndex){
        this.studentsTaking.splice(0, 0, people[personIndex].idNumber);
    };
    this.removeStudent = function(personIndex){
        this.studentsTaking.splice(findIndexFromIdNumber(this.studentsTaking, people[personIndex].idNumber), 1);
    }
    this.seatsRemaining = function(){
        return this.maxSize - this.studentsTaking.length;
    }
};

var studentsTeachersBorder = 0;
var people = [];
var personType = 0;
var sectionsList = [];

function createPerson(){
    var tempIdNumber = parseInt(document.getElementById("idNumber0").value);
    var tempLastName = document.getElementById("lastName").value;
    var tempFirstName = document.getElementById("firstName").value;

    var alphabetizeLocation;
    var alphabetizeEnd;
    if(personType===0){
        alphabetizeLocation = 0;
        alphabetizeEnd = studentsTeachersBorder;
    }else{
        alphabetizeLocation = studentsTeachersBorder;
        alphabetizeEnd = people.length;
    }
    var switchLevels = [1];
    while(alphabetizeLocation<alphabetizeEnd){
        //check the new person's last name against each person in the people array until you either find where
        //the person fits or reach the end of the students/teachers area
        //test case one: alphabetize by last name
        switchLevels[1] = [tempLastName, people[alphabetizeLocation].lastName];
        //test case two: alphabetize by first name if last names are identical
        switchLevels[2] = [tempFirstName, people[alphabetizeLocation].firstName];
        //test case final: alphabetize by id number (which can't be identical) if both last and first are identical
        switchLevels[3] = [tempIdNumber, people[alphabetizeLocation].idNumber];
        var switchResult = "identical";
        while(switchResult==="identical"){
            switchResult = alphabetize(switchLevels[switchLevels[0]][0],
                switchLevels[switchLevels[0]][1]);
            if(switchResult==="identical"){
                switchLevels[0]++;
            }
        }
        if(switchResult===false){
            alphabetizeLocation++;
        }else if(switchResult===true){
            break;
        }
    }
    if(personType===0){
        people.splice(alphabetizeLocation, 0, new Student(parseInt(document.getElementById("0extra").value)));
        studentsTeachersBorder++;
    }else{
        people.splice(alphabetizeLocation, 0, new Teacher(document.getElementById("1extra").value));
    }

    people[alphabetizeLocation].idNumber = tempIdNumber;
    people[alphabetizeLocation].firstName = tempFirstName;
    people[alphabetizeLocation].lastName = tempLastName;
    people[alphabetizeLocation].sectionsTakenTaught = [false, false, false, false, false, false, false, false];
    buildDisplayTable();
    var schoolData = [studentsTeachersBorder, people.length-studentsTeachersBorder,
        (people.length-studentsTeachersBorder)/studentsTeachersBorder];
    for(var i in schoolData){
        document.getElementById("schoolData" + i).innerHTML = schoolData[i].toString();
    }
    document.getElementById("personButton").innerHTML = "<span title='Great, now change the ID number to make a new person.'>Person added!</span>";
}

sectionOrganizeOrder = ["English", "Math", "History", "Science", "Social Sciences", "Art", "Music", "Performing Arts",
    "Computer Science", "Foreign Language"];
function createSection(){
    //adds the section idNumber to the teacher in the given period slot
    people[parseInt(document.getElementById("teacher").value)].sectionsTakenTaught[parseInt(document.getElementById
        ("sectionPeriod").value)] = parseInt(document.getElementById("idNumber1").value);
    var tempIdNumber = parseInt(document.getElementById("idNumber1").value);
    var tempSubject = document.getElementById("sectionSubject").value;
    var posn;

    for(posn = 0; posn<sectionsList.length; posn++){
        var section = sectionsList[posn];

        if(sectionOrganizeOrder.indexOf(tempSubject)<=sectionOrganizeOrder.indexOf(section.subject)){
            if (sectionOrganizeOrder.indexOf(tempSubject)<sectionOrganizeOrder.indexOf(section.subject)) {
                break;
            }
            if (tempIdNumber<section.idNumber) {
                break;
            }
        }
    }
    sectionsList.splice(posn, 0, new Section(document.getElementById("sectionName").value,
        tempSubject, parseInt(document.getElementById("sectionGrade").value),
        document.getElementById("sectionPeriod").value, tempIdNumber,
        parseInt(document.getElementById("sectionSize").value),
        people[parseInt(document.getElementById("teacher").value)].idNumber));
    buildDisplayTable();
    document.getElementById("sectionButton").innerHTML = "Section added!";
}

var lettersOrder = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
    "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "'", ",", "."];
function alphabetize(string1, string2){
    //check whether string1 comes after string2. If it does, return true, you're done alphabetizing.
    string1 = string1.toString().toLowerCase();
    string2 = string2.toString().toLowerCase();
    var letterPlace1 = 0;
    var letterPlace2 = 0;
    if(string1===string2){
        //Uh oh, we have to check firstNames now
        return "identical";
    }else if(lettersOrder.indexOf(string1[0])===-1){
        //checks if string1's first character isn't one of the ones in the lettersOrder array, then moves it until it is
        //or determines that string1 doesn't have any characters in the lettersOrder array
        while(letterPlace1<string1.length){
            letterPlace1++;
            if(lettersOrder.indexOf(string1[letterPlace1])>-1){
                break;
            }
        }
    }else if(lettersOrder.indexOf(string2[0])===-1){
        //same, for string2
        while(letterPlace2<string2.length){
            letterPlace2++;
            if(lettersOrder.indexOf(string2[letterPlace2])>-1){
                break;
            }
        }
    }
    //if we get this far, it's time to check letter by letter, whose name is higher in the list?
    var difference;
    while(letterPlace1<string1.length && letterPlace2<string2.length){
        difference = lettersOrder.indexOf(string1[letterPlace1])-lettersOrder.indexOf(string2[letterPlace2]);
        if(difference === 0){
            //they're the same up until this letter. Check the next letter.
            letterPlace1++;
            letterPlace2++;
            while(string1[letterPlace1]===" "){
                letterPlace1++;
            }
            while(string2[letterPlace2]===" "){
                letterPlace2++;
            }
        }else if(difference>0){
            //string1's letter comes after (at a higher index) than string2's letter
            //string1 is before string2
            return false;
        }else if(difference<0){
            //string1 is after string2
            return true;
        }
    }
    //if we get this far, we know that all their letters are the same up until the end of one of the strings
    if(string1.length>string2.length){
        return false;
        //all their letters are the same up until the end, but string1 is longer than string2, so string1 comes
        //after string2. Like "against" (string1) comes after "again" (string2) in the dictionary.
    }else{
        return true;
    }
}

var topFirstNames1990 = ["Michael", "Jessica", "Christopher", "Ashley", "Matthew", "Brittany", "Joshua", 
    "Amanda", "Daniel", "Samantha", "David", "Sarah", "Andrew", "Stephanie", "James", 
    "Jennifer", "Justin", "Elizabeth", "Joseph", "Lauren", "Ryan", "Megan", "John", 
    "Emily", "Robert", "Nicole", "Nicholas", "Kayla", "Anthony", "Amber", "William", 
    "Rachel", "Jonathan", "Courtney", "Kyle", "Danielle", "Brandon", "Heather", "Jacob", 
    "Melissa", "Tyler", "Rebecca", "Zachary", "Michelle", "Kevin", "Tiffany", "Eric", 
    "Chelsea", "Steven", "Christina", "Thomas", "Katherine", "Brian", "Alyssa", 
    "Alexander", "Jasmine", "Jordan", "Laura", "Timothy", "Hannah", "Cody", "Kimberly", 
    "Adam", "Kelsey", "Benjamin", "Victoria", "Aaron", "Sara", "Richard", "Mary", 
    "Patrick", "Erica", "Sean", "Alexandra", "Charles", "Amy", "Stephen", "Crystal", 
    "Jeremy", "Andrea", "Jose", "Kelly", "Travis", "Kristen", "Jeffrey", "Erin", 
    "Nathan", "Brittney", "Samuel", "Anna", "Mark", "Taylor", "Jason", "Maria", "Jesse", 
    "Allison", "Paul", "Cassandra", "Dustin", "Caitlin", "Gregory", "Lindsey", "Kenneth", 
    "Angela", "Scott", "Katie", "Derek", "Alicia", "Austin", "Jamie", "Corey", "Vanessa", 
    "Bryan", "Kathryn", "Ethan", "Morgan", "Alex", "Jordan", "Christian", "Whitney", 
    "Juan", "Brianna", "Cameron", "Christine", "Jared", "Natalie", "Taylor", "Lisa", 
    "Bradley", "Kristin", "Luis", "Alexis", "Cory", "Jacqueline", "Edward", "Shannon", 
    "Shawn", "Lindsay", "Ian", "Brooke", "Evan", "Catherine", "Marcus", "Olivia", 
    "Shane", "April", "Peter", "Erika", "Carlos", "Katelyn", "Trevor", "Monica", 
    "Antonio", "Kristina", "Vincent", "Kaitlyn", "George", "Paige", "Keith", "Molly", 
    "Phillip", "Jenna", "Victor", "Leah", "Dylan", "Julia", "Brett", "Bianca", "Chad", 
    "Tara", "Nathaniel", "Melanie", "Donald", "Marissa", "Caleb", "Cynthia", "Casey", 
    "Holly", "Jesus", "Abigail", "Blake", "Meghan", "Raymond", "Kathleen", "Mitchell", 
    "Julie", "Adrian", "Ariel", "Joel", "Alexandria", "Erik", "Veronica", "Ronald", 
    "Patricia", "Devin", "Diana", "Garrett", "Gabrielle", "Gabriel", "Shelby", "Miguel", 
    "Kaitlin", "Seth", "Margaret", "Douglas", "Brandi", "Logan", "Krystal", "Spencer", 
    "Natasha", "Derrick", "Casey", "Wesley", "Bethany", "Johnathan", "Haley", "Frank", 
    "Briana", "Chase", "Kara", "Philip", "Rachael", "Lucas", "Miranda", "Martin", 
    "Breanna", "Gary", "Dana", "Francisco", "Leslie", "Jorge", "Caroline", "Craig", 
    "Kendra", "Luke", "Sabrina", "Mario", "Angelica", "Ricardo", "Karen", "Curtis", 
    "Felicia", "Colin", "Jillian", "Julian", "Brenda", "Jonathon", "Ana", "Alan", 
    "Desiree", "Alejandro", "Meagan", "Brent", "Katrina", "Troy", "Chelsey", "Dennis", 
    "Valerie", "Johnny", "Emma", "Randy", "Nancy", "Isaac", "Alison", "Angel", "Monique", 
    "Manuel", "Sandra", "Oscar", "Alisha", "Jeffery", "Britney", "Andre", "Brandy", 
    "Henry", "Joanna", "Colton", "Gina", "Jake", "Grace", "Allen", "Sierra", "Russell", 
    "Candace", "Edgar", "Jaclyn", "Larry", "Adriana", "Carl", "Krista", "Jerry", "Alexa", 
    "Tony", "Candice", "Mathew", "Lacey", "Eduardo", "Rebekah", "Roberto", "Sydney", 
    "Devon", "Nichole", "Darius", "Denise", "Clayton", "Dominique", "Jeremiah", "Ashlee", 
    "Brendan", "Anne", "Hector", "Yesenia", "Javier", "Kirsten", "Todd", "Deanna", 
    "Omar", "Claire", "Drew", "Colleen", "Sergio", "Audrey", "Danny", "Mallory", "Marc", 
    "Carly", "Terry", "Tabitha", "Kristopher", "Cristina", "Jack", "Raven", "Albert", 
    "Priscilla", "Louis", "Stacey", "Bryce", "Carolyn", "Edwin", "Carrie", "Max", 
    "Kiara", "Jimmy", "Susan", "Calvin", "Stacy", "Lawrence", "Angel", "Micheal", 
    "Linda", "Ricky", "Mercedes", "Ivan", "Autumn", "Ruben", "Ashleigh", "Fernando", 
    "Kylie", "Levi", "Teresa", "Rodney", "Gabriela", "Lance", "Kelli", "Grant", 
    "Caitlyn", "Dillon", "Renee", "Bobby", "Arielle", "Xavier", "Cindy", "Nicolas", 
    "Ebony", "Dominic", "Justine", "Maxwell", "Karina", "Ross", "Meredith", "Walter", 
    "Bridget", "Randall", "Hillary", "Dalton", "Daisy", "Julio", "Amelia", "Dakota", 
    "Mayra", "Arthur", "Theresa", "Pedro", "Claudia", "Preston", "Madeline", "Cesar", 
    "Sasha", "Darren", "Heidi", "Rafael", "Robin", "Clinton", "Destiny", "Andres", 
    "Madison", "Bryant", "Lydia", "Maurice", "Savannah", "Isaiah", "Wendy", "Dominique", 
    "Barbara", "Mason", "Melinda", "Joe", "Tamara", "Raul", "Ellen", "Roger", 
    "Alejandra", "Gerald", "Chloe", "Lee", "Marie", "Billy", "Jenny", "Jaime", 
    "Virginia", "Jon", "Kasey", "Jay", "Jocelyn", "Emmanuel", "Carmen", "Hunter", "Jade", 
    "Tanner", "Evelyn", "Willie", "Jacquelyn", "Connor", "Abby", "Erick", "Janet", 
    "Alberto", "Martha", "Shaun", "Tracy", "Marco", "Cortney", "Jamie", "Bailey", "Noah", 
    "Ariana", "Armando", "Cassie", "Reginald", "Brittani", "Jessie", "Jasmin", "Eddie", 
    "Hilary", "Theodore", "Kaylee", "Zachery", "Cara", "Roy", "Adrienne", "Terrance", 
    "Allyson", "Marvin", "Kristine", "Micah", "Pamela", "Bruce", "Raquel", "Collin", 
    "Tina", "Malcolm", "Gloria", "Wayne", "Rosa", "Elijah", "Camille", "Abraham", 
    "Michele", "Colby", "Tiara", "Darrell", "Tasha", "Jamal", "Mackenzie", "Geoffrey", 
    "Kristy", "Cole", "Ann", "Johnathon", "Shawna", "Ramon", "Sophia", "Frederick", 
    "Tanya", "Trent", "Jessie", "Gerardo", "Latoya", "Terrence", "Marisa", "Darryl", 
    "Kari", "Brock", "Carissa", "Arturo", "Janelle", "Marquis", "Mariah", "Tyrone", 
    "Nina", "Neil", "Angelina", "Ronnie", "Deborah", "Enrique", "Carla", "Jerome", 
    "Kellie", "Byron", "Elise", "Trenton", "Hope", "Steve", "Hayley", "Nickolas", 
    "Cierra", "Miles", "Kristi", "Tommy", "Kate", "Alec", "Summer", "Alfredo", "Aimee", 
    "Marcos", "Chelsie", "Kurt", "Sharon", "Andy", "Toni", "Deandre", "Karla", "Melvin", 
    "Alissa", "Morgan", "Devon", "Nelson", "Misty", "Harrison", "Regina", "Marshall", 
    "Jeanette", "Terrell", "Nikki", "Ernest", "Esther", "Francis", "Miriam", "Dale", 
    "Tatiana", "Dean", "Christy", "Desmond", "Charlotte", "Kelvin", "Maggie", 
    "Demetrius", "Stefanie", "Kendall", "Tessa", "Salvador", "Ruby", "Josue", 
    "Gabriella", "Leonard", "Hailey", "Gavin", "Ciara", "Karl", "Callie", "Glenn", 
    "Faith", "Quinton", "Paula", "Donovan", "Aubrey", "Franklin", "Asia", "Branden", 
    "Naomi", "Skyler", "Jazmine", "Nolan", "Jazmin", "Rene", "Carolina", "Kaleb", "Tia", 
    "Kody", "Ruth", "Jermaine", "Trisha", "Dwayne", "Rose", "Diego", "Kelley", "Lorenzo", 
    "Robyn", "Ernesto", "Jaime", "Riley", "Michaela", "Eugene", "Kassandra", "Stanley", 
    "Karissa", "Orlando", "Sonia", "Brady", "Melody", "Chance", "Christian", "Israel", 
    "Devin", "Jarrod", "Donna", "Jackson", "Helen", "Sebastian", "Brianne", "Damon", 
    "Kelsie", "Damian", "Clarissa", "Wade", "Lori", "Harold", "Marina", "Fabian", 
    "Adrianna", "Landon", "Cecilia", "Zachariah", "Shaniqua", "Giovanni", "Guadalupe", 
    "Ray", "Jill", "Tristan", "Rachelle", "Alvin", "Ashton", "Damien", "Cheyenne", 
    "Zackary", "Annie", "Angelo", "Sylvia", "Dane", "Taryn", "Alexis", "Roxanne", "Beau", 
    "Shayla", "Quentin", "Randi", "Kendrick", "Isabel", "Warren", "Leticia", "Gilbert", 
    "Mia", "Parker", "Eva", "Gustavo", "Katlyn", "Stuart", "Hanna", "Trey", "Alice", 
    "Clifford", "Jane", "Kirk", "Simone", "Barry", "Elisabeth", "Jordon", "Carol", 
    "Lamar", "Shana"];
var topLastNames1990 = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", 
    "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", 
    "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", 
    "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", 
    "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", 
    "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", 
    "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", 
    "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", 
    "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", 
    "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", 
    "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", 
    "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", 
    "Russell", "Griffin", "Diaz", "Hayes", "Myers", "Ford", "Hamilton", "Graham", 
    "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", 
    "Fisher", "Ellis", "Harrison", "Gibson", "McDonald", "Cruz", "Marshall", "Ortiz", 
    "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker", 
    "Porter", "Hunter", "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", 
    "Kennedy", "Warren", "Dixon", "Ramos", "Reyes", "Burns", "Gordon", "Shaw", "Holmes", 
    "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer", "Mills", "Nichols", 
    "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn", "Perkins", 
    "Hudson", "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", 
    "Arnold", "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", 
    "Snyder", "Hart", "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", 
    "Fox", "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence", "Elliott", 
    "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson", "Fields", 
    "Gutierrez", "Ryan", "Schmidt", "Carr", "Vasquez", "Castillo", "Wheeler", "Chapman", 
    "Oliver", "Montgomery", "Richards", "Williamson", "Johnston", "Banks", "Meyer", 
    "Bishop", "McCoy", "Howell", "Alvarez", "Morrison", "Hansen", "Fernandez", "Garza", 
    "Harvey", "Little", "Burton", "Stanley", "Nguyen", "George", "Jacobs", "Reid", "Kim", 
    "Fuller", "Lynch", "Dean", "Gilbert", "Garrett", "Romero", "Welch", "Larson", 
    "Frazier", "Burke", "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", 
    "Fowler", "Brewer", "Hoffman", "Carlson", "Silva", "Pearson", "Holland", "Douglas", 
    "Fleming", "Jensen", "Vargas", "Byrd", "Davidson", "Hopkins", "May", "Terry", 
    "Herrera", "Wade", "Soto", "Walters", "Curtis", "Neal", "Caldwell", "Lowe", 
    "Jennings", "Barnett", "Graves", "Jimenez", "Horton", "Shelton", "Barrett", 
    "O'Brien", "Castro", "Sutton", "Gregory", "McKinney", "Lucas", "Miles", "Craig", 
    "Rodriquez", "Chambers", "Holt", "Lambert", "Fletcher", "Watts", "Bates", "Hale", 
    "Rhodes", "Pena", "Beck", "Newman", "Haynes", "McDaniel", "Mendez", "Bush", "Vaughn", 
    "Parks", "Dawson", "Santiago", "Norris", "Hardy", "Love", "Steele", "Curry", 
    "Powers", "Schultz", "Barker", "Guzman", "Page", "Munoz", "Ball", "Keller", 
    "Chandler", "Weber", "Leonard", "Walsh", "Lyons", "Ramsey", "Wolfe", "Schneider", 
    "Mullins", "Benson", "Sharp", "Bowen", "Daniel", "Barber", "Cummings", "Hines", 
    "Baldwin", "Griffith", "Valdez", "Hubbard", "Salazar", "Reeves", "Warner", 
    "Stevenson", "Burgess", "Santos", "Tate", "Cross", "Garner", "Mann", "Mack", "Moss", 
    "Thornton", "Dennis", "McGee", "Farmer", "Delgado", "Aguilar", "Vega", "Glover", 
    "Manning", "Cohen", "Harmon", "Rodgers", "Robbins", "Newton", "Todd", "Blair", 
    "Higgins", "Ingram", "Reese", "Cannon", "Strickland", "Townsend", "Potter", 
    "Goodwin", "Walton", "Rowe", "Hampton", "Ortega", "Patton", "Swanson", "Joseph", 
    "Francis", "Goodman", "Maldonado", "Yates", "Becker", "Erickson", "Hodges", "Rios", 
    "Conner", "Adkins", "Webster", "Norman", "Malone", "Hammond", "Flowers", "Cobb", 
    "Moody", "Quinn", "Blake", "Maxwell", "Pope", "Floyd", "Osborne", "Paul", "McCarthy", 
    "Guerrero", "Lindsey", "Estrada", "Sandoval", "Gibbs", "Tyler", "Gross", 
    "Fitzgerald", "Stokes", "Doyle", "Sherman", "Saunders", "Wise", "Colon", "Gill", 
    "Alvarado", "Greer", "Padilla", "Simon", "Waters", "Nunez", "Ballard", "Schwartz", 
    "McBride", "Houston", "Christensen", "Klein", "Pratt", "Briggs", "Parsons", 
    "McLaughlin", "Zimmerman", "French", "Buchanan", "Moran", "Copeland", "Roy", 
    "Pittman", "Brady", "McCormick", "Holloway", "Brock", "Poole", "Frank", "Logan", 
    "Owen", "Bass", "Marsh", "Drake", "Wong", "Jefferson", "Park", "Morton", "Abbott", 
    "Sparks", "Patrick", "Norton", "Huff", "Clayton", "Massey", "Lloyd", "Figueroa", 
    "Carson", "Bowers", "Roberson", "Barton", "Tran", "Lamb", "Harrington", "Casey", 
    "Boone", "Cortez", "Clarke", "Mathis", "Singleton", "Wilkins", "Cain", "Bryan", 
    "Underwood", "Hogan", "McKenzie", "Collier", "Luna", "Phelps", "McGuire", "Allison", 
    "Bridges", "Wilkerson", "Nash", "Summers", "Atkins", "Wilcox", "Pitts", "Conley", 
    "Marquez", "Burnett", "Richard", "Cochran", "Chase", "Davenport", "Hood", "Gates", 
    "Clay", "Ayala", "Sawyer", "Roman", "Vazquez", "Dickerson", "Hodge", "Acosta", 
    "Flynn", "Espinoza", "Nicholson", "Monroe", "Wolf", "Morrow", "Kirk", "Randall", 
    "Anthony", "Whitaker", "O'Connor", "Skinner", "Ware", "Molina", "Kirby", "Huffman", 
    "Bradford", "Charles", "Gilmore", "Dominguez", "O'Neal", "Bruce", "Lang", "Combs", 
    "Kramer", "Heath", "Hancock", "Gallagher", "Gaines", "Shaffer", "Short", "Wiggins", 
    "Mathews", "McClain", "Fischer", "Wall", "Small", "Melton", "Hensley", "Bond", 
    "Dyer", "Cameron", "Grimes", "Contreras", "Christian", "Wyatt", "Baxter", "Snow", 
    "Mosley", "Shepherd", "Larsen", "Hoover", "Beasley", "Glenn", "Petersen", 
    "Whitehead", "Meyers", "Keith", "Garrison", "Vincent", "Shields", "Horn", "Savage", 
    "Olsen", "Schroeder", "Hartman", "Woodard", "Mueller", "Kemp", "Deleon", "Booth", 
    "Patel", "Calhoun", "Wiley", "Eaton", "Cline", "Navarro", "Harrell", "Lester", 
    "Humphrey", "Parrish", "Duran", "Hutchinson", "Hess", "Dorsey", "Bullock", "Robles", 
    "Beard", "Dalton", "Avila", "Vance", "Rich", "Blackwell", "York", "Johns", 
    "Blankenship", "Trevino", "Salinas", "Campos", "Pruitt", "Moses", "Callahan", 
    "Golden", "Montoya", "Hardin", "Guerra", "McDowell", "Carey", "Stafford", "Gallegos", 
    "Henson", "Wilkinson", "Booker", "Merritt", "Miranda", "Atkinson", "Orr", "Decker", 
    "Hobbs", "Preston", "Tanner", "Knox", "Pacheco", "Stephenson", "Glass", "Rojas", 
    "Serrano", "Marks", "Hickman", "English", "Sweeney", "Strong", "Prince", "McClure", 
    "Conway", "Walter", "Roth", "Maynard", "Farrell", "Lowery", "Hurst", "Nixon", 
    "Weiss", "Trujillo", "Ellison", "Sloan", "Juarez", "Winters", "McLean", "Randolph", 
    "Leon", "Boyer", "Villarreal", "McCall", "Gentry", "Carrillo", "Kent", "Ayers", 
    "Lara", "Shannon", "Sexton", "Pace", "Hull", "Leblanc", "Browning", "Velasquez", 
    "Leach", "Chang", "House", "Sellers", "Herring", "Noble", "Foley", "Bartlett", 
    "Mercado", "Landry", "Durham", "Walls", "Barr", "McKee", "Bauer"];

function randomizePerson(){
    document.getElementById("firstName").value = topFirstNames1990[Math.floor(Math.random()*topFirstNames1990.length)];
    if(Math.random()<0.8){
        document.getElementById("lastName").value = topLastNames1990[Math.floor(Math.random()*topLastNames1990.length)];
    }else{
        document.getElementById("lastName").value = topLastNames1990[Math.floor(Math.random()*topLastNames1990.length)];
        if(Math.random()<0.5){
            document.getElementById("lastName").value += " ";
        }else{
            document.getElementById("lastName").value += "-";
        }
        document.getElementById("lastName").value += topLastNames1990[Math.floor(Math.random()*topLastNames1990.length)]
    }
    document.getElementById("idNumber0").value = Math.floor(Math.random()*10000);
    if(document.getElementById("construct0").style.display==="none"){
        //it's a teacher!
        document.getElementById("1extra").value = sectionOrganizeOrder[Math.floor(Math.random()*sectionOrganizeOrder.length)];
    }else{
        //it's a student!
        document.getElementById("0extra").value = 9 + Math.floor(Math.random()*4);
    }
    checkEverything(0);
}

function randomizeSection(){
    document.getElementById("sectionSubject").value = sectionOrganizeOrder[Math.floor(Math.random()*sectionOrganizeOrder.length)];
    document.getElementById("sectionGrade").value = 9 + Math.floor(Math.random()*4);
    document.getElementById("sectionSize").value = 5 + 5*Math.floor(Math.random()*7);
    updateRange(document.getElementById("sectionSize").value);
    document.getElementById("sectionPeriod").value = Math.floor(Math.random()*8);
    document.getElementById("idNumber1").value = Math.floor(Math.random()*10000);
    var subjectTemp = document.getElementById("sectionSubject").value;
    var nameOptions = ["Introductory " + subjectTemp, "Introduction to " + subjectTemp, "Advanced " + subjectTemp,
        "First Year " + subjectTemp, "Second Year " + subjectTemp, "IB SL " + subjectTemp, "IB HL " + subjectTemp,
        "AP " + subjectTemp, "Aerobic " + subjectTemp, subjectTemp + " 101", subjectTemp + " 102", subjectTemp + " 201",
        subjectTemp + " 202", subjectTemp + " for Dummies", subjectTemp + " for Toddlers", subjectTemp + " for Angels",
        subjectTemp + " for Demons", subjectTemp + " for Computer Scientists", subjectTemp + " for Combat", 
        subjectTemp + " Studies", subjectTemp + " and Tolkien", subjectTemp + " in Depth",
        "Philosophical " + subjectTemp, "History of " + subjectTemp, "Criticisms of " + subjectTemp,
        subjectTemp + " with Supplementary Pyrotechnics", subjectTemp + " for Purposes of Literary Criticism",
        "Delayed " + subjectTemp, "Supplementary " + subjectTemp];
    document.getElementById("sectionName").value = nameOptions[Math.floor(Math.random()*nameOptions.length)];
    var teacherMenu = document.getElementById("teacher");
    teacherMenu.value = Math.floor(Math.random()*teacherMenu.length);
    checkEverything(1);
}

function checkEverything(checkNum){
    var buttonCodes = ['<button onclick="createPerson()" class="notDecorativeButton">Add this person</button>',
        '<button onclick="createSection()" class="notDecorativeButton">Add this section</button>'];
    var checks;
    if(checkNum===0){
        //check the person creator menu values
        checks = [checkName(document.getElementById("firstName").value, 'personButton', 'first name'),
            checkName(document.getElementById("lastName").value, 'personButton', 'last name'),
            checkIdNumber(document.getElementById("idNumber0").value, "person")];
        if(checks.indexOf(false)===-1){
            document.getElementById('personButton').innerHTML = buttonCodes[checkNum];
        }
    }else if(checkNum===1){
        //check the section creator menu values
        checks = [checkName(document.getElementById("sectionName").value, 'sectionButton', 'section name'),
            buildAvailableTeachersList(document.getElementById("sectionSubject").value),
            checkIdNumber(document.getElementById("idNumber1").value, "section")];
        if(checks[1]===true && !people[parseInt(document.getElementById("teacher").value)].sectionsTakenTaught
                [parseInt(document.getElementById("sectionPeriod").value)]===false){
            //buildAvailableTeachersList didn't throw an error, so a teacher exists for this subject. Now, check if
            //the teacher doesn't have that period free. If the period has a period free, expression will be true.
            document.getElementById('sectionButton').innerHTML = "The selected teacher is already teaching a section " +
                "during that period.";
        }else if(checks.indexOf(false)===-1){
            document.getElementById('sectionButton').innerHTML = buttonCodes[checkNum];
        }
    }
}

function checkName(thingName, buttonLocation, errorType){
    if(thingName===""){
        document.getElementById(buttonLocation).innerHTML = "Please enter a " + errorType + ".";
        return false;
    }
    var containsNonSpaceCharacters = false;
    for(var i = 0; i<thingName.length; i++){
        if(lettersOrder.indexOf(thingName[i].toLowerCase())===-1){
            document.getElementById(buttonLocation).innerHTML = "Your " + errorType + " contains illegal characters.";
            return false;
        }else if(lettersOrder.indexOf(thingName[i].toLowerCase())>0){
            containsNonSpaceCharacters = true;
        }
    }
    if(containsNonSpaceCharacters){
        //OK, name looks fine.
        return true;
    }else{
        document.getElementById(buttonLocation).innerHTML = "Your " + errorType + " must contain non-space characters.";
        return false;
    }
}

function checkIdNumber(idTestNumber, checkType){
    if (idTestNumber === "") {
        document.getElementById(checkType + "Button").innerHTML = "Please enter an ID number.";
        return false;
    }

    idTestNumber = parseInt(idTestNumber/1);
    if (isNaN(idTestNumber)) {
        document.getElementById(checkType + "Button").innerHTML = "ID numbers may only contain numbers.";
        return false;
    }else if(idTestNumber<0){
        document.getElementById(checkType + "Button").innerHTML = "ID numbers cannot be negative";
        return false;
    }

    var checkArray = [];
    if(checkType==="person"){
        checkArray = people.slice(0);
    }else if(checkType==="section"){
        checkArray = sectionsList.slice(0);
    }
    var checkIndex = checkArray.length - 1;
    while (checkIndex >= 0 && checkArray[checkIndex].idNumber !== idTestNumber) {
        checkIndex--;
    }
    if(checkIndex > -1) {
        document.getElementById(checkType + "Button").innerHTML = "This ID number has already been assigned to a " +
            checkType + ".";
        return false;
    }else{
        return true;
    }
}

function buildAvailableTeachersList(subjectNeeded){
    var numTeachers = 0;
    var selectList = "";
    document.getElementById("teacher").innerHTML = "";

    for(var checkSpot = studentsTeachersBorder; checkSpot<people.length; checkSpot++){
        if(people[checkSpot].subject === subjectNeeded){
            selectList += "<option value='" + checkSpot + "'>" + people[checkSpot].firstName + " " +
                people[checkSpot].lastName + "</option>";
            numTeachers++;
        }
    }
    if(subjectNeeded===""){
        document.getElementById("sectionButton").innerHTML = "Please select the subject for this section.";
        return false;
    }else if(numTeachers===0){
        document.getElementById("sectionButton").innerHTML = "You don't have any teachers for this subject.";
        return false;
    }else{
        document.getElementById("teacher").innerHTML = selectList;
        return true;
    }
}

function updateRange(rangeValue){
    document.getElementById("rangeValue").innerHTML = rangeValue;
}

function generateSectionName(subjectValue){
    if(subjectValue===""){
        document.getElementById('sectionName').value = "";
    }else if(document.getElementById('sectionName').value===""){
        document.getElementById('sectionName').value = subjectValue + ' 101';
    }
}

function studentTeacherChange(studentOrTeacher){
    showHideObject("construct" + studentOrTeacher, 2);
    if(studentOrTeacher===1){
        showHideObject("construct0")
    }else{
        showHideObject("construct1")
    }
    personType = studentOrTeacher;
    //hide the other one!
}

function showHideObject(objectID, typeThing){
    //if no typeThing given, it hides the object, otherwise, the typeThing determines whether it fades in or not
    if(typeThing===1){
        document.getElementById(objectID).style.visibility = "visible";
        document.getElementById(objectID).style.opacity = 1;
    }else if(typeThing===2){
        document.getElementById(objectID).style.display = "block";
    }else if(typeThing===3){
        document.getElementById(objectID).style.transition = "opacity 1s, visibility 1s";
        document.getElementById(objectID).style.opacity = 0;
        document.getElementById(objectID).style.visibility = "hidden";
    }else{
        document.getElementById(objectID).style.display = "none";
    }
}

/* This code was made redundant when I changed the page functionality, but I don't want to delete it because I might
use it later.

function throwWarning(warningInstance){
    var errorMessages = ["Please enter a valid ID number.", "That ID number is already in use. Please enter another.",
        "Your person must have a first and a last name."];
    document.getElementById("errorDiv").innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/' +
        'd/dd/Achtung.svg" style="width:200px"><br>' + "Uh oh, the program encountered an error:<br>" +
        errorMessages[warningInstance];
    showHideObject("errorDiv", 1);
}

function checkForIdNumber(idTestNumber){
    var locationIndex=people.length-1;
    while(locationIndex>=0 && people[locationIndex].idNumber!==idTestNumber){
        locationIndex--;
    }
    return locationIndex;
}
*/

function cellSet(cellNum){
    var displayValue = document.getElementById("schoolInfoInput" + cellNum).style.display;
    if(displayValue==="none" || displayValue===""){
        document.getElementById("schoolInfoInput" + cellNum).value = document.getElementById("schoolInfoText" + cellNum).innerHTML;
        document.getElementById("schoolInfoInput" + cellNum).style.display = "inline";
        document.getElementById("schoolInfoText" + cellNum).innerHTML = "";
    }else{
    	document.getElementById("schoolInfoInput" + cellNum).style.display = "none";
        document.getElementById("schoolInfoText" + cellNum).innerHTML =
        document.getElementById("schoolInfoInput" + cellNum).value;
    }
}

function buildDisplayTable(){
    var tableCode;
    tableCode = "<tr><th>Students</th><th>Teachers</th><th>Sections</th></tr>";
    for(var locationIndex=0; locationIndex<studentsTeachersBorder||locationIndex+studentsTeachersBorder<people.length||
        locationIndex<sectionsList.length; locationIndex++){
        tableCode+="<tr>";
        //generate next student entry
        if(locationIndex<studentsTeachersBorder){
            tableCode+="<td class='overflowTableCell'><div class='clickable noPadding' onclick='toggleDetails(\"person" + locationIndex 
            	+ "\")'>" + people[locationIndex].firstName + " " + people[locationIndex].lastName + "</div><div id='person" 
            	+ locationIndex + "' class='expandable expandableCell noPadding' style='height:0px;'>" + generateDetails(locationIndex, 0, true) + "</div></td>";
        }else{
            if(locationIndex===0){
                tableCode+="<td class='centerMe'>(none yet)</td>";
            }else{
                tableCode+="<td></td>";
            }
        }
        locationIndex+=studentsTeachersBorder;
        //generate next teacher entry
        if(locationIndex<people.length){
            tableCode+="<td class='overflowTableCell'><div class='clickable noPadding' onclick='toggleDetails(\"person" + locationIndex 
            	+ "\")'>" + people[locationIndex].firstName + " " + people[locationIndex].lastName + "</div><div id='person" 
            	+ locationIndex + "' class='expandable expandableCell noPadding' style='height:0px;'>" + generateDetails(locationIndex, 0, false) + "</div></td>";
        }else{
            if(locationIndex-studentsTeachersBorder===0){
                tableCode+="<td class='centerMe'>(none yet)</td>";
            }else{
                tableCode+="<td></td>";
            }
        }
        locationIndex-=studentsTeachersBorder;
        //generate next section entry
        if(locationIndex<sectionsList.length){
            tableCode+="<td class='overflowTableCell'><div class='clickable noPadding' onclick='toggleDetails(\"section" + locationIndex 
            	+ "\")'>" + sectionsList[locationIndex].name + "</div><div id='section" 
            	+ locationIndex + "' class='expandable expandableCell noPadding' style='height:0px;'>" + generateDetails(locationIndex, 2, true) + "</div></td>";
        }else{
            if(locationIndex===0){
                tableCode+="<td class='centerMe'>(none yet)</td>";
            }else{
                tableCode+="<td></td>";
            }
        }
        tableCode+="</tr>";
    }
    document.getElementById("displayPeople").innerHTML = tableCode;
}

function toggleDetails(elementName){
    var elementShortcut = document.getElementById(elementName).style;
    var personIndex = parseInt(elementName.slice(6, elementName.length));
    if(elementShortcut.height==="0px"){
    	if(elementName[0]==="p"){
    		elementShortcut.height="100px";
    	}else{
    		elementShortcut.height="230px";
    	}
    	elementShortcut.width="200px";
    }else{
    	elementShortcut.height="0px";
    	elementShortcut.width="0px";
    	if(elementName[0]==="p" && personIndex<studentsTeachersBorder){
    		showSectionsStudentCanTake(elementName);
    	}else if(elementName[0]==="s"){
            showStudentsCanTakeSection(elementName);
            showStudentsTakingSection(elementName);
        }
    }
}

function generateDetails(indexNeeded, objectType, addButton){
    var dataNeeded;
    if(objectType===0){
        dataNeeded = "ID Number: " + people[indexNeeded].idNumber;
        if(indexNeeded<studentsTeachersBorder){
            dataNeeded += "<br>Grade Level: " + people[indexNeeded].grade;
            dataNeeded += "<br>Sections Taken: " + createSectionsTaughtTakenList(people[indexNeeded].sectionsTakenTaught);
            if(addButton){
                dataNeeded += "<br><button onclick='showSectionsStudentCanTake(\"person" + indexNeeded + 
                    "\")' class='notDecorativeButton'>Add this student<br>to a section</button>";
                dataNeeded += "<div id='person" + indexNeeded + "AddSections' class='hiddenAtStart noPadding'>" + buildSectionsList(indexNeeded) + "</div>"
            }
        }else{
            dataNeeded += "<br>Subject Taught: " + people[indexNeeded].subject;
            dataNeeded += "<br>Sections Taught: " + createSectionsTaughtTakenList(people[indexNeeded].sectionsTakenTaught);
        }
    }else if(objectType===2){
        var teacherIndex = findIndexFromIdNumber(people, sectionsList[indexNeeded].teacher);
        dataNeeded = "Subject: " + sectionsList[indexNeeded].subject
            + "<br>Grade Level: " + sectionsList[indexNeeded].gradeLevel
            + "<br>Period: " + sectionsList[indexNeeded].period
            + "<br>Section ID: " + sectionsList[indexNeeded].idNumber
            + "<br>Max Size: " + sectionsList[indexNeeded].maxSize
            + "<br>Seats Remaining: " + sectionsList[indexNeeded].seatsRemaining()
            + "<br>Teacher: " + people[teacherIndex].firstName + " " + people[teacherIndex].lastName
            + "<br>Students: " + createListOfStudentsTakingSection(sectionsList[indexNeeded].studentsTaking);
        if(addButton){
            dataNeeded += "<br><button onclick='showStudentsCanTakeSection(\"section" + indexNeeded + 
                "\")' class='notDecorativeButton'>Add students to<br>this section</button>";
            dataNeeded += "<div id='section" + indexNeeded + "AddStudents' class='hiddenAtStart noPadding'>" + buildStudentsList(indexNeeded) + "</div>"
            dataNeeded += "<button onclick='showStudentsTakingSection(\"section" + indexNeeded + 
                "\")' class='notDecorativeButton' style='margin-top:5px;'>Remove students<br>from this section</button>";
            dataNeeded += "<div id='section" + indexNeeded + "RemoveStudents' class='hiddenAtStart noPadding'>" + buildStudentsTakingList(indexNeeded) + "</div>"
        }
    }
    return dataNeeded;
}

function createSectionsTaughtTakenList(sectionArray){
    var returnString = "";
    for(var i in sectionArray){
        if(sectionArray[i]!==false){
            if(returnString!==""){
                returnString+=", ";
            }
            returnString += "P" + sectionsList[findIndexFromIdNumber(sectionsList, sectionArray[i])].period
                + " "+ sectionsList[findIndexFromIdNumber(sectionsList, sectionArray[i])].name;
        }
    }
    if(returnString===""){
        returnString = "None";
    }
    return returnString;
}

function createListOfStudentsTakingSection(arrayOfStudents){
	var returnString = "";
	var studentIndex;
	for(var i in arrayOfStudents){
		if(returnString!==""){
            returnString+=", ";
        }
        studentIndex = findIndexFromIdNumber(people, arrayOfStudents[i]);
        returnString += people[studentIndex].firstName + " " + people[studentIndex].lastName;
	}
	if(returnString===""){
        returnString = "None";
    }
    return returnString;
}

function findIndexFromIdNumber(searchArray, idSearchNumber){
    //search up teachers and sectionsList by idNumber
    for(var returnIndex in searchArray){
    	if(searchArray[returnIndex].idNumber===idSearchNumber){
    		return returnIndex;
    	}
    }
    return -1;
    //this will definitely cause a glitch if it gets this far
}


function showSectionsStudentCanTake(locationID){
	if(document.getElementById(locationID).style.height==="100px"){
		document.getElementById(locationID).style.height = "230px";
		document.getElementById(locationID + "AddSections").style.display = "block";
		var indexNeeded = locationID.slice(6, locationID.length);
		document.getElementById(locationID + "AddSectionButton").innerHTML = 
	        checkSectionPossible(indexNeeded);
	}else{
		document.getElementById(locationID + "AddSections").style.display = "none";
		if(document.getElementById(locationID).style.height==="230px"){
			document.getElementById(locationID).style.height = "100px";
		}
	}
}
function buildSectionsList(indexNeeded){
    var returnStuff = "<select id='person" + indexNeeded + "AddSectionSelector' title='Select which section to add.'" + 
        "onchange='document.getElementById(\"person" + indexNeeded + "AddSectionButton\").innerHTML = checkSectionPossible(" 
        + indexNeeded + ")'>";
    var teacherIndex;
    for(var i in sectionsList){
    	teacherIndex = findIndexFromIdNumber(people, sectionsList[i].teacher);
        returnStuff += "<option value='" + i + "'>P" + sectionsList[i].period + " " + sectionsList[i].name + ", " 
        	+ people[teacherIndex].firstName + " " + people[teacherIndex].lastName + "</option>";
    }
    returnStuff += "</select>";
    returnStuff += "<br><div id='person" + indexNeeded + "AddSectionButton' class='formElementStuckHere'></div>";
    return returnStuff;
}
function checkSectionPossible(personIndex){
    //check if it's possible for the student to take this section
    var sectionIndex = parseInt(document.getElementById("person" + personIndex + "AddSectionSelector").value);
    if(isNaN(sectionIndex)){
        return "There are no sections.";
    }else if(sectionsList[sectionIndex].gradeLevel!==people[personIndex].grade){
        return "This student is not of the correct grade level for this section.";
    }else if(sectionsList[sectionIndex].seatsRemaining()===0){
        return "This section is already at capacity.";
    }else{
        return "<button onclick='addStudentToSection(" + sectionIndex + ", " + personIndex 
        	+ ")' class='notDecorativeButton'>Add this student to " + sectionsList[sectionIndex].name + "</button>";
    }
}


function showStudentsCanTakeSection(locationID){
    var currentPixelsHeight = parseInt(document.getElementById(locationID).style.height.slice(0,3));
    if(document.getElementById(locationID).style.height==="0px"){
        document.getElementById(locationID + "AddStudents").style.display = "none";
    }
    if(document.getElementById(locationID + "AddStudents").style.display === "block"){
        document.getElementById(locationID + "AddStudents").style.display = "none";
        if(document.getElementById(locationID).style.height!=="0"){
            document.getElementById(locationID).style.height = (currentPixelsHeight-70) + "px";
        }
    }else{
        if(document.getElementById(locationID).style.height!=="0px"){
            document.getElementById(locationID).style.height = (currentPixelsHeight+70) + "px";
            document.getElementById(locationID + "AddStudents").style.display = "block";
            var indexNeeded = locationID.slice(7, locationID.length);
            document.getElementById(locationID + "AddStudentButton").innerHTML = 
                checkStudentPossible(indexNeeded);
        }
    }
}
function buildStudentsList(indexNeeded){
    var returnStuff = "<select id='section" + indexNeeded + "AddStudentSelector' title='Select which student to add.'" + 
        "onchange='document.getElementById(\"section" + indexNeeded + "AddStudentButton\").innerHTML = checkStudentPossible(" 
        + indexNeeded + ")'>";
    for(var i =0; i<studentsTeachersBorder; i++){
        returnStuff += "<option value='" + i + "'>" + people[i].firstName + " " + people[i].lastName + "</option>";
    }
    returnStuff += "</select>";
    returnStuff += "<br><div id='section" + indexNeeded + "AddStudentButton' class='formElementStuckHere'></div>";
    return returnStuff;
}
function checkStudentPossible(sectionIndex){
    //check if it's possible for the student to take this section
    var personIndex = parseInt(document.getElementById("section" + sectionIndex + "AddStudentSelector").value);
    if(isNaN(personIndex)){
        return "There are no students.";
    }else if(sectionsList[sectionIndex].gradeLevel!==people[personIndex].grade){
        return "This student is not of the correct grade level for this section.";
    }else if(sectionsList[sectionIndex].seatsRemaining()===0){
        return "This section is already at capacity.";
    }else{
        return "<button onclick='addStudentToSection(" + sectionIndex + ", " + personIndex 
            + ")' class='notDecorativeButton'>Add this student to " + sectionsList[sectionIndex].name + "</button>";
    }
}


function showStudentsTakingSection(locationID){
    var currentPixelsHeight = parseInt(document.getElementById(locationID).style.height.slice(0,3));
    if(document.getElementById(locationID).style.height==="0px"){
        document.getElementById(locationID + "AddStudents").style.display = "none";
    }
    if(document.getElementById(locationID + "RemoveStudents").style.display === "block"){
        document.getElementById(locationID + "RemoveStudents").style.display = "none";
        if(document.getElementById(locationID).style.height!=="0"){
            document.getElementById(locationID).style.height = (currentPixelsHeight-75) + "px";
        }
    }else{
        if(document.getElementById(locationID).style.height!=="0px"){
            document.getElementById(locationID).style.height = (currentPixelsHeight+75) + "px";
            document.getElementById(locationID + "RemoveStudents").style.display = "block";
            var indexNeeded = locationID.slice(7, locationID.length);
            document.getElementById(locationID + "RemoveStudentButton").innerHTML = 
                updateRemoveStudentButton(indexNeeded);
        }
    }
}
function buildStudentsTakingList(indexNeeded){
    var returnStuff = "<select id='section" + indexNeeded + "RemoveStudentSelector' title='Select which student to remove.'" + 
        "onchange='document.getElementById(\"section" + indexNeeded + "RemoveStudentButton\").innerHTML = updateRemoveStudentButton(" 
        + indexNeeded + ")'>";
    for(var i in sectionsList[indexNeeded].studentsTaking){
        var studentIndexInPeopleArray = findIndexFromIdNumber(people, sectionsList[indexNeeded].studentsTaking[i])
        returnStuff += "<option value='" + studentIndexInPeopleArray 
            + "'>" + people[studentIndexInPeopleArray].firstName + " " + people[studentIndexInPeopleArray].lastName + "</option>";
    }
    returnStuff += "</select>";
    returnStuff += "<br><div id='section" + indexNeeded + "RemoveStudentButton' class='formElementStuckHere'></div>";
    return returnStuff;
}
function updateRemoveStudentButton(sectionIndex){
    var personIndex = parseInt(document.getElementById("section" + sectionIndex + "RemoveStudentSelector").value);
    if(isNaN(personIndex)){
        return "There are no students taking this class.";
    }else{
        return "<button onclick='removeStudentFromSection(" + sectionIndex + ", " + personIndex 
            + ")' class='notDecorativeButton'>Remove this student from " + sectionsList[sectionIndex].name + "</button>";
    }
}


function addStudentToSection(sectionIndex, personIndex){
    var periodNeeded = sectionsList[sectionIndex].period;
    var sectionInThatPeriod = people[personIndex].sectionsTakenTaught[periodNeeded];
    if(sectionInThatPeriod!==false){
    	if(!confirm(people[personIndex].firstName + " " + people[personIndex].lastName + " is already taking " 
    		+ sectionsList[findIndexFromIdNumber(sectionsList, sectionInThatPeriod)].name + " during this period." 
        	+ " Replace that section with this one?")){
    		return;
	    	//if you're in here, then they returned false to the check, and they don't want to replace the section.
	    	//so quit the loop.
    	}
        //if you're here, they returned true to the check, they do want to replace the section.
        //AND we know that they're already taking a section in that period
        //so we need to remove them from that original sections' list of students.
        var originalSectionIDNumber = people[personIndex].sectionsTakenTaught[periodNeeded];
        var originalSectionIndex = findIndexFromIdNumber(sectionsList, originalSectionIDNumber);
        sectionsList[originalSectionIndex].removeStudent(personIndex);
        //the above line of code deletes one element at the index of the student's ID number within the array of ID numbers
        //of students taking the class, removing the student from the class students list.
        //However, this means we're going to have to re-update the entire info table after this function is done
        //because the old student list is still stored in the class's information list.
    }
    //if you've gotten here, that means either the student isn't taking a class in that period yet
    //so you're good, or they have one but they've responded that yes, they want to replace the old class with this one.
    sectionsList[sectionIndex].addStudent(personIndex); //add student to the section's array of students
    people[personIndex].sectionsTakenTaught[periodNeeded] = sectionsList[sectionIndex].idNumber; //add section to student's array of sections
    buildDisplayTable();
}

function removeStudentFromSection(sectionIndex, personIndex){
    var periodNeeded = sectionsList[sectionIndex].period;
    sectionsList[sectionIndex].removeStudent(personIndex);
    people[personIndex].sectionsTakenTaught[periodNeeded] = false;
    buildDisplayTable();
}

function toggleSearchMenu(){
    var elementShortcut = document.getElementById("searchMenu").style;
	if(elementShortcut.height==="210px"){
        document.getElementById("searchHeader").style.display = "inline";
        elementShortcut.transition = "height 0.5s ease-out, width 0.5s 0.5s ease-out";
		elementShortcut.height = "0px";
        elementShortcut.width = "0px";
        document.getElementById("searchResults").innerHTML = "";
        for(var i = 0; i<3; i++){
            document.getElementById(currentSearchType + "search" + i).value = "";
        }
	}else{
		document.getElementById("searchHeader").style.display = "block";
        elementShortcut.transition = "height 0.5s 0.5s ease-out, width 0.5s ease-out";
        elementShortcut.height = "210px";
        elementShortcut.width = "400px";
        document.getElementById("searchResults").innerHTML = "";
	}
}

var currentSearchType = 0;
function showHideSearchMenus(showMenuNum){
    for(var i = 0; i<3; i++){
        document.getElementById(currentSearchType + "search" + i).value = "";
    }
    document.getElementById("searchResults").innerHTML = "";
    document.getElementById("searchMenu").style.height = "210px";
    currentSearchType = showMenuNum;
    var i;
    for(i = 0; i<3; i++){
        var tempElementShortcut = document.getElementById("subSearchMenu" + i).style;
        if(i===showMenuNum){
            tempElementShortcut.display = "block";
        }else{
            tempElementShortcut.display = "none";
        }
    }
}

function searchStuff(){
    var checkCriteria = [document.getElementById(currentSearchType + "search0").value, 
        document.getElementById(currentSearchType + "search1").value, 
        document.getElementById(currentSearchType + "search2").value];
    var wantedObjects = [];
    var passedChecks;
    if(currentSearchType===0){
        for(var i=0; i<studentsTeachersBorder; i++){
            passedChecks = 0;
            if(checkCriteria[0]===""||checkCriteria[0]===people[i].firstName){
                passedChecks++;
            }
            if(checkCriteria[1]===""||checkCriteria[1]===people[i].lastName){
                passedChecks++;
            }
            if(checkCriteria[2]===""||parseInt(checkCriteria[2])===people[i].grade){
                passedChecks++;
            }
            if(passedChecks===3){
                wantedObjects.splice(wantedObjects.length, 0, i);
            }
        }
    }else if(currentSearchType===1){
        for(var i = studentsTeachersBorder; i<people.length; i++){
            passedChecks = 0;
            if(checkCriteria[0]===""||checkCriteria[0]===people[i].firstName){
                passedChecks++;
            }
            if(checkCriteria[1]===""||checkCriteria[1]===people[i].lastName){
                passedChecks++;
            }
            if(checkCriteria[2]===""||checkCriteria[2]===people[i].subject){
                passedChecks++;
            }
            if(passedChecks===3){
                wantedObjects.splice(wantedObjects.length, 0, i);
            }
        }
    }else{
        for(var i in sectionsList){
            passedChecks = 0;
            if(checkCriteria[0]===""||checkCriteria[0]===sectionsList[i].name){
                passedChecks++;
            }
            if(checkCriteria[1]===""||checkCriteria[1]===sectionsList[i].subject){
                passedChecks++;
            }
            if(checkCriteria[2]===""||parseInt(checkCriteria[2])===sectionsList[i].gradeLevel){
                passedChecks++;
            }
            if(passedChecks===3){
                wantedObjects.splice(wantedObjects.length, 0, i);
            }
        }
    }
    var searchResultsTable = "<table><tr><th>Search Results</th></tr>";
    for (var i in wantedObjects){
        searchResultsTable+="<tr><td>";
        if(currentSearchType<2){
            searchResultsTable+=people[wantedObjects[i]].firstName + " " + people[wantedObjects[i]].lastName + "<br>";
            searchResultsTable+=generateDetails(wantedObjects[i], 0, false);
        }else{
            searchResultsTable+=sectionsList[wantedObjects[i]].name + "<br>";
            searchResultsTable+=generateDetails(wantedObjects[i], 2, false);
        }
        searchResultsTable+="</td></tr>";
    }
    if(searchResultsTable==="<table><tr><th>Search Results</th></tr>"){
        var searchTypes = ["students", "teachers", "sections"];
        searchResultsTable+="<tr><td>No " + searchTypes[currentSearchType] + " were found matching these search criteria.</td></tr>"
    }
    searchResultsTable+="</table>";
    document.getElementById("searchResults").innerHTML = searchResultsTable;
    if(wantedObjects.length===0){
        document.getElementById("searchMenu").style.height = "290px";
    }else if(wantedObjects.length>=5){
        document.getElementById("searchMenu").style.height = "650px";
    }else{
        document.getElementById("searchMenu").style.height = ((wantedObjects.length)*80)+250 + "px";
    }
    
}