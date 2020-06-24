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
		put(
			{
				data: [
					{
						name: json.name,
						temp: json.main.temp.toFixed(),
						minTemp: json.main.temp_min.toFixed(),
						maxTemp: json.main.temp_max.toFixed(),
						windSpeed: 1,
						humidity: 1,
						description: json.weather.map((item: any) => item.description),
						icon: icons[json.weather[0].icon]
					}
				],
				total: 1
			},
			request
		);
	}
});

interface WeatherDetailsProperties {
	location: string;
}

const factory = create({ resource })
	.properties<WeatherDetailsProperties>()
	.key('location');

export default factory(function Weather({ id, properties, middleware: { resource } }) {
	const { location } = properties();
	const { createOptions, getOrRead } = resource;
	const options = createOptions(id);
	const [weatherDetails] = getOrRead(weatherTemplate, options({ query: { name: location } }));
	if (weatherDetails) {
		const [weatherDetail] = weatherDetails;
		return (
			<div classes={css.root}>
				<div classes={css.container}>
					<h2 classes={css.header}>{weatherDetail.name}</h2>
					<div>
						<div>{new Date().toLocaleDateString()}</div>
						<div classes={css.hr}></div>
						<div classes={css.current}>{`${weatherDetail.temp} °C`}</div>
						<div classes={css.range}>{`${weatherDetail.minTemp} / ${weatherDetail.maxTemp} °C`}</div>
						<div classes={css.desc}>
							<i classes={[css.icon, 'wi', weatherDetail.icon]}></i>
							{weatherDetail.description.map((item) => item).join(' or ')}
						</div>
						<div classes={css.hr}></div>
						<div>
							<div classes={css.info}>
								<span>Wind: </span>
								{`${weatherDetail.windSpeed} km/h`}
							</div>
							<div classes={css.info}>
								<span>Humidity: </span>
								{`${weatherDetail.humidity} %`}
							</div>
						</div>
					</div>
				</div>
				<div classes={css.containerRight}>
					<i classes={[css.mainIcon, 'wi', weatherDetail.icon]}></i>
				</div>
			</div>
		);
	}
	return 'Loading';
});
