// Simple input validators to prevent bad data.
export function validateScorePayload(body){
  const errors = [];
  if (!body) errors.push('Missing body');
  const playerName = String(body.playerName || '').trim();
  const score = Number(body.score);
  const game = String(body.game || '').trim();
  if (!playerName) errors.push('playerName required');
  if (!Number.isFinite(score)) errors.push('score must be a number');
  if (!game) errors.push('game required');
  if (playerName.length > 50) errors.push('playerName too long');
  if (game.length > 50) errors.push('game too long');
  return { ok: errors.length === 0, errors, value: { playerName, score, game, meta: body.meta || null } };
}