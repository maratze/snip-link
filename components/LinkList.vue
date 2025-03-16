<template>
	<v-card class="link-list">
		<v-card-title>Your Shortened Links</v-card-title>
		<v-card-text>
			<v-list v-if="links.length > 0">
				<v-list-item v-for="link in links" :key="link.id">
					<v-list-item-title>
						<a :href="link.shortUrl" target="_blank" class="link">{{ link.shortUrl }}</a>
					</v-list-item-title>
					<v-list-item-subtitle>
						<a :href="link.originalUrl" target="_blank" class="original-link">
							{{ truncate(link.originalUrl, 50) }}
						</a>
					</v-list-item-subtitle>
					<v-list-item-append>
						<v-btn icon @click="copyToClipboard(link.shortUrl)">
							<v-icon>mdi-content-copy</v-icon>
						</v-btn>
					</v-list-item-append>
				</v-list-item>
			</v-list>
			<v-alert v-else type="info">No links shortened yet.</v-alert>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { LinkResponse } from '../types/link';

const links = ref<LinkResponse[]>([]);

onMounted(async () => {
	await fetchLinks();
});

const fetchLinks = async () => {
	try {
		const response = await $fetch<LinkResponse[]>('/api/links');
		links.value = response;
	} catch (error: any) {
		console.error('Failed to fetch links: ', error);
	}
};

const copyToClipboard = (url: string) => {
	navigator.clipboard
		.writeText(url)
		.then(() => {
			alert('Copied!');
		})
		.catch((err) => {
			console.error('Failed to copy: ', err);
			alert('Failed to copy URL. Please copy manually.');
		});
};

const truncate = (str: string, n: number) => {
	return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
};
</script>

<style scoped>
.link-list {
	border-radius: 16px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.link {
	color: var(--v-primary-base);
	text-decoration: none;
	transition: color 0.2s ease-in-out;
}

.link:hover {
	color: var(--v-secondary-base);
}

.original-link {
	color: var(--v-text-disabled);
	text-decoration: none;
}
</style>