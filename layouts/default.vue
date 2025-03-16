<template>
	<v-app>
		<v-app-bar app>
			<v-toolbar-title>Short Link</v-toolbar-title>
			<v-spacer></v-spacer>
			<ThemeSwitcher />
		</v-app-bar>

		<v-main class="pa-4">
			<NuxtPage />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()

onMounted(() => {
	// Set the initial theme based on localStorage or system preference
	const storedTheme = localStorage.getItem('theme') || 'light';
	theme.global.name.value = storedTheme;
});
</script>