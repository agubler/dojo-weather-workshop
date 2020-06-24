import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Weather from '../../weather/Weather';

const factory = create({ icache });

export default factory(function BasicWeather({ middleware: { icache } }) {
	const locations = icache.getOrSet('locations', ['London']);
	return (
		<Weather
			readonly={false}
			locations={locations}
			onChange={(values) => {
				icache.set('locations', values);
			}}
		/>
	);
});
