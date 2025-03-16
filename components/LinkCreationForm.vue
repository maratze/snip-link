<template>
	<v-card class="link-form">
		<v-card-title class="headline">Shorten Your Link</v-card-title>
		<v-card-text>
			<v-form @submit.prevent="createLink">
				<v-text-field
					v-model="originalUrl"
					label="Original URL"
					type="url"
					required
					variant="outlined"
					color="primary"
				></v-text-field>
				<v-text-field
					v-model="customAlias"
					label="Custom Alias (optional)"
					variant="outlined"
					color="primary"
				></v-text-field>
				<v-btn
					type="submit"
					color="primary"
					class="shorten-button"
					:loading="isLoading"
					:disabled="isLoading"
				>
					<v-icon start>mdi-link</v-icon>
					{{ isLoading ? 'Shortening...' : 'Shorten' }}
				</v-btn>
			</v-form>
			<div v-if="shortUrl" class="shortened-link">
				<p>
					Shortened URL:
					<a :href="shortUrl" target="_blank" class="link">{{ shortUrl }}</a>
					<v-btn icon @click="copyToClipboard" class="copy-button">
						<v-icon>mdi-content-copy</v-icon>
					</v-btn>
				</p>
				<v-alert type="success" v-if="copySuccess">Copied!</v-alert>
				<a
					:href="originalUrl"
					target="_blank"
					rel="noopener noreferrer"
					class="preview-link"
				>Preview</a
				>
			</div>
			<v-alert type="error" v-if="errorMessage">{{ errorMessage }}</v-alert>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LinkResponse } from '../types/link';

const originalUrl = ref<string>('');
const customAlias = ref<string>('');
const shortUrl = ref<string>('');
const errorMessage = ref<string>('');
const copySuccess = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const createLink = async () => {
	isLoading.value = true;
	try {
		const response = await $fetch<LinkResponse>('/api/links/create', {
			method: 'POST',
			body: {
				originalUrl: originalUrl.value,
				customAlias: customAlias.value,
			},
		});
		shortUrl.value = response.shortUrl;
		errorMessage.value = '';
	} catch (error: any) {
		errorMessage.value = error.message || 'Something went wrong';
		shortUrl.value = '';
	} finally {
		isLoading.value = false;
	}
};

const copyToClipboard = () => {
	navigator.clipboard
		.writeText(shortUrl.value)
		.then(() => {
			copySuccess.value = true;
			setTimeout(() => {
				copySuccess.value = false;
			}, 2000);
		})
		.catch((err) => {
			console.error('Failed to copy: ', err);
			alert('Failed to copy URL. Please copy manually.');
		});
};
</script>

<style scoped>
.link-form {
	max-width: 600px;
	margin: 0 auto;
	border-radius: 16px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.headline {
	font-size: 2rem;
	font-weight: 500;
	color: var(--v-primary-base);
}

.shorten-button {
	margin-top: 16px;
	border-radius: 8px;
}

.shortened-link {
	margin-top: 16px;
	padding: 16px;
	background-color: var(--v-background-lighten1);
	border-radius: 8px;
}

.link {
	color: var(--v-secondary-base);
	text-decoration: none;
	transition: color 0.2s ease-in-out;
}

.link:hover {
	color: var(--v-primary-base);
}

.copy-button {
	margin-left: 8px;
}

.preview-link {
	margin-top: 8px;
	display: block;
	color: var(--v-primary-base);
	text-decoration: none;
	transition: color 0.2s ease-in-out;
}

.preview-link:hover {
	color: var(--v-secondary-base);
}
</style>