import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createResourceMiddleware,
	createResourceTemplate,
	defaultFind
} from '@dojo/framework/core/middleware/resources';
import ChipTypeAhead from '@dojo/widgets/chip-typeahead';
import WeatherDetails from './WeatherDetails';

const resource = createResourceMiddleware();

const capitalCityTemplate = createResourceTemplate<{ value: string }>({
	find: defaultFind,
	read: async (request, { put }) => {
		const { offset, size, query } = request;
		let url = `https://dramatic-carbonated-goldfish.glitch.me/capitals?size=${size}&offset=${offset}`;
		if (query.value) {
			url = `${url}&query=${query.value}`;
		}
		const response = await fetch(url);
		const json = await response.json();
		put(json, request);
	}
});

interface WeatherProperties {
	readonly?: boolean;
	locations: string[];
	onChange: (locations: string[]) => void;
}

const factory = create({ resource }).properties<WeatherProperties>();

export default factory(function Weather({ properties, middleware: { resource } }) {
	const { readonly = false, locations = [], onChange } = properties();
	return (
		<div>
			{!readonly && (
				<ChipTypeAhead
					resource={resource({ template: capitalCityTemplate })}
					onValue={(value) => {
						console.log(value);
						onChange(value);
					}}
					value={locations}
				>
					{{
						label: 'Select Capital Cities'
					}}
				</ChipTypeAhead>
			)}
			{locations.map((location) => (
				<WeatherDetails location={location}></WeatherDetails>
			))}
		</div>
	);
	// }
});
