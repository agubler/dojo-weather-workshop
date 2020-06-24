import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createResourceMiddleware,
	createResourceTemplate,
	defaultFind
} from '@dojo/framework/core/middleware/resources';
import * as css from './Weather.m.css';
import icons from './icons';

const resource = createResourceMiddleware();

interface WeatherDetails {
	name: string;
	temp: number;
	maxTemp: number;
	minTemp: number;
	description: string[];
	icon: string;
	windSpeed: number;
	humidity: number;
}

const weatherTemplate = createResourceTemplate<WeatherDetails>({
	find: defaultFind,
	read: async (request, { put }) => {
		const { query } = request;
		const response = await fetch(`https://dramatic-carbonated-goldfish.glitch.me/weather?query=${query.name}`);
		const json = await response.json();
		console.log(json);
		put(json, request);
	}
});

interface WeatherDetailsProperties {
	location: string;
}

const factory = create({ resource }).properties<WeatherDetailsProperties>();

export default factory(function Weather({ id, properties, middleware: { resource } }) {
	const { location } = properties();
	const { createOptions, getOrRead } = resource;
	const options = createOptions(id);
	const [weatherDetails] = getOrRead(weatherTemplate, options({ query: { name: location } }));
	console.log(weatherDetails);
	if (weatherDetails) {
		const [weatherDetail] = weatherDetails;
		console.log(weatherDetail);
		return (
			<div classes={css.root}>
				<div classes={css.leading}>
					<div>
						<p classes={css.time}>{new Date().toLocaleTimeString('en-US')}</p>
						<h1 classes={css.name}>{weatherDetail.name}</h1>
					</div>
					<div classes={css.info}>
						<div>{`${weatherDetail.minTemp} / ${weatherDetail.maxTemp}°C`}</div>
						<div classes={css.description}>
							{weatherDetail.description.map((item) => item).join(' or ')}
							{' '}<i classes={[css.icon, 'wi', weatherDetail.icon]}></i>							
						</div>
					</div>
				</div>
				<div classes={css.trailing}>
					{`${weatherDetail.temp}°C`}
				</div>
			</div>
		);
	}
	return 'Loading';
});
