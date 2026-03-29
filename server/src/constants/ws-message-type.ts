export const WS_MESSAGE_TYPE = {
	IN: {
		REG: 'reg',
		CREATE_GAME: 'create_game',
		JOIN_GAME: 'join_game',
		START_GAME: 'start_game',
		ANSWER: 'answer',
	},
	OUT: {
		REG: 'reg',
		GAME_CREATED: 'game_created',
		GAME_JOINED: 'game_joined',
		PLAYER_JOINED: 'player_joined',
		UPDATE_PLAYERS: 'update_players',
		QUESTION: 'question',
		ANSWER_ACCEPTED: 'answer_accepted',
		QUESTION_RESULT: 'question_result',
		GAME_FINISHED: 'game_finished',
	},
} as const;
