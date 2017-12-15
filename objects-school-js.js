function testScript(){
    //things
}


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
    this.students = [];
};

//var Section = function(name, teacher, subject, maxSize, )

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
    people[alphabetizeLocation].sections = [false, false, false, false, false, false, false, false];
    buildDisplayTable();
    var schoolData = [studentsTeachersBorder, people.length-studentsTeachersBorder,
        (people.length-studentsTeachersBorder)/studentsTeachersBorder];
    for(var i in schoolData){
        document.getElementById("schoolData" + i).innerHTML = schoolData[i].toString();
    }
    document.getElementById("personButton").innerHTML = "Person added!";
}

sectionOrganizeOrder = ["English", "Math", "History", "Science", "Social Sciences", "Art", "Music", "Performing Arts",
    "Computer Science", "Foreign Language"];
function createSection(){
    //adds the section idNumber to the teacher in the given period slot
    people[parseInt(document.getElementById("teacher").value)].sections[parseInt(document.getElementById
        ("sectionPeriod").value)] = parseInt(document.getElementById("idNumber1").value);
    var tempIdNumber = parseInt(document.getElementById("idNumber1").value);
    var tempSubject = document.getElementById("sectionSubject").value;

    var alphabetizeLocation = sectionsList.length-1;
    while(alphabetizeLocation>=0 && (sectionOrganizeOrder.indexOf(tempSubject)>=
            sectionOrganizeOrder.indexOf(sectionsList[alphabetizeLocation].subject)
            && tempIdNumber>sectionsList[alphabetizeLocation].idNumber)){
        alphabetizeLocation--;
    }
    sectionsList.splice(alphabetizeLocation, 0, new Section(document.getElementById("sectionName").value,
        tempSubject, parseInt(document.getElementById("sectionGrade").value),
        document.getElementById("sectionPeriod").value, tempIdNumber,
        parseInt(document.getElementById("sectionSize").value),
        people[parseInt(document.getElementById("teacher").value)].idNumber));
    buildDisplayTable();
    document.getElementById("sectionButton").innerHTML = "Section added!";
}

var lettersOrder = [" ", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
    "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
//alphabetize is working weirdly
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
    }
}

function checkEverything(checkNum){
    var buttonCodes = ['<button onclick="createPerson()" class="notDecorativeButton">Add this person</button>',
        '<button onclick="createSection()" class="notDecorativeButton">Add this section</button>'];
    var checks;
    if(checkNum===0){
        //check the person creator menu values
        /*checkName(document.getElementById("firstName").value, 'personButton', 'first name');
        checkName(document.getElementById("lastName").value, 'personButton', 'last name');
        checkIdNumber(document.getElementById("idNumber0").value);*/
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
        if(checks[1]===true && !people[parseInt(document.getElementById("teacher").value)].sections
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

    idTestNumber = parseInt(idTestNumber);
    if (idTestNumber.toString() === "NaN") {
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

function generateClassName(subjectValue){
    if(subjectValue===""){
        document.getElementById('sectionName').value = "";
    }else{
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
    if(displayValue==="inline" || displayValue===""){
        document.getElementById("schoolInfoInput" + cellNum).style.display = "none";
        document.getElementById("schoolInfoText" + cellNum).innerHTML =
            document.getElementById("schoolInfoInput" + cellNum).value;
    }else{
        document.getElementById("schoolInfoInput" + cellNum).style.display = "inline";
        document.getElementById("schoolInfoText" + cellNum).innerHTML = "";
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
            tableCode+="<td id='person" + locationIndex + "' onmouseover='displayDetails(this.id, 0)' " +
                "onmouseleave='displayDetails(this.id, 1)' class='overflowTableCell'>" + people[locationIndex].firstName
                + " " + people[locationIndex].lastName + "</td>";
        }else{
            if(locationIndex===0){
                tableCode+="<td class='centerMe'>(none yet)</td>"
            }else{
                tableCode+="<td></td>";
            }
        }
        locationIndex+=studentsTeachersBorder;
        //generate next teacher entry
        if(locationIndex<people.length){
            tableCode+="<td id='person" + locationIndex + "' onmouseover='displayDetails(this.id, 0)' " +
                "onmouseleave='displayDetails(this.id, 1)' class='overflowTableCell'>" + people[locationIndex].firstName
                + " " + people[locationIndex].lastName + "</td>";
        }else{
            if(locationIndex-studentsTeachersBorder===0){
                tableCode+="<td class='centerMe'>(none yet)</td>"
            }else{
                tableCode+="<td></td>";
            }
        }
        locationIndex-=studentsTeachersBorder;
        //generate next section entry
        if(locationIndex<sectionsList.length){
            tableCode+="<td id='section" + locationIndex + "' onmouseover='displayDetails(this.id, 0)' " +
                "onmouseleave='displayDetails(this.id, 1)' class='overflowTableCell'>" + sectionsList[locationIndex].name +
                "</td>";
        }else{
            if(locationIndex===0){
                tableCode+="<td class='centerMe'>(none yet)</td>"
            }else{
                tableCode+="<td></td>";
            }
        }
        tableCode+="</tr>"
    }
    document.getElementById("displayPeople").innerHTML = tableCode;
}

function displayDetails(idName, inOrOut){
    var indexNeeded = parseInt(idName.slice(6, idName.length));
    var dataNeeded;
    if(idName[0]==="p"){
        if(inOrOut===0){
            dataNeeded = "First Name: " + people[indexNeeded].firstName + "<br>Last Name: " +
                people[indexNeeded].lastName + "<br>ID Number: " + people[indexNeeded].idNumber;
            if(indexNeeded<studentsTeachersBorder){
                dataNeeded += "<br>Grade Level: " + people[indexNeeded].grade;
                dataNeeded += "<br>Classes Taken: " + sectionsTaughtList(people[indexNeeded].sections);
                dataNeeded += "<button id='addClassButton' onclick='buildClassesStudentCanTake(" +
                    people[indexNeeded].grade + ", "  +
                    people[indexNeeded].sections + "," + idName + ")' class='notDecorativeButton'>Add this student" +
                    "<br>to a section</button>";
                var workingHere; //to add button to add student to class
            }else{
                dataNeeded += "<br>Subject Taught: " + people[indexNeeded].subject;
                dataNeeded += "<br>Classes Taught: " + sectionsTaughtList(people[indexNeeded].sections);
            }
        }else{
            dataNeeded = people[indexNeeded].firstName + " " + people[indexNeeded].lastName;
        }
    }else if(idName[0]==="s"){
        if(inOrOut===0){
            var teacherIndex = findIndexFromIdNumber(people, sectionsList[indexNeeded].teacher);
            dataNeeded = "Section Name: " + sectionsList[indexNeeded].name
                + "<br>Subject: " + sectionsList[indexNeeded].subject
                + "<br>Grade Level: " + sectionsList[indexNeeded].gradeLevel
                + "<br>Period: " + sectionsList[indexNeeded].period
                + "<br>Section ID: " + sectionsList[indexNeeded].idNumber
                + "<br>Max Size: " + sectionsList[indexNeeded].maxSize
                + "<br>Teacher: " + people[teacherIndex].firstName
                + " " + people[teacherIndex].lastName
                + "<br>Students: ";
            if(sectionsList[indexNeeded].students.length>0){
                dataNeeded += sectionsList[indexNeeded].students;
            }else{
                dataNeeded += "None";
            }
        }else{
            dataNeeded = sectionsList[indexNeeded].name;
        }
    }
    document.getElementById(idName).innerHTML = dataNeeded;
}

function sectionsTaughtList(sectionArray){
    var returnString = "";
    for(var i in sectionArray){
        if(sectionArray[i]!==false){
            if(returnString!==""){
                returnString+=", ";
            }
            returnString += sectionsList[findIndexFromIdNumber(sectionsList, sectionArray[i])].name;
        }
    }
    if(returnString===""){
        returnString = "None";
    }
    return returnString;
}

function findIndexFromIdNumber(searchArray, idSearchNumber){
    //search up teachers and sectionsList by idNumber
    var returnIndex = 0;
    while(searchArray[returnIndex].idNumber!==idSearchNumber){
        returnIndex++;
    }
    return returnIndex;
}

function buildClassesStudentCanTake(studentGrade, currentClassesTaken, location){
    var errorHereQuestionMark;
    console.log("noError");
    var selectMenu = "<select>";
    for(var i in sectionsList){
        if(sectionsList[i].gradeLevel===studentGrade && currentClassesTaken[sectionsList[i].period]===false){
            selectMenu+="<option value='" + sectionsList[i].idNumber + "'>" + sectionsList[i].name + "</option>";
        }
    }
    selectMenu+="</select>";
    document.getElementById(location).innerHTML += selectMenu;
    document.getElementById("addClassButton").innerHTML = "Add this student<br>to this section";
    document.getElementById("addClassButton").onclick = console.log("yeah");
}

function addStudentToClass(){
    //stuff!
}