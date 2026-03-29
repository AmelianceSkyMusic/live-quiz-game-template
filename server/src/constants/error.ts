export const ERROR = {
	USER_ALREADY_LOGGED_IN: `
Whoa, Double Trouble! 🕵️‍♂️
Our system just did a double-take—you’re already on the quiz participant list!
Unless you’ve mastered cloning, you’re already set to win.
`,
	WS_NOT_INITIALIZED: 'WebSocket server is not initialized',
	USER_NOT_FOUND: 'User not found',
	GAME_NOT_FOUND: 'Game not found! Maybe the code is wrong or the game has already ended',
	GAME_ALREADY_STARTED: 'Game already started',
	GAME_ALREADY_FINISHED: 'Game already finished',
	NO_PLAYERS_IN_GAME: 'No players in game',
	PLAYER_ALREADY_IN_GAME: 'Player already in game',
	QUESTION_NOT_FOUND: 'Question not found',
	UNKNOWN_ERROR: 'Unknown error',
	WRONG_PASSWORD: 'Wrong password',
	HOST_DISCONNECTED: 'Host disconnected! Game is over! Please find another game!',
	HOST_NOT_FOUND: 'Host not found',
} as const;
