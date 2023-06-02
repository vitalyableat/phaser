export const gameObjectsToObjectPointsAdapter = (gameObjects: unknown[]): ObjectPoint[] => {
  return gameObjects.map((gameObject) => gameObject as ObjectPoint);
};
