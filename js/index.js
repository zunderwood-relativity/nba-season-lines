const listTeams = () => document.getElementById("teams");
const searchTeams = () => document.getElementById("search-teams")
let teamArr = [];
let teamLineArr = [];

//add data from JSON server and event listeners & other actions moving forward
const renderTeam = (team) => {
    //create teamDiv container
    const teamDiv = document.createElement("div");
    teamDiv.id = `team-${team.teamId}`;
    teamDiv.className = 'team-div';

    //create teamname H2
    const teamName = document.createElement("h2");
    teamName.textContent = team.fullName;
    //create teamLogo Image

    const teamLogo = document.createElement("img");
    teamLogo.src = team.logo;

    //create buttonOver with initial text
    const buttonOver = document.createElement("button");
    buttonOver.id = `team-${team.teamId}-over`;
    buttonOver.className = 'team-line-over';
    buttonOver.innerHTML = 'OVER<br>';

    //create buttonUnder with intitial text
    const buttonUnder = document.createElement("button");
    buttonUnder.id = `team-${team.teamId}-under`;
    buttonUnder.className = 'team-line-under';
    buttonUnder.innerHTML = 'UNDER<br>';

    //add elements to div container
    teamDiv.append(teamName, teamLogo, buttonUnder, buttonOver);
    listTeams().appendChild(teamDiv);
       
    //console.log(team);
}

const renderTeamLine = (team) => {
    //grab elements
    const grabTeamDiv = () => document.getElementById(`team-${team.teamId}`);
    const grabButtonOver = () => document.getElementById(`team-${team.teamId}-over`);
    const grabButtonUnder = () => document.getElementById(`team-${team.teamId}-under`);

    //create teamLine element
    const teamLine = document.createElement("p");
    teamLine.id = `teamLine-${team.teamId}`;
    teamLine.className = 'teamLine';
    teamLine.textContent = team.teamLine;

    //create percentage bar
    const pctBar = document.createElement('div');
    pctBar.id = `pctBar-${team.teamId}`;
    pctBar.className = 'pctBar';

    //create pctUnder
    const pctUnder = document.createElement("div");
    pctUnder.id = `pctUnder-${team.teamId}`;
    pctUnder.className = 'pctUnder';
    pctUnder.innerHTML = '%'

    //create pctOver
    const pctOver = document.createElement("div");
    pctOver.id = `pctOver-${team.teamId}`;
    pctOver.className = 'pctOver';
    pctOver.innerHTML = '%';

    grabTeamDiv().append(teamLine, pctBar)
    const grabPctBar = () => document.getElementById(`pctBar-${team.teamId}`);
    grabPctBar().append(pctUnder, pctOver);
    //grabPctBar().append(pctUnder, pctOver);
    //insert teamLine between Over/Under buttons
    grabTeamDiv().append(teamLine, pctBar)
    //const insertAfter = (referenceNode, newNode) => referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    //insertAfter(grabButtonUnder(`team-${team.teamId}-under`), teamLine);

    //add over/unders odds to button text
    grabButtonOver(`team-${team.teamId}-over`).innerHTML += `${team.oddsOver}`;
    grabButtonUnder(`team-${team.teamId}-under`).innerHTML += `${team.oddsUnder}`;

//counter function to increase countOver in db.json
const plusOver = () => {
    const teamId = team.teamId;
    const updatedTeam = teamLineArr.find(team => team.teamId === teamId);
    updatedTeam.countOver++;
    let countOver = parseInt(updatedTeam.countOver);
    
    
    const countOverObj = {
        countOver
    }
    const patchData = {
        method: 'PATCH',
        headers: {
         'Content-type': 'application/json'
        },
        body: JSON.stringify(countOverObj)
       }
    const updateCounts = (teamId) => {
        fetch(`http://localhost:3000/teamData/${teamId}`, patchData)
        .then(res => res.json())
        .then(data => console.log(data))
    }
    updateCounts(teamId);
}

//counter function to incrase countUnder in db.json
const plusUnder = () => {
    const teamId = team.teamId;
    const updatedTeam = teamLineArr.find(team => team.teamId === teamId);
    updatedTeam.countUnder++;
    let countUnder = parseInt(updatedTeam.countUnder);
    
    const countUnderObj = {
        countUnder
    }
    const patchData = {
        method: 'PATCH',
        headers: {
         'Content-type': 'application/json'
        },
        body: JSON.stringify(countUnderObj)
       }
    
    const updateCounts = (teamId) => {
        fetch(`http://localhost:3000/teamData/${teamId}`, patchData)
        .then(res => res.json())
        .then(data => console.log(data))
    }
    updateCounts(teamId);
}
//add eventlisteners to over/under buttons
grabButtonOver(`team-${team.teamId}-over`).addEventListener('click', plusOver);
grabButtonUnder(`team-${team.teamId}-under`).addEventListener('click', plusUnder)
}

//iterate over API team data and pass to renderTeam
const displayTeams = (teams) => {
    teamArr = teams;
    teams.forEach(team => renderTeam(team));
}

//iterate over JSON data and pass to renderTeamLine
const displayTeamLineInfo = (teamLineInfo) => {
    teamLineArr = teamLineInfo;
    teamLineInfo.forEach(team => renderTeamLine(team))
}

//fetch GET API & JSON data
const fetchTeams = () => {
    fetch("https://api-nba-v1.p.rapidapi.com/teams/league/standard", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
		"x-rapidapi-key": "eea0f00af2msh1d7263f0e338362p1c74e0jsn3f1c0b5b1925"
	}
})
.then(res => res.json())
.then(data => {
    const teams = data.api.teams.filter(team => team.nbaFranchise === "1" & team.allStar === "0")
    displayTeams(teams);
})
.then(() => fetch("http://localhost:3000/teamData"))
    .then(res => res.json())
    .then(data => {
        const teamLineInfo = data;
        //debugger
        displayTeamLineInfo(teamLineInfo)
        console.log(teamLineInfo)
        })
.catch(err => {
	console.error(err);
})
};

//render team and teamline info based on search
const handleSearch = (e) => {
    const searchText = e.target.value;
    listTeams().innerHTML = "";
    //invoke renderTeam on filtered teams from search
    const searchedTeams = teamArr.filter(team => team.fullName.toLowerCase().startsWith(searchText) || team.nickname.toLowerCase().startsWith(searchText))
    if(searchText === "" || searchedTeams.length === 0) {
        noResults();
    } else {
        searchedTeams.forEach(renderTeam)
        //invoke renderTeamLines on filtered teams from search
        const searchedTeamIds = searchedTeams.map(team => team.teamId)
        const searchedTeamLines = teamLineArr.filter(team => searchedTeamIds.includes(team.teamId))
        searchedTeamLines.forEach(renderTeamLine);
    }
    searchTeams().value = "";
}

//invoke if no search results are found
const noResults = () => {
    const div = document.createElement("div");
    div.className = 'card-alert-warning';

    const header = document.createElement("h2")
    header.textContent = "No teams found, please check your search and try again."

    div.append(header);
    listTeams().appendChild(div);
}

//fetch API and JSON data, eventlistener on search field
const handlePageLoaded = () => {
    fetchTeams();
    searchTeams().addEventListener("change", handleSearch)
}

//Run fetch on DOMContentLoaded
document.addEventListener("DOMContentLoaded", handlePageLoaded);
