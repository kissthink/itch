import db from "../../db";
import Game from "../../db/models/game";
import DownloadKey from "../../db/models/download-key";
import { IStore, IGameCredentials } from "../../types";

import { filter, findWhere, first } from "underscore";

// TODO: handle passwords & secrets as well.

export default async function getGameCredentials(
  store: IStore,
  game: Game,
): Promise<IGameCredentials> {
  return await getGameCredentialsInternal(store, game.id, game.inPressSystem);
}

export async function getGameCredentialsForId(
  store: IStore,
  gameId: number,
): Promise<IGameCredentials> {
  return await getGameCredentialsInternal(store, gameId, false);
}

async function getGameCredentialsInternal(
  store: IStore,
  gameId: number,
  inPressSystem: boolean,
): Promise<IGameCredentials> {
  const state = store.getState();

  const currentUserCreds = state.session.credentials;
  if (!currentUserCreds || !currentUserCreds.me) {
    // not logged in :(
    return null;
  }

  if (currentUserCreds.me.pressUser && inPressSystem) {
    // we got full access, look no further!
    return {
      apiKey: currentUserCreds.key,
      downloadKey: null,
    };
  }

  // fish for a download key
  const allDownloadKeys = await db.downloadKeys.find({
    gameId,
  });

  const sessions = state.rememberedSessions;
  const hasValidSession = (k: DownloadKey) => {
    const session = sessions[k.ownerId];
    return !!(session && session.key);
  };

  const downloadKeys = filter(allDownloadKeys, hasValidSession);

  // prefer our key, if we have one
  const currentUserKey = findWhere(downloadKeys, {
    ownerId: currentUserCreds.me.id,
  });
  const downloadKey = currentUserKey || first(downloadKeys) || null;
  const apiKey = downloadKey
    ? sessions[downloadKey.ownerId].key
    : currentUserCreds.key;

  return {
    downloadKey,
    apiKey,
  };
}
