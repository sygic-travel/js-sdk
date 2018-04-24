import { Alert, DetailedAlert, Severity, State, Type, } from '../Alerts/Alert';

export const alerts: Alert[] =  [{
		id: 16530,
		name: 'Moderate Avalanche',
		perex: 'Moderate avalanches warning',
		type: Type.AVALANCHE,
		severity: Severity.MODERATE,
		state: State.ACTIVE,
		affectedArea: {
			type: 'Polygon',
			coordinates: [
				[
					[
						6.9020837358,
						44.3605475163
					],
					[
						6.94806145733,
						44.6521546056
					],
					[
						6.70473500948,
						44.5394538716
					],
					[
						6.09156767489,
						44.4768386673
					],
					[
						5.96956841173,
						44.4026973334
					],
					[
						5.67602819072,
						44.1914222257
					],
					[
						5.49679557359,
						44.1155995681
					],
					[
						5.75219923206,
						43.7232730726
					],
					[
						6.63607513361,
						43.7885852297
					],
					[
						6.69616222611,
						43.8749085662
					],
					[
						6.74768315574,
						44.0634687418
					],
					[
						6.7049403906,
						44.1447860845
					],
					[
						6.69847193286,
						44.1901432157
					],
					[
						6.72630364857,
						44.2517161355
					],
					[
						6.80454268976,
						44.3208218327
					],
					[
						6.84090305639,
						44.3456580717
					],
					[
						6.9020837358,
						44.3605475163
					]
				]
			]
		},
		validFrom: '2018-04-24T04:00:00+00:00',
		validTo: '2018-04-25T04:00:00+00:00',
		updatedAt: '2018-04-24T07:39:10+00:00',
		origin: 'cap_collator_bot',
		provider: 'vigilance@meteo.fr',
		providerUrl: 'vigilance@meteo.fr'
	}
];

export const detailedAlert: DetailedAlert = {
	id: 16530,
	name: 'Moderate Avalanche',
	perex: 'Moderate avalanches warning',
	type: Type.AVALANCHE,
	severity: Severity.MODERATE,
	state: State.ACTIVE,
	affectedArea: {
		type: 'Polygon',
		coordinates: [
			[
				[
					6.9020837358,
					44.3605475163
				],
				[
					6.94806145733,
					44.6521546056
				],
				[
					6.70473500948,
					44.5394538716
				],
				[
					6.09156767489,
					44.4768386673
				],
				[
					5.96956841173,
					44.4026973334
				],
				[
					5.67602819072,
					44.1914222257
				],
				[
					5.49679557359,
					44.1155995681
				],
				[
					5.75219923206,
					43.7232730726
				],
				[
					6.63607513361,
					43.7885852297
				],
				[
					6.69616222611,
					43.8749085662
				],
				[
					6.74768315574,
					44.0634687418
				],
				[
					6.7049403906,
					44.1447860845
				],
				[
					6.69847193286,
					44.1901432157
				],
				[
					6.72630364857,
					44.2517161355
				],
				[
					6.80454268976,
					44.3208218327
				],
				[
					6.84090305639,
					44.3456580717
				],
				[
					6.9020837358,
					44.3605475163
				]
			]
		]
	},
	validFrom: '2018-04-24T04:00:00+00:00',
	validTo: '2018-04-25T04:00:00+00:00',
	updatedAt: '2018-04-24T07:39:10+00:00',
	origin: 'cap_collator_bot',
	provider: 'vigilance@meteo.fr',
	providerUrl: 'vigilance@meteo.fr',
	description: `Although rather usual in this region, locally or potentially dangerous phenomena are expected. \
(such as local winds, summer thunderstorms, rising streams or high waves)`,
	webUrl: 'http://vigilance.meteofrance.com/',
	externalId: '2.49.0.0.250.0.FR.20180424060233.168028',
	geometry: null
};
