import { Container } from '@cloudflare/containers';

export class MyContainer extends Container<Env> {
	envVars = {
		DISCORD_TOKEN: this.env.DISCORD_TOKEN,
		DISCORD_CLIENT_ID: this.env.DISCORD_TOKEN,
	};

	// Optional lifecycle hooks
	override onStart() {
		console.log('Container successfully started');
	}

	override onStop() {
		console.log('Container successfully shut down');
	}

	override onError(error: unknown) {
		console.log('Container error:', error);
	}
}

export default {
	async fetch(): Promise<Response> {
		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
