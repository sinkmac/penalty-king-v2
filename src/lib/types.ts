export type Phase = 'select' | 'order' | 'shootout' | 'scorecard';

export type Team = {
	name: string;
	code: string;
	color: string;
};

export type Kicker = 'team1' | 'team2';

export type Kick = {
	kicker: Kicker;
	predictionZone: number;
};

export type AppState = {
	phase: Phase;
	team1: Team | null;
	team2: Team | null;
	firstKicker: Kicker | null;
	kicks: Kick[];
	inSuddenDeath: boolean;
	matchTitle: string;
};

export function flagClass(team: Team) {
	if (team.code === 'EN') return 'gb-eng';
	if (team.code === 'SC') return 'gb-sct';
	return team.code.toLowerCase();
}

export function otherKicker(kicker: Kicker): Kicker {
	return kicker === 'team1' ? 'team2' : 'team1';
}

export function kickerForIndex(index: number, firstKicker: Kicker): Kicker {
	return index % 2 === 0 ? firstKicker : otherKicker(firstKicker);
}

export function teamForKicker(kicker: Kicker, team1: Team, team2: Team): Team {
	return kicker === 'team1' ? team1 : team2;
}

export function kickLabel(index: number) {
	if (index < 10) return `Shot ${Math.floor(index / 2) + 1} of 5`;
	return `Sudden death kick ${index - 9}`;
}
