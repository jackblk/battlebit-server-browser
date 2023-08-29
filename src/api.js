import { startCase } from "lodash";

const gamemodeMapping = {
  CashRun: "Cash Run",
  CaptureTheFlag: "Capture The Flag",
  CONQ: "Conquest",
  DOMI: "Domination",
  FRONTLINE: "Frontline",
  GunGameFFA: "Gun Game Free For All",
  GunGameTeam: "GunG ame Team",
  FFA:"FFA",
  ELI:"Elimiation",
  CatchGame:"Catch Hide",
  SuicideRush:"Suicide Rush",
  Infected:"Infected",
  INFCONQ: "Infantry Conquest",
  RUSH: "Rush",
  TDM: "Team Deathmatch",
  VoxelFortify: "Voxel Fortify",
};

function addFlagToRegion(region) {
  const flagMapping = {
    america: "",
    australia: "",
    brazil: "",
    europe: "",
    japan: "",
    africa:"",
    asia: "",
    developer:"",
  };

  const lowerRegion = region.toLowerCase();
  for (const key in flagMapping) {
    const lowerKey = key.toLowerCase();
    if (lowerRegion.includes(lowerKey)) {
      const flag = flagMapping[key];
      return `${flag} ${startCase(region)}`;
    }
  }

  return startCase(region); // If no matching key found
}

export const serverListKeys = {
  name: "Name",
  map: "Map",
  mapSize: "MapSize",
  gamemode: "Gamemode",
  region: "Region",
  players: "Players",
  queuePlayers: "QueuePlayers",
  maxPlayers: "MaxPlayers",
  hz: "Hz",
  dayNight: "DayNight",
  isOfficial: "IsOfficial",
  hasPassword: "HasPassword",
  antiCheat: "AntiCheat",
  build: "Build",
  // added keys
  key: "key",
  playersStatus: "PlayersStatus",
  statusColor: "statusColor",
};

export async function fetchServerList() {
  const response = await fetch(
    "https://publicapi.battlebit.cloud/Servers/GetServerList"
  );
  const data = await response.json();

  data.forEach((server) => {
    server.key = `${server.Name}_${server.Region}_${server.Map}`;

    // Manipulate data to make it easier to display
    server.IsOfficial = server.IsOfficial ? "Official" : "Community";
    server.HasPassword = server.HasPassword ? "Yes" : "No";

    // New column for server status (players, queue, max players)
    server.PlayersStatus =
      server.QueuePlayers > 0
        ? `${server.Players}[+${server.QueuePlayers}]/${server.MaxPlayers}`
        : `${server.Players}/${server.MaxPlayers}`;

    // Data for server status color
    if (server.Players + server.QueuePlayers === server.MaxPlayers) {
      server.statusColor = "magenta";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.85) {
      server.statusColor = "red";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.70) {
      server.statusColor = "orange";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.50) {
      server.statusColor = "green";
    } else if (server.Players + server.QueuePlayers >= server.MaxPlayers * 0.25) {
      server.statusColor = "blue";
    } else {
      server.statusColor = "";
    }

    // Gamemode mapping
    if (Object.keys(gamemodeMapping).includes(server.Gamemode)) {
      server.Gamemode = gamemodeMapping[server.Gamemode];
    } else {
      server.Gamemode = startCase(server.Gamemode);
    }

    // Map name formatting
    server.Map = startCase(server.Map);

    // Flag mapping
    server.Region = addFlagToRegion(server.Region);

    // Day/Night mapping
    if (server.DayNight.toLowerCase() === "day") {
      server.DayNight = " " + server.DayNight;
    } else if (server.DayNight.toLowerCase() === "night") {
      server.DayNight = " " + server.DayNight;
    }

    // HasPassword mapping
    if (server.HasPassword.toLowerCase() === "yes") {
      server.HasPassword = " " + server.HasPassword;
    }
    
    // 计算区服内玩家的总数
    const totalPlayers = server.Players + server.QueuePlayers;
    if (regionCounts[server.Region]) {
        regionCounts[server.Region] += totalPlayers;
    } else {
        regionCounts[server.Region] = totalPlayers;
    }
  });
  const res = {
    data,
    regionCounts
  }

  return res;
