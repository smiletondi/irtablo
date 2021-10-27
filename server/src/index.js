import produce from "immer";
import { Router } from "itty-router";
import { nanoid } from "nanoid";

const defaultData = { games: [] };
const cacheKey = "games";

// now let's create a router (note the lack of "new")
const router = Router();

const getCache = async (key) => {
  const result = await GAMES.get(key);
  return JSON.parse(result);
};
const setCache = (key, data) => GAMES.put(key, JSON.stringify(data));
// const setCache = (key, data) => GAMES.put(key, data, { expiration: 60 });
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-type": "application/json",
};
const getGames = async (request) => {
  //   const incomingUrl = new URL(request?.url);
  //   const inputData = incomingUrl?.searchParams.values();
  const cache = await getCache(cacheKey);
  let data = null;
  if (!cache) {
    await setCache(cacheKey, defaultData);
    data = defaultData;
  } else {
    data = cache;
  }
  const body = JSON.stringify(data);
  return new Response(body, {
    headers,
  });
};
const getPlayerRounds = (game, playerId) =>
  game?.rounds
    ?.filter((round) =>
      round?.players?.find((roundPlayer) => roundPlayer?.id === playerId)
    )
    ?.map((round) => ({
      id: round?.id,
      points: round?.players?.find(
        (roundPlayer) => roundPlayer?.id === playerId
      )?.points,
    })) || [];
const transformGame = (game) => {
  const players = game?.players?.map((player) => ({
    ...player,
    points: [...getPlayerRounds(game, player?.id)].reduce(
      (total, current) => total + (+current?.points || 0),
      0
    ),
    lastRoundId: [...getPlayerRounds(game, player?.id)]?.length,
  }));
  const playingPlayers = players?.filter(
    (player) => player?.points < game?.max_points
  );
  const outOfGamePlayers = players?.filter(
    (player) => player?.points >= game?.max_points
  );

  return {
    ...game,
    players,
    playingPlayers,
    outOfGamePlayers,
  };
};
const getGame = async (request) => {
  const gameId = request?.params?.id;
  const cache = await getCache(cacheKey);
  const currentState = cache || defaultData;
  const game = currentState?.games?.find((game) => game?.id === gameId);
  const transformedGame = transformGame(game);

  const body = JSON.stringify(transformedGame);
  return new Response(body, { status: 200, headers });
};
// const updateGames = async (request) => {
//   const input = await request.formData();
//   const inputData = Object.fromEntries(input);
//   console.log("🚀 ~ file: worker.js ~ line 42 ~ fetch ~ inputData", inputData);
//   // const cache = await getCache(cacheKey);
//   // let data = null;
//   // await setCache(cacheKey, JSON.stringify(defaultData));
//   // data = defaultData;
//   return new Response(defaultData, {
//     headers: { "Content-Type": "application/json" },
//   });
// };
const addGame = async (request) => {
  const input = await request.json();
  let cache = await getCache(cacheKey);
  const currentState = cache || defaultData;
  const newGameId = nanoid(4);
  const newState = produce(currentState, (draft) => {
    const players = input?.players?.map((playerName) => {
      const id = nanoid(3);
      return {
        id,
        name: playerName,
      };
    });
    draft.games = !draft?.games ? [] : draft?.games;
    draft.games.push({
      id: newGameId,
      title: input?.title,
      max_points: input?.max_points,
      created_at: new Date().toISOString(),
      players,
    });
  });
  // update remote cache
  await setCache(cacheKey, newState);
  // update local cache
  cache = newState;

  //   return the new game as a result
  const newGame = cache?.games?.find((ele) => ele?.id === newGameId);
  const result = JSON.stringify(newGame);
  return new Response(result, {
    status: 200,
    headers,
  });
};
const addRound = async (request) => {
  const input = await request.json();
  let cache = await getCache(cacheKey);
  const currentState = cache || defaultData;
  const newRoundId =
    (currentState?.games?.find((game) => game?.id === input?.game_id)?.rounds
      ?.length || 0) + 1;
  const newRound = {
    id: newRoundId,
    created_at: new Date().toISOString(),
    players: input?.players,
  };
  const newState = produce(currentState, (draft) => {
    const game = draft?.games?.find((game) => game?.id === input?.game_id);
    game.rounds = [...(game?.rounds || []), newRound];
  });
  // update remote cache
  await setCache(cacheKey, newState);
  // update local cache
  cache = newState;

  //   return the new game as a result
  const result = JSON.stringify(newRound);
  return new Response(result, {
    status: 200,
    headers,
  });
};

router.get("/games", getGames);

router.get("/games/:id", getGame);

router.post("/addgame", addGame);
router.post("/addround", addRound);

// 404 for everything else
router.all("*", () => new Response("Not Found.", { status: 404 }));

// attach the router "handle" to the event handler
addEventListener("fetch", async (event) => {
  return event.respondWith(router.handle(event.request));
});
addEventListener("scheduled", async (controller, env, ctx) => {
  // - `controller` contains `scheduledTime` and `cron` properties
  // - `env` contains bindings, KV namespaces, Durable Objects, etc
  // - `ctx` contains the `waitUntil` method
  console.log("Doing something scheduled...");
});
