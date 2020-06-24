import { create, tsx } from '@dojo/framework/core/vdom';
import Weather from '../../weather/Weather';

const factory = create();

export default factory(function BasicWeather() {
	return <Weather readonly={false} locations={['london']} onChange={() => {}} />;
});
