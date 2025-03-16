<template>
	<v-btn @click="toggleTheme">
		<v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
		<span>{{ isDark ? 'Light' : 'Dark' }}</span>
	</v-btn>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { computed } from 'vue'

const theme = useTheme()

const isDark = computed({
	get: () => theme.global.name.value === 'dark',
	set: (val: boolean) => { // Add type boolean
		theme.global.name.value = val ? 'dark' : 'light'
		localStorage.setItem('theme', val ? 'dark' : 'light')
	},
})

const toggleTheme = () => {
	isDark.value = !isDark.value
}
</script>